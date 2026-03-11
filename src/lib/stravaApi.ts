import { StravaTokens, StravaActivity } from '../types';
import { storage } from './storage';

// Sport types that count toward running mileage/elevation
const RUNNING_SPORT_TYPES = new Set([
  'Run', 'TrailRun', 'VirtualRun',
]);

// Sport types that are cross-training (no mileage impact)
const XTRAIN_SPORT_TYPES = new Set([
  'Ride', 'VirtualRide', 'MountainBikeRide', 'EBikeRide',
  'Elliptical', 'StairStepper', 'Swim', 'Rowing', 'Hike',
  'Snowboard', 'NordicSki', 'BackcountrySki', 'Skateboard',
  'InlineSkate', 'RockClimbing', 'Kayaking', 'Canoeing',
  'Surfing', 'Windsurf', 'Crossfit', 'WeightTraining',
  'Workout',
]);

// Yoga — tracked as event, zero mileage/vert
const YOGA_SPORT_TYPES = new Set(['Yoga']);

const TOKEN_URL = 'https://www.strava.com/oauth/token';
const API_BASE = 'https://www.strava.com/api/v3';
const REDIRECT_URI = 'https://tjcycyota.github.io/TigerClaw2026Training/callback';

function getClientId(): string {
  return localStorage.getItem('tc50k_client_id') ?? '';
}

export function getStravaAuthUrl(): string {
  const clientId = getClientId();
  if (!clientId) throw new Error('Strava Client ID not configured');
  const params = new URLSearchParams({
    client_id: clientId,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
  });
  return `https://www.strava.com/oauth/authorize?${params}`;
}

export async function exchangeCode(code: string, clientId: string, clientSecret: string): Promise<StravaTokens> {
  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, code, grant_type: 'authorization_code' }),
  });
  if (!resp.ok) throw new Error(`Token exchange failed: ${resp.status}`);
  const data = await resp.json();
  return { accessToken: data.access_token, refreshToken: data.refresh_token, expiresAt: data.expires_at, scope: data.scope };
}

export async function refreshTokens(tokens: StravaTokens, clientId: string, clientSecret: string): Promise<StravaTokens> {
  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ client_id: clientId, client_secret: clientSecret, refresh_token: tokens.refreshToken, grant_type: 'refresh_token' }),
  });
  if (!resp.ok) throw new Error(`Token refresh failed: ${resp.status}`);
  const data = await resp.json();
  return { accessToken: data.access_token, refreshToken: data.refresh_token, expiresAt: data.expires_at, scope: tokens.scope };
}

async function getAccessToken(clientId: string, clientSecret: string): Promise<string> {
  let tokens = storage.getTokens();
  if (!tokens) throw new Error('Not authenticated with Strava');
  const nowPlus5min = Math.floor(Date.now() / 1000) + 300;
  if (tokens.expiresAt < nowPlus5min) {
    tokens = await refreshTokens(tokens, clientId, clientSecret);
    storage.setTokens(tokens);
  }
  return tokens.accessToken;
}

export async function fetchActivitiesSince(
  afterDate: string,
  clientId: string,
  clientSecret: string
): Promise<StravaActivity[]> {
  const accessToken = await getAccessToken(clientId, clientSecret);
  // Interpret afterDate as PST (UTC-8) midnight to avoid missing activities on that day
  const afterEpoch = Math.floor(new Date(`${afterDate}T00:00:00-08:00`).getTime() / 1000);

  const activities: StravaActivity[] = [];
  let page = 1;

  while (true) {
    const url = `${API_BASE}/athlete/activities?after=${afterEpoch}&per_page=100&page=${page}`;
    const resp = await fetch(url, { headers: { Authorization: `Bearer ${accessToken}` } });
    if (!resp.ok) throw new Error(`Strava API error: ${resp.status}`);
    const batch = await resp.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    for (const act of batch) {
      const sportType: string = act.sport_type ?? '';
      const isRunning = RUNNING_SPORT_TYPES.has(sportType);
      const isYoga = YOGA_SPORT_TYPES.has(sportType);
      // Skip cycling and other xtrain from count — they show as xtrain events but 0 miles
      const distMi = isRunning ? (act.distance ?? 0) / 1609.344 : 0;
      const elevFt = isRunning ? (act.total_elevation_gain ?? 0) * 3.28084 : 0;

      activities.push({
        id: act.id,
        name: act.name,
        sport_type: sportType,
        start_date_local: act.start_date_local,
        distance_miles: distMi,
        elevation_ft: elevFt,
        moving_time: act.moving_time ?? 0,
        pace_min_mile: isRunning && act.average_speed > 0 ? 26.8224 / act.average_speed : null,
        average_heartrate: act.average_heartrate ?? null,
        isRunning,
      });
    }

    if (batch.length < 100) break;
    page++;
  }

  return activities;
}

export function matchActivitiesToWorkouts(
  activities: StravaActivity[],
  workoutDate: string
): StravaActivity[] {
  // Use exact date match only — start_date_local from Strava is already in local time
  return activities.filter(a => a.start_date_local.split('T')[0] === workoutDate);
}

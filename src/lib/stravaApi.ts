import { StravaTokens, StravaActivity } from '../types';
import { storage } from './storage';

const CLIENT_ID = '204869';
const REDIRECT_URI = 'https://tjcycyota.github.io/TigerClaw2026Training/callback';
const TOKEN_URL = 'https://www.strava.com/oauth/token';
const API_BASE = 'https://www.strava.com/api/v3';

// ─── Auth URL ─────────────────────────────────────────────────────────────────
export function getStravaAuthUrl(): string {
  const params = new URLSearchParams({
    client_id: CLIENT_ID,
    redirect_uri: REDIRECT_URI,
    response_type: 'code',
    approval_prompt: 'auto',
    scope: 'activity:read_all',
  });
  return `https://www.strava.com/oauth/authorize?${params}`;
}

// ─── Token exchange (called by callback page, then stored) ────────────────────
export async function exchangeCode(code: string, clientSecret: string): Promise<StravaTokens> {
  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: clientSecret,
      code,
      grant_type: 'authorization_code',
    }),
  });
  if (!resp.ok) throw new Error(`Token exchange failed: ${resp.status}`);
  const data = await resp.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    scope: data.scope,
  };
}

// ─── Token refresh ────────────────────────────────────────────────────────────
export async function refreshTokens(tokens: StravaTokens, clientSecret: string): Promise<StravaTokens> {
  const resp = await fetch(TOKEN_URL, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      client_id: CLIENT_ID,
      client_secret: clientSecret,
      refresh_token: tokens.refreshToken,
      grant_type: 'refresh_token',
    }),
  });
  if (!resp.ok) throw new Error(`Token refresh failed: ${resp.status}`);
  const data = await resp.json();
  return {
    accessToken: data.access_token,
    refreshToken: data.refresh_token,
    expiresAt: data.expires_at,
    scope: tokens.scope,
  };
}

// ─── Get valid access token (auto-refresh if needed) ─────────────────────────
async function getAccessToken(clientSecret: string): Promise<string> {
  let tokens = storage.getTokens();
  if (!tokens) throw new Error('Not authenticated with Strava');

  const nowPlus5min = Math.floor(Date.now() / 1000) + 300;
  if (tokens.expiresAt < nowPlus5min) {
    tokens = await refreshTokens(tokens, clientSecret);
    storage.setTokens(tokens);
  }
  return tokens.accessToken;
}

// ─── Fetch activities since a date ───────────────────────────────────────────
export async function fetchActivitiesSince(
  afterDate: string,   // ISO "2026-02-09"
  clientSecret: string
): Promise<StravaActivity[]> {
  const accessToken = await getAccessToken(clientSecret);
  const afterEpoch = Math.floor(new Date(afterDate).getTime() / 1000);

  const activities: StravaActivity[] = [];
  let page = 1;
  const perPage = 100;

  while (true) {
    const url = `${API_BASE}/athlete/activities?after=${afterEpoch}&per_page=${perPage}&page=${page}`;
    const resp = await fetch(url, {
      headers: { Authorization: `Bearer ${accessToken}` },
    });
    if (!resp.ok) throw new Error(`Strava API error: ${resp.status}`);
    const batch = await resp.json();
    if (!Array.isArray(batch) || batch.length === 0) break;

    for (const act of batch) {
      activities.push({
        id: act.id,
        name: act.name,
        sport_type: act.sport_type,
        start_date_local: act.start_date_local,
        distance_miles: (act.distance ?? 0) / 1609.344,
        elevation_ft: (act.total_elevation_gain ?? 0) * 3.28084,
        moving_time: act.moving_time ?? 0,
        pace_min_mile: act.average_speed > 0 ? 26.8224 / act.average_speed : null,
        average_heartrate: act.average_heartrate ?? null,
      });
    }

    if (batch.length < perPage) break;
    page++;
  }

  return activities;
}

// ─── Match activities to planned workouts (±1 day tolerance) ─────────────────
export function matchActivitiesToWorkouts(
  activities: StravaActivity[],
  workoutDate: string
): StravaActivity[] {
  const target = new Date(workoutDate);
  const prev = new Date(target); prev.setDate(prev.getDate() - 1);
  const next = new Date(target); next.setDate(next.getDate() + 1);

  const fmt = (d: Date) => d.toISOString().split('T')[0];
  const validDates = new Set([fmt(prev), workoutDate, fmt(next)]);

  return activities.filter(a => {
    const actDate = a.start_date_local.split('T')[0];
    return validDates.has(actDate);
  });
}

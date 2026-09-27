import { supabase } from './supabase';

export type PilotEventName =
  | 'menu_open'
  | 'vibe_open'
  | 'vibe_item_view'
  | 'dish_open'
  | 'favorite_add'
  | 'favorite_remove'
  | 'category_open'
  | 'club_open';

interface PilotEventContext {
  dishId?: string;
  categoryId?: string;
  source?: string;
  metadata?: Record<string, unknown>;
}

const SESSION_KEY = 'gastro-vibe-pilot-session';

const getPilotSessionId = () => {
  try {
    const existing = window.sessionStorage.getItem(SESSION_KEY);
    if (existing) return existing;

    const next = typeof crypto !== 'undefined' && 'randomUUID' in crypto
      ? crypto.randomUUID()
      : `pilot_${Date.now()}_${Math.random().toString(36).slice(2, 10)}`;

    window.sessionStorage.setItem(SESSION_KEY, next);
    return next;
  } catch {
    return undefined;
  }
};

export const trackPilotEvent = async (
  eventName: PilotEventName,
  context: PilotEventContext = {}
) => {
  try {
    const { error } = await supabase.from('pilot_events').insert({
      event_name: eventName,
      dish_id: context.dishId || null,
      category_id: context.categoryId || null,
      session_id: getPilotSessionId() || null,
      source: context.source || 'web',
      metadata: context.metadata || {},
    });

    if (error && import.meta.env.DEV) {
      console.warn('Pilot analytics error', error.message);
    }
  } catch (error) {
    if (import.meta.env.DEV) {
      console.warn('Pilot analytics unavailable', error);
    }
  }
};

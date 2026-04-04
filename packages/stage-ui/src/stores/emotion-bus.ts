import type { EmotionPayload } from '../constants/emotions'

import { defineStore } from 'pinia'

/**
 * Lightweight event bus for emotion signals from the LLM set_emotion tool.
 * Tool execute() calls emit(); Stage.vue subscribes and drives the animation queue.
 */
export const useEmotionBusStore = defineStore('emotion-bus', () => {
  const handlers = new Set<(payload: EmotionPayload) => void>()

  /** Subscribe to emotion events. Returns a disposer. */
  function on(handler: (payload: EmotionPayload) => void): () => void {
    handlers.add(handler)
    return () => handlers.delete(handler)
  }

  /** Emit an emotion event to all current subscribers. */
  function emit(payload: EmotionPayload): void {
    handlers.forEach(h => h(payload))
  }

  return { on, emit }
})

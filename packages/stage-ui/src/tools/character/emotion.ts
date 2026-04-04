import { tool } from '@xsai/tool'
import { z } from 'zod'

import { EMOTION_VALUES } from '../../constants/emotions'
import { useEmotionBusStore } from '../../stores/emotion-bus'

/**
 * Creates the set_emotion tool that the LLM calls to animate the character.
 * The tool's execute() emits to useEmotionBusStore; Stage.vue subscribes and
 * drives the Live2D / VRM animation queue.
 */
export async function createEmotionTool() {
  const emotionBusStore = useEmotionBusStore()

  return tool({
    name: 'set_emotion',
    description: [
      'Animate the character with the given emotion.',
      'Call this at the START of every response to set the initial mood,',
      'and again whenever the emotional tone shifts mid-response.',
      `Available emotions: ${EMOTION_VALUES.join(', ')}.`,
    ].join(' '),
    parameters: z.object({
      emotion: z.enum(EMOTION_VALUES as [string, ...string[]])
        .describe('The emotion to display on the character model.'),
      intensity: z.number().min(0).max(1).optional()
        .describe('Intensity from 0.0 (subtle) to 1.0 (full). Defaults to 1.0.'),
    }),
    execute: async ({ emotion, intensity = 1 }) => {
      emotionBusStore.emit({ name: emotion as any, intensity })
      return `emotion set: ${emotion} (intensity ${intensity})`
    },
  })
}

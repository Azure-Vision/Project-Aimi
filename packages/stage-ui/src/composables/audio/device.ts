import { useUserMedia } from '@vueuse/core'
import { computed } from 'vue'

export function useAudioDevice() {
  const deviceConstraints = computed<MediaStreamConstraints>(() => ({
    audio: {
      autoGainControl: true,
      echoCancellation: true,
      noiseSuppression: true,
    },
  }))
  const { stream, stop: stopStream, start: startStream } = useUserMedia({ constraints: deviceConstraints, enabled: false, autoSwitch: true })

  return {
    stream,
    stopStream,
    startStream,
    deviceConstraints,
  }
}

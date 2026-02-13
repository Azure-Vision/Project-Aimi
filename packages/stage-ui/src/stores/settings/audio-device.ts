import { useLocalStorageManualReset } from '@proj-airi/stage-shared/composables'
import { defineStore } from 'pinia'
import { onMounted, watch } from 'vue'

import { useAudioDevice } from '../audio'

export const useSettingsAudioDevice = defineStore('settings-audio-devices', () => {
  const { deviceConstraints, startStream, stopStream, stream, askPermission } = useAudioDevice()

  const selectedAudioInputEnabledPersist = useLocalStorageManualReset<boolean>('settings/audio/input/enabled', false)

  watch(selectedAudioInputEnabledPersist, (val) => {
    if (val) {
      startStream()
    }
    else {
      stopStream()
    }
  })

  onMounted(() => {
    if (selectedAudioInputEnabledPersist.value) {
      startStream()
    }
  })

  function resetState() {
    selectedAudioInputEnabledPersist.reset()
    stopStream()
  }

  return {
    deviceConstraints,
    enabled: selectedAudioInputEnabledPersist,

    stream,

    askPermission,
    startStream,
    stopStream,
    resetState,
  }
})

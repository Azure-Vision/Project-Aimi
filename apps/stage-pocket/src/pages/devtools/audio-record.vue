<script setup lang="ts">
import { useObjectUrl } from '@vueuse/core'
import { BufferTarget, MediaStreamAudioTrackSource, Output, QUALITY_MEDIUM, WavOutputFormat } from 'mediabunny'
import { computed, ref } from 'vue'

async function getMediaStreamTrack() {
  const stream = await navigator.mediaDevices.getUserMedia({ audio: true })
  return stream.getAudioTracks()[0]
}

let output: Output | undefined
let audioInputTrack: MediaStreamAudioTrack | undefined
let format: string | undefined

const recorded = ref<ArrayBuffer[]>([])
const recordedUrls = computed(() => recorded.value.map(rec => useObjectUrl(new Blob([rec], { type: format })).value))

async function handleStart() {
  audioInputTrack = await getMediaStreamTrack()
  output = new Output({ format: new WavOutputFormat(), target: new BufferTarget() })

  const audioSource = new MediaStreamAudioTrackSource(audioInputTrack, { codec: 'pcm-f32', bitrate: QUALITY_MEDIUM })
  audioSource.errorPromise.catch(console.error)
  output.addAudioTrack(audioSource)

  format = await output.getMimeType()
  await output.start()
}

async function handleStop() {
  await output?.finalize()
  const bufferTarget = output?.target as BufferTarget | undefined

  if (bufferTarget?.buffer)
    recorded.value.push(bufferTarget.buffer)
}

function handleCancel() {
  output?.cancel()
}
</script>

<template>
  <div>
    <div space-x-2>
      <button @click="handleStart">
        Start
      </button>
      <button @click="handleCancel">
        Cancel
      </button>
      <button @click="handleStop">
        Stop
      </button>
    </div>
    <div>
      <audio v-for="(url, index) in recordedUrls" :key="index" controls>
        <source :src="url" type="audio/wav">
      </audio>
    </div>
  </div>
</template>

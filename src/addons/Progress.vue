<script setup lang="ts">
import { computed, inject } from "vue";
import { normalizeSlideIndex } from "../utils";
import "../styles/progress.css";

const $hooper = inject<any>("$hooper");

const currentSlide = computed(() =>
  normalizeSlideIndex($hooper.currentSlide, $hooper.slidesCount)
);

const progress = computed(() => {
  const range = $hooper.slidesCount - $hooper.trimStart - $hooper.trimEnd;
  return ((currentSlide.value - $hooper.trimStart) * 100) / range;
});
</script>

<template>
  <div class="hooper-progress">
    <div class="hooper-progress-inner" :style="{ width: `${progress}%` }" />
  </div>
</template>

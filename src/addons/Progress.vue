<script setup lang="ts">
import { computed } from "vue";
import { useHooper } from "../composables/useHooper";
import { normalizeSlideIndex } from "../utils";

const {
  currentSlide: hooperCurrentSlide,
  slidesCount,
  trimStart,
  trimEnd,
} = useHooper();

const currentSlide = computed(() =>
  normalizeSlideIndex(hooperCurrentSlide.value, slidesCount.value)
);

const progress = computed(() => {
  const range = slidesCount.value - trimStart.value - trimEnd.value;
  return ((currentSlide.value - trimStart.value) * 100) / range;
});
</script>

<template>
  <div class="hooper-progress">
    <div class="hooper-progress-inner" :style="{ width: `${progress}%` }" />
  </div>
</template>

<style scoped>
.hooper-progress {
  position: absolute;
  top: 0;
  right: 0;
  left: 0;
  height: 4px;
  background-color: #efefef;
}
.hooper-progress-inner {
  height: 100%;
  background-color: #4285f4;
  transition: 300ms;
}
</style>

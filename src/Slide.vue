<script setup lang="ts">
import { computed, inject } from "vue";
import "./styles/slide.css";

const props = withDefaults(
  defineProps<{
    isClone?: boolean;
    index?: number;
    duration?: number;
  }>(),
  {
    isClone: false,
    index: 0,
    duration: 0,
  }
);

const $hooper = inject<any>("$hooper");

const style = computed(() => {
  const { config, slideHeight, slideWidth } = $hooper || {};
  if (config.vertical) {
    return { height: `${slideHeight}px` };
  }
  return { width: `${slideWidth}px` };
});

const isActive = computed(() => {
  const { upper, lower } = $hooper.slideBounds;
  return props.index >= lower && props.index <= upper;
});

const isPrev = computed(() => {
  const { lower } = $hooper.slideBounds;
  const { itemsToSlide } = $hooper.config;
  return props.index < lower && props.index >= lower - itemsToSlide;
});

const isNext = computed(() => {
  const { upper } = $hooper.slideBounds;
  const { itemsToSlide } = $hooper.config;
  return props.index > upper && props.index <= upper + itemsToSlide;
});

const isCurrent = computed(() => {
  return props.index === $hooper.currentSlide;
});
</script>

<template>
  <li
    class="hooper-slide"
    :class="{
      'is-clone': isClone,
      'is-active': isActive,
      'is-prev': isPrev,
      'is-next': isNext,
      'is-current': isCurrent,
    }"
    :style="style"
    :aria-hidden="isActive"
  >
    <slot />
  </li>
</template>

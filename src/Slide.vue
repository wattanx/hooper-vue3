<script setup lang="ts">
import { computed } from "vue";
import { useHooper } from "./composables/useHooper";

defineOptions({
  name: "HooperSlide",
});

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

const { config, slideHeight, slideWidth, slideBounds, currentSlide } =
  useHooper();

const style = computed(() => {
  if (config.value.vertical) {
    return { height: `${slideHeight.value}px` };
  }
  return { width: `${slideWidth.value}px` };
});

const isActive = computed(() => {
  const { upper, lower } = slideBounds.value;
  return props.index >= lower && props.index <= upper;
});

const isPrev = computed(() => {
  const { lower } = slideBounds.value;
  const { itemsToSlide } = config.value;
  return props.index < lower && props.index >= lower - itemsToSlide;
});

const isNext = computed(() => {
  const { upper } = slideBounds.value;
  const { itemsToSlide } = config.value;
  return props.index > upper && props.index <= upper + itemsToSlide;
});

const isCurrent = computed(() => {
  return props.index === currentSlide.value;
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

<style scoped>
.hooper-slide {
  flex-shrink: 0;
  height: 100%;
  margin: 0;
  padding: 0;
  list-style: none;
}
</style>

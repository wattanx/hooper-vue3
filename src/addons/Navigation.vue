<script setup lang="ts">
import { computed } from "vue";
import { useHooper } from "../composables/useHooper";
import Icon from "./Icon.vue";
import "../styles/navigation.css";

const {
  config,
  currentSlide,
  slidesCount,
  slidePrev: hooperSlidePrev,
  slideNext: hooperSlideNext,
  restartTimer,
} = useHooper();

function iconName(isVertical: boolean, isRTL: boolean, isPrev: boolean) {
  if (isPrev) {
    return isVertical ? "arrowUp" : isRTL ? "arrowRight" : "arrowLeft";
  }

  return isVertical ? "arrowDown" : isRTL ? "arrowLeft" : "arrowRight";
}

const isPrevDisabled = computed(() => {
  if (config.value.infiniteScroll) {
    return false;
  }
  return currentSlide.value === 0;
});

const isNextDisabled = computed(() => {
  if (config.value.infiniteScroll) {
    return false;
  }

  if (config.value.trimWhiteSpace) {
    return (
      currentSlide.value ===
      slidesCount.value -
        Math.min(config.value.itemsToShow, slidesCount.value)
    );
  }

  return currentSlide.value === slidesCount.value - 1;
});

const isVertical = computed(() => config.value.vertical);
const isRTL = computed(() => config.value.rtl ?? false);

function slidePrev() {
  hooperSlidePrev();
  restartTimer();
}

function slideNext() {
  hooperSlideNext();
  restartTimer();
}
</script>

<template>
  <div
    class="hooper-navigation"
    :class="{
      'is-vertical': isVertical,
      'is-rtl': isRTL,
    }"
  >
    <button
      type="button"
      class="hooper-prev"
      :class="{ 'is-disabled': isPrevDisabled }"
      @click="slidePrev"
    >
      <slot name="hooper-prev">
        <Icon :name="iconName(isVertical, isRTL, true)" />
      </slot>
    </button>
    <button
      type="button"
      class="hooper-next"
      :class="{ 'is-disabled': isNextDisabled }"
      @click="slideNext"
    >
      <slot name="hooper-next">
        <Icon :name="iconName(isVertical, isRTL, false)" />
      </slot>
    </button>
  </div>
</template>

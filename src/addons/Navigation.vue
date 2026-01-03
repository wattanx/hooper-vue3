<script setup lang="ts">
import { computed, inject } from "vue";
import Icon from "./Icon.vue";
import "../styles/navigation.css";

const $hooper = inject<any>("$hooper");

function iconName(isVertical: boolean, isRTL: boolean, isPrev: boolean) {
  if (isPrev) {
    return isVertical ? "arrowUp" : isRTL ? "arrowRight" : "arrowLeft";
  }

  return isVertical ? "arrowDown" : isRTL ? "arrowLeft" : "arrowRight";
}

const isPrevDisabled = computed(() => {
  if ($hooper.config.infiniteScroll) {
    return false;
  }
  return $hooper.currentSlide === 0;
});

const isNextDisabled = computed(() => {
  if ($hooper.config.infiniteScroll) {
    return false;
  }

  if ($hooper.config.trimWhiteSpace) {
    return (
      $hooper.currentSlide ===
      $hooper.slidesCount -
        Math.min($hooper.config.itemsToShow, $hooper.slidesCount)
    );
  }

  return $hooper.currentSlide === $hooper.slidesCount - 1;
});

const isVertical = computed(() => $hooper.config.vertical);
const isRTL = computed(() => $hooper.config.rtl);

function slidePrev() {
  $hooper.slidePrev();
  $hooper.restartTimer();
}

function slideNext() {
  $hooper.slideNext();
  $hooper.restartTimer();
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

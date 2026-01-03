<script setup lang="ts">
import { computed } from "vue";
import { useHooper } from "../composables/useHooper";
import { normalizeSlideIndex } from "../utils";
import "../styles/pagination.css";

const props = withDefaults(
  defineProps<{
    mode?: string;
  }>(),
  {
    mode: "indicator",
  }
);

const {
  config,
  currentSlide: hooperCurrentSlide,
  slidesCount,
  slideTo: hooperSlideTo,
} = useHooper();

const currentSlide = computed(() =>
  normalizeSlideIndex(hooperCurrentSlide.value, slidesCount.value)
);

const totalCount = computed(() => slidesCount.value);

const isVertical = computed(() => config.value.vertical);

const indicators = computed(() => {
  const result = [];
  for (let i = 0; i < totalCount.value; i++) {
    result.push(i);
  }
  return result;
});

function slideTo(index: number) {
  hooperSlideTo(index);
}
</script>

<template>
  <div
    class="hooper-pagination"
    :class="{
      'is-vertical': isVertical,
    }"
  >
    <template v-if="props.mode === 'indicator'">
      <ol class="hooper-indicators">
        <li v-for="index in indicators" :key="index">
          <button
            type="button"
            class="hooper-indicator"
            :class="{ 'is-active': index === currentSlide }"
            @click="slideTo(index)"
          >
            <span class="hooper-sr-only">item {{ index }}</span>
          </button>
        </li>
      </ol>
    </template>
    <template v-else>
      <span>{{ currentSlide + 1 }}</span>
      <span>/</span>
      <span>{{ totalCount }}</span>
    </template>
  </div>
</template>

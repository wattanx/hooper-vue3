<script setup lang="ts">
import { computed, inject } from "vue";
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

const $hooper = inject<any>("$hooper");

const currentSlide = computed(() =>
  normalizeSlideIndex($hooper.currentSlide, $hooper.slidesCount)
);

const totalCount = computed(() => $hooper.slidesCount);

const isVertical = computed(() => $hooper.config.vertical);

const indicators = computed(() => {
  const result = [];
  for (let i = 0; i < totalCount.value; i++) {
    result.push(i);
  }
  return result;
});

function slideTo(index: number) {
  $hooper.slideTo(index);
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

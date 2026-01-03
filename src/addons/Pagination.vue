<script setup lang="ts">
import { computed } from "vue";
import { useHooper } from "../composables/useHooper";
import { normalizeSlideIndex } from "../utils";

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

<style scoped>
.hooper-pagination {
  position: absolute;
  bottom: 0;
  right: 50%;
  transform: translateX(50%);
  display: flex;
  padding: 5px 10px;
}
.hooper-indicators {
  display: flex;
  list-style: none;
  margin: 0;
  padding: 0;
}
.hooper-indicator:hover,
.hooper-indicator.is-active {
  background-color: #4285f4;
}
.hooper-indicator {
  margin: 0 2px;
  width: 12px;
  height: 4px;
  border-radius: 4px;
  border: none;
  padding: 0;
  background-color: #fff;
  cursor: pointer;
}
.hooper-pagination.is-vertical {
  bottom: auto;
  right: 0;
  top: 50%;
  transform: translateY(-50%);
}
.hooper-pagination.is-vertical .hooper-indicators {
  flex-direction: column;
}
.hooper-pagination.is-vertical .hooper-indicator {
  width: 6px;
}

.hooper-sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  border: 0;
}
</style>

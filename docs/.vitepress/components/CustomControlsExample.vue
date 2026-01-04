<script setup lang="ts">
import { ref, watch } from "vue";
import { Hooper, Slide } from "@wattanx/hooper-vue3";

const hooperRef = ref<InstanceType<typeof Hooper> | null>(null);
const carouselData = ref(0);

watch(carouselData, (val) => {
  hooperRef.value?.slideTo(val);
});

const slidePrev = () => {
  hooperRef.value?.slidePrev();
};

const slideNext = () => {
  hooperRef.value?.slideNext();
};

const updateCarousel = (payload: { currentSlide: number }) => {
  carouselData.value = payload.currentSlide;
};
</script>

<template>
  <div>
    <div class="custom-controls">
      <button type="button" @click="slidePrev">prev</button>
      <input v-model.number="carouselData" type="number" min="0" max="5" />
      <button type="button" @click="slideNext">next</button>
    </div>

    <Hooper
      ref="hooperRef"
      :items-to-show="1.5"
      :center-mode="true"
      @slide="updateCarousel"
    >
      <Slide>slide 1</Slide>
      <Slide>slide 2</Slide>
      <Slide>slide 3</Slide>
      <Slide>slide 4</Slide>
      <Slide>slide 5</Slide>
      <Slide>slide 6</Slide>
    </Hooper>
  </div>
</template>

<style scoped>
.custom-controls {
  display: flex;
  gap: 8px;
  margin-bottom: 16px;
  align-items: center;
}

.custom-controls button {
  padding: 4px 12px;
  border-radius: 4px;
  cursor: pointer;
}

.custom-controls input {
  width: 60px;
  padding: 4px 8px;
  border: 1px solid #ccc;
  border-radius: 4px;
  text-align: center;
}

.hooper-slide {
  background-color: #62caaa;
  padding: 20px;
  display: flex;
  justify-content: center;
  align-items: center;
  color: #ffffff;
  border: 2px solid #fff;
  font-size: 30px;
  border-radius: 10px;
}
.is-active {
  background-color: rgb(71, 218, 127);
}
</style>

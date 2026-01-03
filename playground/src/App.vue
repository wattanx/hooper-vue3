<script setup lang="ts">
import { Hooper, Slide, Navigation, Pagination } from "@wattanx/hooper-vue3";
import "@wattanx/hooper-vue3/css";

const slides = [1, 2, 3, 4, 5, 6];
</script>

<template>
  <!-- Group Slide Example -->
  <h2>Group Slide Example</h2>
  <p>These two carousels are synchronized via the "group" prop</p>
  <div class="group-container">
    <Hooper group="gallery" :style="{ 'max-width': '400px' }">
      <Slide v-for="n in 5" :key="n">Group A - Slide {{ n }}</Slide>
      <template #hooper-addons>
        <Navigation />
      </template>
    </Hooper>
    <Hooper group="gallery" :style="{ 'max-width': '400px' }">
      <Slide v-for="n in 5" :key="n">Group B - Slide {{ n }}</Slide>
      <template #hooper-addons>
        <Pagination />
      </template>
    </Hooper>
  </div>

  <hr />

  <h2>AutoPlay Example</h2>
  <Hooper :autoPlay="true" infiniteScroll :style="{ 'max-width': '720px' }">
    <Slide :duration="3000">slide 1</Slide>
    <Slide>slide 2</Slide>
    <Slide>slide 3</Slide>
    <Slide>slide 4</Slide>
    <Slide>slide 5</Slide>
    <Slide>slide 6</Slide>
    <template #hooper-addons>
      <Navigation></Navigation>
      <Pagination />
    </template>
  </Hooper>
  <Hooper :autoPlay="true" infiniteScroll :style="{ 'max-width': '720px' }">
    <Slide
      :duration="5000"
      v-for="(slide, index) in slides"
      :key="index"
      :index="index"
    >
      slide{{ slide }}
    </Slide>
    <template #hooper-addons>
      <Navigation></Navigation>
      <Pagination />
    </template>
  </Hooper>
</template>

<style>
.group-container {
  display: flex;
  gap: 20px;
  margin-bottom: 20px;
}

h2 {
  margin-top: 20px;
}

hr {
  margin: 40px 0;
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
#centerMode .hooper-slide.is-current {
  transform: scale(1.2);
}
</style>

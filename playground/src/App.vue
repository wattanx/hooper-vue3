<script setup lang="ts">
import { Hooper, Slide, Navigation, Pagination } from "../../src/index";
import "../../src/index.css";

const slides = [1, 2, 3, 4, 5, 6];
</script>

<template>
  <Hooper infiniteScroll :style="{ 'max-width': '720px' }">
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
  <Hooper infiniteScroll :style="{ 'max-width': '720px' }">
    <Slide v-for="(slide, index) in slides" :key="index" :index="index">
      slide{{ slide }}
    </Slide>
    <template #hooper-addons>
      <Navigation></Navigation>
      <Pagination />
    </template>
  </Hooper>
</template>

<style>
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

<script setup lang="ts">
import { Hooper, Slide, Navigation, Pagination } from "@wattanx/hooper-vue3";
</script>

<template>
  <div class="carousel-group">
    <!-- Main carousel -->
    <Hooper group="gallery" style="height: 300px">
      <Slide>1</Slide>
      <Slide>2</Slide>
      <Slide>3</Slide>

      <template #hooper-addons>
        <Navigation />
        <Pagination />
      </template>
    </Hooper>

    <!-- Thumbnail carousel -->
    <Hooper group="gallery" :items-to-show="4" style="height: 80px">
      <Slide>1</Slide>
      <Slide>2</Slide>
      <Slide>3</Slide>
    </Hooper>
  </div>
</template>

<style scoped>
.carousel-group {
  display: flex;
  flex-direction: column;
  gap: 16px;
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

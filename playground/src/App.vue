<script setup lang="ts">
// @ts-ignore
import { Hooper, Slide, Navigation, Pagination } from "../../src/index";
import "../../src/styles/carousel.css";
import "../../src/styles/navigation.css";
import "../../src/styles/pagination.css";
import "../../src/styles/progress.css";
import "../../src/styles/slide.css";
</script>

<template>
  <Hooper>
    <Slide>slide 1</Slide>
    <Slide>slide 2</Slide>
    <Slide>slide 3</Slide>
    <template #hooper-addons>
      <Navigation></Navigation>
      <Pagination />
    </template>
  </Hooper>
</template>

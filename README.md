# Hooper for Vue 3

The Vue 3 compatible of https://github.com/baianat/hooper

[▶️ Playground](https://stackblitz.com/edit/vitejs-vite-jlwkse)

## Installation

```bash
npm install @wattanx/hooper-vue3
```

## Usage

```vue
<script setup lang="ts">
import { Hooper, Slide, Navigation, Pagination } from '@wattanx/hooper-vue3';
import '@wattanx/hooper-vue3/css';
</script>

<template>
  <Hooper :style="{ 'max-width': '720px' }">
    <Slide>slide 1</Slide>
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
```
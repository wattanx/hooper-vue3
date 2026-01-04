# Examples

<script setup>
import { Hooper, Slide, Navigation, Progress, Pagination } from '@wattanx/hooper-vue3'
import CustomControlsExample from './.vitepress/components/CustomControlsExample.vue'
import GroupedCarouselsExample from './.vitepress/components/GroupedCarouselsExample.vue'
</script>

<style scoped>

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

## Basic Carousel

<Hooper>
  <Slide>
    slide 1
  </Slide>
  <Slide>
    slide 2
  </Slide>
  <Slide>
    slide 3
  </Slide>
  <Slide>
    slide 4
  </Slide>
  <Slide>
    slide 5
  </Slide>
  <Slide>
    slide 6
  </Slide>
</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>
    <Slide>Slide 5</Slide>
    <Slide>Slide 6</Slide>
  </Hooper>
</template>
```

## With Navigation

<Hooper>
  <Slide>
    slide 1
  </Slide>
  <Slide>
    slide 2
  </Slide>
  <Slide>
    slide 3
  </Slide>
  <Slide>
    slide 4
  </Slide>

<template #hooper-addons>
<Navigation />
</template>
</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide, Navigation } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>

    <template #hooper-addons>
      <Navigation />
    </template>
  </Hooper>
</template>
```

## With Progress Bar

<Hooper>
  <Slide>Slide 1</Slide>
  <Slide>Slide 2</Slide>
  <Slide>Slide 3</Slide>
  <Slide>Slide 4</Slide>

<template #hooper-addons>
<Progress />
</template>

</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide, Progress } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>

    <template #hooper-addons>
      <Progress />
    </template>
  </Hooper>
</template>
```

## With Pagination (Dots)

<Hooper>
  <Slide>Slide 1</Slide>
  <Slide>Slide 2</Slide>
  <Slide>Slide 3</Slide>
  <Slide>Slide 4</Slide>

<template #hooper-addons>
<Pagination />
</template>

</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide, Pagination } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>

    <template #hooper-addons>
      <Pagination />
    </template>
  </Hooper>
</template>
```

## With Pagination (Fraction)

Display current slide position as a fraction (e.g., "2/4").

<Hooper>
  <Slide>Slide 1</Slide>
  <Slide>Slide 2</Slide>
  <Slide>Slide 3</Slide>
  <Slide>Slide 4</Slide>

<template #hooper-addons>
<Pagination mode="fraction" />
</template>
</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide, Pagination } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>

    <template #hooper-addons>
      <Pagination mode="fraction" />
    </template>
  </Hooper>
</template>
```

## Multiple Items

Display multiple slides at once.

<Hooper :items-to-show="3" :items-to-slide="1">
  <Slide>Slide 1</Slide>
  <Slide>Slide 2</Slide>
  <Slide>Slide 3</Slide>
  <Slide>Slide 4</Slide>
  <Slide>Slide 5</Slide>
  <Slide>Slide 6</Slide>

<template #hooper-addons>
<Navigation />
</template>
</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide, Navigation } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper :items-to-show="3" :items-to-slide="1">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>
    <Slide>Slide 5</Slide>
    <Slide>Slide 6</Slide>

    <template #hooper-addons>
      <Navigation />
    </template>
  </Hooper>
</template>
```

## Infinite Scroll

Enable continuous looping through slides.

<Hooper :infinite-scroll="true">
  <Slide>Slide 1</Slide>
  <Slide>Slide 2</Slide>
  <Slide>Slide 3</Slide>
  <Slide>Slide 4</Slide>

<template #hooper-addons>
<Navigation />
</template>

</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide, Navigation } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper :infinite-scroll="true">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>

    <template #hooper-addons>
      <Navigation />
    </template>
  </Hooper>
</template>
```

## Center Mode

Center the current slide with partial visibility of adjacent slides.

<Hooper :items-to-show="1.5" :center-mode="true">
  <Slide>Slide 1</Slide>
  <Slide>Slide 2</Slide>
  <Slide>Slide 3</Slide>
  <Slide>Slide 4</Slide>

<template #hooper-addons>
<Navigation />
</template>
</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide, Navigation } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper :items-to-show="1.5" :center-mode="true">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>

    <template #hooper-addons>
      <Navigation />
    </template>
  </Hooper>
</template>

<style scoped>
.hooper-slide {
  transition: transform 0.3s;
}
.hooper-slide.is-current {
  transform: scale(1.1);
}
</style>
```

## Auto Play

Automatically advance slides at a specified interval.

<Hooper :auto-play="true" :play-speed="3000" :hover-pause="true">
  <Slide>Slide 1</Slide>
  <Slide>Slide 2</Slide>
  <Slide>Slide 3</Slide>
  <Slide>Slide 4</Slide>

<template #hooper-addons>
<Pagination />
</template>
</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide, Pagination } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper :auto-play="true" :play-speed="3000" :hover-pause="true">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>

    <template #hooper-addons>
      <Pagination />
    </template>
  </Hooper>
</template>
```

You can also set individual slide durations:

<Hooper :auto-play="true" :play-speed="2000">
  <Slide>Slide 1 (2s)</Slide>
  <Slide :duration="5000">Slide 2 (5s)</Slide>
  <Slide>Slide 3 (2s)</Slide>
</Hooper>

```vue
<template>
  <Hooper :auto-play="true" :play-speed="2000">
    <Slide>Slide 1 (2s)</Slide>
    <Slide :duration="5000">Slide 2 (5s)</Slide>
    <Slide>Slide 3 (2s)</Slide>
  </Hooper>
</template>
```

## Vertical Sliding

Enable vertical slide navigation.

<Hooper :vertical="true" style="height: 300px">
  <Slide>Slide 1</Slide>
  <Slide>Slide 2</Slide>
  <Slide>Slide 3</Slide>
  <Slide>Slide 4</Slide>

<template #hooper-addons>
<Navigation />
<Pagination />
</template>
</Hooper>

```vue
<script setup lang="ts">
import { Hooper, Slide, Navigation, Pagination } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper :vertical="true" style="height: 300px">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>

    <template #hooper-addons>
      <Navigation />
      <Pagination />
    </template>
  </Hooper>
</template>
```

## Grouped Carousels

Synchronize multiple carousels using the `group` prop.

<GroupedCarouselsExample />

```vue
<script setup lang="ts">
import { Hooper, Slide, Navigation } from "@wattanx/hooper-vue3";
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
```

## Custom Controls

Use template refs to control the carousel programmatically.

<CustomControlsExample />

```vue
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
      <button @click="slidePrev">prev</button>
      <input v-model.number="carouselData" type="number" min="0" max="5" />
      <button @click="slideNext">next</button>
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
```

# Getting Started

## Installation

::: code-group

```sh [npm]
npm install @wattanx/hooper-vue3
```

```sh [yarn]
yarn add @wattanx/hooper-vue3
```

```sh [pnpm]
pnpm add @wattanx/hooper-vue3
```

:::

## Basic Usage

Import the `Hooper` and `Slide` components and use them in your template:

```vue
<script setup lang="ts">
import { Hooper, Slide } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
  </Hooper>
</template>
```

## Configuration

You can configure the carousel using individual props:

```vue
<template>
  <Hooper :items-to-show="3" :center-mode="true" :infinite-scroll="true">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
  </Hooper>
</template>
```

Or use the `settings` object for cleaner code:

```vue
<script setup lang="ts">
import { Hooper, Slide } from "@wattanx/hooper-vue3";

const settings = {
  itemsToShow: 3,
  centerMode: true,
  infiniteScroll: true,
};
</script>

<template>
  <Hooper :settings="settings">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
  </Hooper>
</template>
```

## Dynamic Content

When rendering slides from a data array using `v-for`, make sure to provide a unique `key`:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Hooper, Slide } from "@wattanx/hooper-vue3";

const slides = ref([
  { id: 1, content: "Slide 1" },
  { id: 2, content: "Slide 2" },
  { id: 3, content: "Slide 3" },
]);
</script>

<template>
  <Hooper>
    <Slide v-for="slide in slides" :key="slide.id">
      {{ slide.content }}
    </Slide>
  </Hooper>
</template>
```

## Responsive Design

Use the `breakpoints` property within `settings` to define custom settings for different screen sizes:

```vue
<script setup lang="ts">
import { Hooper, Slide } from "@wattanx/hooper-vue3";

const settings = {
  itemsToShow: 1,
  breakpoints: {
    768: {
      itemsToShow: 2,
    },
    1024: {
      itemsToShow: 3,
    },
  },
};
</script>

<template>
  <Hooper :settings="settings">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
    <Slide>Slide 4</Slide>
  </Hooper>
</template>
```

The breakpoints use a mobile-first approach. Settings cascade from smaller to larger breakpoints.

## RTL Support

The carousel automatically adapts to the document direction. You can also force RTL mode using the `rtl` prop:

```vue
<template>
  <Hooper :rtl="true">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
  </Hooper>
</template>
```

When `rtl` is set to `null` (default), the carousel will automatically detect the direction from the document.

## Grouped Carousels

Multiple carousels can be synchronized by assigning them the same `group` name:

```vue
<script setup lang="ts">
import { Hooper, Slide } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper group="main">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
  </Hooper>

  <Hooper group="main" :items-to-show="3">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
  </Hooper>
</template>
```

When one carousel slides, all grouped instances move to the same index position.

## Addons

The library provides three built-in addon components:

### Navigation

Add previous/next navigation buttons:

```vue
<script setup lang="ts">
import { Hooper, Slide, Navigation } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>

    <template #hooper-addons>
      <Navigation />
    </template>
  </Hooper>
</template>
```

### Pagination

Add slide indicators (dots or fraction):

```vue
<script setup lang="ts">
import { Hooper, Slide, Pagination } from "@wattanx/hooper-vue3";
</script>

<template>
  <!-- Dot indicators (default) -->
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>

    <template #hooper-addons>
      <Pagination />
    </template>
  </Hooper>

  <!-- Fraction display (e.g., "1/3") -->
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>

    <template #hooper-addons>
      <Pagination mode="fraction" />
    </template>
  </Hooper>
</template>
```

### Progress

Add a progress bar:

```vue
<script setup lang="ts">
import { Hooper, Slide, Progress } from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>

    <template #hooper-addons>
      <Progress />
    </template>
  </Hooper>
</template>
```

### Combining Addons

You can use multiple addons together:

```vue
<script setup lang="ts">
import {
  Hooper,
  Slide,
  Navigation,
  Pagination,
  Progress,
} from "@wattanx/hooper-vue3";
</script>

<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>

    <template #hooper-addons>
      <Navigation />
      <Pagination />
      <Progress />
    </template>
  </Hooper>
</template>
```

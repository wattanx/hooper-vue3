# API Reference

## Hooper Component

### Props

| Prop             | Type              | Default | Description                                 |
| ---------------- | ----------------- | ------- | ------------------------------------------- |
| `itemsToShow`    | `number`          | `1`     | Number of slides to display at once         |
| `itemsToSlide`   | `number`          | `1`     | Number of slides to move per navigation     |
| `initialSlide`   | `number`          | `0`     | Index of the initial slide                  |
| `infiniteScroll` | `boolean`         | `false` | Enable infinite scrolling                   |
| `centerMode`     | `boolean`         | `false` | Center the current slide                    |
| `vertical`       | `boolean`         | `false` | Enable vertical sliding                     |
| `rtl`            | `boolean \| null` | `null`  | Enable RTL mode (`null` for auto-detection) |
| `autoPlay`       | `boolean`         | `false` | Enable auto-play                            |
| `playSpeed`      | `number`          | `2000`  | Auto-play interval in milliseconds          |
| `mouseDrag`      | `boolean`         | `true`  | Enable mouse drag                           |
| `touchDrag`      | `boolean`         | `true`  | Enable touch drag                           |
| `wheelControl`   | `boolean`         | `true`  | Enable mouse wheel control                  |
| `keysControl`    | `boolean`         | `true`  | Enable keyboard control                     |
| `shortDrag`      | `boolean`         | `true`  | Allow short drag to trigger slide           |
| `transition`     | `number`          | `300`   | Transition duration in milliseconds         |
| `hoverPause`     | `boolean`         | `true`  | Pause auto-play on hover                    |
| `trimWhiteSpace` | `boolean`         | `false` | Trim whitespace at the edges                |
| `settings`       | `object`          | `{}`    | Settings object (can include `breakpoints`) |
| `group`          | `string \| null`  | `null`  | Group name for synchronized carousels       |

### Slots

| Slot            | Description                                         |
| --------------- | --------------------------------------------------- |
| `default`       | Slide content (use `<Slide>` components)            |
| `hooper-addons` | Addon components (Navigation, Pagination, Progress) |

### Methods

Access methods via template ref:

```vue
<script setup lang="ts">
import { ref } from "vue";
import { Hooper, Slide } from "@wattanx/hooper-vue3";

const hooperRef = ref<InstanceType<typeof Hooper> | null>(null);

const goToSlide = (index: number) => {
  hooperRef.value?.slideTo(index);
};
</script>

<template>
  <Hooper ref="hooperRef">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
  </Hooper>
</template>
```

| Method                   | Description                                   |
| ------------------------ | --------------------------------------------- |
| `slideTo(index: number)` | Slide to a specific index                     |
| `slideNext()`            | Slide to the next slide                       |
| `slidePrev()`            | Slide to the previous slide                   |
| `update()`               | Update the carousel (recalculates dimensions) |
| `restart()`              | Restart the carousel                          |
| `restartTimer()`         | Restart the auto-play timer                   |

### Events

| Event         | Payload                                                                  | Description                          |
| ------------- | ------------------------------------------------------------------------ | ------------------------------------ |
| `beforeSlide` | `{ currentSlide: number, slideTo: number }`                              | Emitted before sliding starts        |
| `slide`       | `{ currentSlide: number, slideFrom: number }`                            | Emitted during sliding               |
| `afterSlide`  | `{ currentSlide: number }`                                               | Emitted after sliding completes      |
| `updated`     | `{ containerWidth, containerHeight, slideWidth, slideHeight, settings }` | Emitted when carousel is updated     |
| `loaded`      | -                                                                        | Emitted when carousel is initialized |

```vue
<script setup lang="ts">
import { Hooper, Slide } from "@wattanx/hooper-vue3";

const onBeforeSlide = (payload: { currentSlide: number; slideTo: number }) => {
  console.log(`Sliding from ${payload.currentSlide} to ${payload.slideTo}`);
};

const onAfterSlide = (payload: { currentSlide: number }) => {
  console.log(`Now on slide ${payload.currentSlide}`);
};
</script>

<template>
  <Hooper @before-slide="onBeforeSlide" @after-slide="onAfterSlide">
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>
  </Hooper>
</template>
```

## Slide Component

### Props

| Prop       | Type     | Default | Description                                                                                      |
| ---------- | -------- | ------- | ------------------------------------------------------------------------------------------------ |
| `duration` | `number` | `0`     | Custom auto-play duration for this slide (ms). When set to `0`, uses the carousel's `playSpeed`. |

### CSS Classes

The `Slide` component automatically applies the following CSS classes:

| Class         | Description                                             |
| ------------- | ------------------------------------------------------- |
| `.is-active`  | Applied to slides within the visible range              |
| `.is-current` | Applied to the current (main) slide                     |
| `.is-prev`    | Applied to slides immediately before the visible range  |
| `.is-next`    | Applied to slides immediately after the visible range   |
| `.is-clone`   | Applied to cloned slides (used in infinite scroll mode) |

## Pagination Component

### Props

| Prop   | Type                        | Default       | Description                                   |
| ------ | --------------------------- | ------------- | --------------------------------------------- |
| `mode` | `'indicator' \| 'fraction'` | `'indicator'` | Display mode - dots or fraction (e.g., "1/3") |

## Navigation Component

The Navigation component provides previous/next buttons. It automatically adapts to vertical and RTL modes.

### Slots

| Slot          | Description                            |
| ------------- | -------------------------------------- |
| `hooper-prev` | Custom content for the previous button |
| `hooper-next` | Custom content for the next button     |

```vue
<template>
  <Hooper>
    <Slide>Slide 1</Slide>
    <Slide>Slide 2</Slide>
    <Slide>Slide 3</Slide>

    <template #hooper-addons>
      <Navigation>
        <template #hooper-prev>
          <span>Previous</span>
        </template>
        <template #hooper-next>
          <span>Next</span>
        </template>
      </Navigation>
    </template>
  </Hooper>
</template>
```

## Progress Component

The Progress component displays a progress bar indicating the current position in the carousel. No additional props are required.

<script setup lang="ts">
import {
  h,
  ref,
  reactive,
  computed,
  watch,
  provide,
  onMounted,
  onBeforeUnmount,
  nextTick,
  cloneVNode,
  useSlots,
} from "vue";
import { getInRange, now, Timer, normalizeSlideIndex } from "./utils";
import { hooperContextKey } from "./composables/useHooper";
import type { HooperConfig } from "./types";
import "./styles/carousel.css";

const props = withDefaults(
  defineProps<{
    itemsToShow?: number;
    itemsToSlide?: number;
    initialSlide?: number;
    infiniteScroll?: boolean;
    centerMode?: boolean;
    vertical?: boolean;
    rtl?: boolean | null;
    autoPlay?: boolean;
    playSpeed?: number;
    mouseDrag?: boolean;
    touchDrag?: boolean;
    wheelControl?: boolean;
    keysControl?: boolean;
    shortDrag?: boolean;
    transition?: number;
    hoverPause?: boolean;
    trimWhiteSpace?: boolean;
    settings?: Record<string, any>;
    group?: string | null;
  }>(),
  {
    itemsToShow: 1,
    itemsToSlide: 1,
    initialSlide: 0,
    infiniteScroll: false,
    centerMode: false,
    vertical: false,
    rtl: null,
    autoPlay: false,
    playSpeed: 2000,
    mouseDrag: true,
    touchDrag: true,
    wheelControl: true,
    keysControl: true,
    shortDrag: true,
    transition: 300,
    hoverPause: true,
    trimWhiteSpace: false,
    settings: () => ({}),
    group: null,
  }
);

const emit = defineEmits<{
  updated: [
    payload: {
      containerWidth: number;
      containerHeight: number;
      slideWidth: number;
      slideHeight: number;
      settings: Record<string, any>;
    }
  ];
  slide: [payload: { currentSlide: number; slideFrom: number }];
  afterSlide: [payload: { currentSlide: number }];
  beforeSlide: [payload: { currentSlide: number; slideTo: number }];
  loaded: [];
}>();

const slots = useSlots();

const groupEmitter = new EventTarget();

// State
const isDragging = ref(false);
const isSliding = ref(false);
const isTouch = ref(false);
const isHover = ref(false);
const isFocus = ref(false);
const initialized = ref(false);
const slideWidth = ref(0);
const containerWidth = ref(0);
const containerHeight = ref(0);
const slideHeight = ref(0);
const slidesCount = ref(0);
const trimStart = ref(0);
const trimEnd = ref(1);
const currentSlide = ref(0);
const timer = ref<Timer | null>(null);
const defaults = ref<Record<string, any>>({});
const breakpoints = ref<Record<string, any>>({});
const delta = reactive({ x: 0, y: 0 });
const config = ref<HooperConfig>({} as HooperConfig);

// Non-reactive state
let lastScrollTime = now();
let startPosition = { x: 0, y: 0 };
let endPosition = { x: 0, y: 0 };
let _groupSlideHandler: ((event: Event) => void) | null = null;

// Template refs
const rootEl = ref<HTMLElement | null>(null);

// Computed
const slideBounds = computed(() => {
  const siblings = config.value.itemsToShow;
  const lower = config.value.centerMode
    ? Math.ceil(currentSlide.value - siblings / 2)
    : currentSlide.value;
  const upper = config.value.centerMode
    ? Math.floor(currentSlide.value + siblings / 2)
    : Math.floor(currentSlide.value + siblings - 1);

  return { lower, upper };
});

const trackTransform = computed(() => {
  const { infiniteScroll, vertical, rtl, centerMode } = config.value;

  const direction = rtl ? -1 : 1;
  const slideLengthVal = vertical ? slideHeight.value : slideWidth.value;
  const containerLengthVal = vertical
    ? containerHeight.value
    : containerWidth.value;
  const dragDelta = vertical ? delta.y : delta.x;
  const clonesSpace = infiniteScroll ? slideLengthVal * slidesCount.value : 0;
  const centeringSpace = centerMode
    ? (containerLengthVal - slideLengthVal) / 2
    : 0;

  const translate =
    dragDelta +
    direction *
      (centeringSpace - clonesSpace - currentSlide.value * slideLengthVal);

  if (vertical) {
    return `transform: translate(0, ${translate}px);`;
  }

  return `transform: translate(${translate}px, 0);`;
});

const trackTransition = computed(() => {
  if (initialized.value && isSliding.value) {
    return `transition: ${config.value.transition}ms`;
  }
  return "";
});

// Watch
watch(
  () => props.group,
  (val, oldVal) => {
    if (val === oldVal) return;
    if (oldVal && _groupSlideHandler) {
      groupEmitter.removeEventListener(
        `slideGroup:${oldVal}`,
        _groupSlideHandler
      );
    }
    addGroupListeners();
  }
);

watch(
  () => props.autoPlay,
  (val, oldVal) => {
    if (val === oldVal) return;
    restartTimer();
  }
);

// Methods
function slideTo(slideIndex: number, isSource = true) {
  if (isSliding.value || slideIndex === currentSlide.value) {
    return;
  }

  const { infiniteScroll, transition } = config.value;

  const index = infiniteScroll
    ? slideIndex
    : getInRange(
        slideIndex,
        trimStart.value,
        slidesCount.value - trimEnd.value
      );

  emit("beforeSlide", {
    currentSlide: currentSlide.value,
    slideTo: index,
  });

  const previousSlide = currentSlide.value;

  if (props.group && isSource) {
    groupEmitter.dispatchEvent(
      new CustomEvent(`slideGroup:${props.group}`, { detail: slideIndex })
    );
  }

  currentSlide.value = index;
  isSliding.value = true;

  window.setTimeout(() => {
    isSliding.value = false;
    currentSlide.value = normalizeSlideIndex(index, slidesCount.value);
  }, transition);

  emit("slide", {
    currentSlide: currentSlide.value,
    slideFrom: previousSlide,
  });
}

function slideNext() {
  slideTo(currentSlide.value + config.value.itemsToSlide);
}

function slidePrev() {
  slideTo(currentSlide.value - config.value.itemsToSlide);
}

function initEvents() {
  if (!rootEl.value) return;

  if (defaults.value.rtl === null) {
    defaults.value.rtl = getComputedStyle(rootEl.value).direction === "rtl";
  }

  if (props.autoPlay) {
    initAutoPlay();
  }
  if (config.value.keysControl) {
    rootEl.value.addEventListener("keydown", onKeypress);
  }
  if (config.value.wheelControl) {
    lastScrollTime = now();
    rootEl.value.addEventListener("wheel", onWheel, { passive: false });
  }
  window.addEventListener("resize", update);
}

function getCurrentSlideTimeout() {
  const curIdx = normalizeSlideIndex(currentSlide.value, slidesCount.value);
  const children = normalizeChildren();
  return children[curIdx]?.props?.duration ?? props.playSpeed;
}

function initAutoPlay() {
  timer.value = new Timer(() => {
    if (
      isSliding.value ||
      isDragging.value ||
      (isHover.value && config.value.hoverPause) ||
      isFocus.value ||
      !props.autoPlay
    ) {
      timer.value!.set(getCurrentSlideTimeout());
      return;
    }
    if (
      currentSlide.value === slidesCount.value - 1 &&
      !config.value.infiniteScroll
    ) {
      slideTo(0);
      timer.value!.set(getCurrentSlideTimeout());
      return;
    }
    slideNext();
    timer.value!.set(getCurrentSlideTimeout());
  }, getCurrentSlideTimeout());
}

function initDefaults() {
  breakpoints.value = props.settings.breakpoints;
  defaults.value = { ...props, ...props.settings };
  config.value = { ...defaults.value } as HooperConfig;
}

function update() {
  if (breakpoints.value) {
    updateConfig();
  }
  updateWidth();
  updateTrim();
  emit("updated", {
    containerWidth: containerWidth.value,
    containerHeight: containerHeight.value,
    slideWidth: slideWidth.value,
    slideHeight: slideHeight.value,
    settings: config.value,
  });
}

function updateTrim() {
  const { trimWhiteSpace, itemsToShow, centerMode, infiniteScroll } =
    config.value;
  if (!trimWhiteSpace || infiniteScroll) {
    trimStart.value = 0;
    trimEnd.value = 1;
    return;
  }
  trimStart.value = centerMode ? Math.floor((itemsToShow - 1) / 2) : 0;
  trimEnd.value = centerMode ? Math.ceil(itemsToShow / 2) : itemsToShow;
}

function updateWidth() {
  if (!rootEl.value) return;
  const rect = rootEl.value.getBoundingClientRect();
  containerWidth.value = rect.width;
  containerHeight.value = rect.height;
  if (config.value.vertical) {
    slideHeight.value = containerHeight.value / config.value.itemsToShow;
    return;
  }
  slideWidth.value = containerWidth.value / config.value.itemsToShow;
}

function updateConfig() {
  const bps = Object.keys(breakpoints.value).sort(
    (a, b) => Number(b) - Number(a)
  );
  let matched = false;
  bps.some((breakpoint) => {
    matched = window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
    if (matched) {
      config.value = {
        ...config.value,
        ...defaults.value,
        ...breakpoints.value[breakpoint],
      } as HooperConfig;
      return true;
    }
  });
  if (!matched) {
    config.value = { ...config.value, ...defaults.value } as HooperConfig;
  }
}

function restartTimer() {
  nextTick(() => {
    if (timer.value === null && props.autoPlay) {
      initAutoPlay();
      return;
    }

    if (timer.value) {
      timer.value.stop();
      if (props.autoPlay) {
        timer.value.set(getCurrentSlideTimeout());
        timer.value.start();
      }
    }
  });
}

function restart() {
  nextTick(() => {
    update();
  });
}

function onDragStart(event: MouseEvent | TouchEvent) {
  isTouch.value = event.type === "touchstart";
  if (!isTouch.value && (event as MouseEvent).button !== 0) {
    return;
  }

  startPosition = { x: 0, y: 0 };
  endPosition = { x: 0, y: 0 };
  isDragging.value = true;
  startPosition.x = isTouch.value
    ? (event as TouchEvent).touches[0].clientX
    : (event as MouseEvent).clientX;
  startPosition.y = isTouch.value
    ? (event as TouchEvent).touches[0].clientY
    : (event as MouseEvent).clientY;

  document.addEventListener(
    isTouch.value ? "touchmove" : "mousemove",
    onDrag as EventListener
  );
  document.addEventListener(isTouch.value ? "touchend" : "mouseup", onDragEnd);
}

function isInvalidDirection(deltaX: number, deltaY: number) {
  if (!config.value.vertical) {
    return Math.abs(deltaX) <= Math.abs(deltaY);
  }

  if (config.value.vertical) {
    return Math.abs(deltaY) <= Math.abs(deltaX);
  }

  return false;
}

function onDrag(event: MouseEvent | TouchEvent) {
  if (isSliding.value) {
    return;
  }

  endPosition.x = isTouch.value
    ? (event as TouchEvent).touches[0].clientX
    : (event as MouseEvent).clientX;
  endPosition.y = isTouch.value
    ? (event as TouchEvent).touches[0].clientY
    : (event as MouseEvent).clientY;
  const deltaX = endPosition.x - startPosition.x;
  const deltaY = endPosition.y - startPosition.y;

  if (isInvalidDirection(deltaX, deltaY)) {
    return;
  }

  delta.y = deltaY;
  delta.x = deltaX;

  if (!isTouch.value) {
    event.preventDefault();
  }
}

function onDragEnd() {
  const tolerance = config.value.shortDrag ? 0.5 : 0.15;
  isDragging.value = false;

  if (config.value.vertical) {
    const draggedSlides = Math.round(
      Math.abs(delta.y / slideHeight.value) + tolerance
    );
    slideTo(currentSlide.value - Math.sign(delta.y) * draggedSlides);
  }
  if (!config.value.vertical) {
    const direction = (config.value.rtl ? -1 : 1) * Math.sign(delta.x);
    const draggedSlides = Math.round(
      Math.abs(delta.x / slideWidth.value) + tolerance
    );
    slideTo(currentSlide.value - direction * draggedSlides);
  }
  delta.x = 0;
  delta.y = 0;
  document.removeEventListener(
    isTouch.value ? "touchmove" : "mousemove",
    onDrag as EventListener
  );
  document.removeEventListener(
    isTouch.value ? "touchend" : "mouseup",
    onDragEnd
  );
  restartTimer();
}

function onTransitionend() {
  isSliding.value = false;
  emit("afterSlide", {
    currentSlide: currentSlide.value,
  });
}

function onKeypress(event: KeyboardEvent) {
  const key = event.key;
  if (key.startsWith("Arrow")) {
    event.preventDefault();
  }
  if (config.value.vertical) {
    if (key === "ArrowUp") {
      slidePrev();
    }
    if (key === "ArrowDown") {
      slideNext();
    }
    return;
  }
  if (config.value.rtl) {
    if (key === "ArrowRight") {
      slidePrev();
    }
    if (key === "ArrowLeft") {
      slideNext();
    }
    return;
  }
  if (key === "ArrowRight") {
    slideNext();
  }
  if (key === "ArrowLeft") {
    slidePrev();
  }
}

function onWheel(event: WheelEvent) {
  event.preventDefault();
  if (now() - lastScrollTime < 200) {
    return;
  }
  lastScrollTime = now();
  const value = (event as any).wheelDelta || -event.deltaY;
  const d = Math.sign(value);
  if (d === -1) {
    slideNext();
  }
  if (d === 1) {
    slidePrev();
  }
}

function addGroupListeners() {
  if (!props.group) {
    return;
  }

  _groupSlideHandler = (event: Event) => {
    const slideIndex = (event as CustomEvent<number>).detail;
    slideTo(slideIndex, false);
  };
  groupEmitter.addEventListener(
    `slideGroup:${props.group}`,
    _groupSlideHandler
  );
}

function normalizeChildren() {
  const defaultSlot = slots.default?.();
  if (!defaultSlot) return [];

  const children: any[] = [];
  for (const child of defaultSlot) {
    if (typeof child.type === "symbol" && Array.isArray(child.children)) {
      children.push(...child.children);
    } else {
      children.push(child);
    }
  }
  return children;
}

function renderBufferSlides(slides: any[]) {
  const before = [];
  const after = [];
  const count = slides.length;

  for (let i = 0; i < count; i++) {
    const slide = slides[i];
    const clonedBefore = cloneVNode(slide);
    let slideIndex = i - count;
    clonedBefore.key = `before_${i}`;
    clonedBefore.props = {
      index: slideIndex,
      isClone: true,
    };
    before.push(clonedBefore);

    const clonedAfter = cloneVNode(slide);
    slideIndex = i + count;
    clonedAfter.key = `after_${slideIndex}`;
    clonedAfter.props = {
      index: slideIndex,
      isClone: true,
    };
    after.push(clonedAfter);
  }

  return [...before, ...slides, ...after];
}

// Render function for slides track
function renderSlides() {
  const children = normalizeChildren();
  const childrenCount = children.length;
  let idx = 0;
  let slides: any[] = [];

  for (let i = 0; i < childrenCount; i++) {
    const child = children[i];

    if (!child) continue;

    if (typeof child.type === "symbol") {
      (child.children as any[])?.forEach((c: any) => {
        if (c.type?.name !== "HooperSlide") return;

        slides.push({
          ...c,
          key: idx,
          props: {
            ...(c.props || {}),
            isClone: false,
            index: idx++,
          },
        });
      });
      continue;
    }

    if ((child.type as any)?.name !== "HooperSlide") continue;

    slides.push({
      ...child,
      key: idx,
      props: {
        ...(child.props || {}),
        isClone: false,
        index: idx++,
      },
    });
  }

  slidesCount.value = slides.length;
  if (config.value.infiniteScroll) {
    slides = renderBufferSlides(slides);
  }

  return h(
    "ul",
    {
      class: {
        "hooper-track": true,
        "is-dragging": isDragging.value,
      },
      style: trackTransform.value + trackTransition.value,
      onTransitionend: onTransitionend,
      onMousedown: config.value.mouseDrag ? onDragStart : undefined,
      onTouchstart: config.value.touchDrag ? onDragStart : undefined,
    },
    slides
  );
}

// Functional component for track
const SlidesTrack = () => renderSlides();

// Provide for child components
provide(hooperContextKey, {
  config,
  currentSlide,
  slidesCount,
  slideWidth,
  slideHeight,
  slideBounds,
  trimStart,
  trimEnd,
  slides: normalizeChildren,
  slideTo,
  slideNext,
  slidePrev,
  restartTimer,
});

// Lifecycle
initDefaults();

onMounted(() => {
  initEvents();
  addGroupListeners();
  nextTick(() => {
    update();
    slideTo(config.value.initialSlide || 0);

    nextTick(() => {
      update();
    });

    setTimeout(() => {
      emit("loaded");
      initialized.value = true;
    }, props.transition);
  });
});

onBeforeUnmount(() => {
  window.removeEventListener("resize", update);
  if (props.group && _groupSlideHandler) {
    groupEmitter.removeEventListener(
      `slideGroup:${props.group}`,
      _groupSlideHandler
    );
  }

  if (timer.value) {
    timer.value.stop();
  }
});

defineExpose({
  slideTo,
  slideNext,
  slidePrev,
  restart,
  restartTimer,
  update,
});
</script>

<template>
  <section
    ref="rootEl"
    tabindex="0"
    class="hooper"
    :class="{
      'is-vertical': config.vertical,
      'is-rtl': config.rtl,
    }"
    @focusin="isFocus = true"
    @focusout="isFocus = false"
    @mouseover="isHover = true"
    @mouseleave="isHover = false"
  >
    <div class="hooper-list">
      <SlidesTrack />
    </div>
    <slot name="hooper-addons" />
    <div
      class="hooper-liveregion hooper-sr-only"
      aria-live="polite"
      aria-atomic="true"
    >
      Item {{ currentSlide + 1 }} of {{ slidesCount }}
    </div>
  </section>
</template>

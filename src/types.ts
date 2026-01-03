import type { Ref, ComputedRef } from "vue";

export interface HooperConfig {
  itemsToShow: number;
  itemsToSlide: number;
  initialSlide: number;
  infiniteScroll: boolean;
  centerMode: boolean;
  vertical: boolean;
  rtl: boolean | null;
  autoPlay: boolean;
  playSpeed: number;
  mouseDrag: boolean;
  touchDrag: boolean;
  wheelControl: boolean;
  keysControl: boolean;
  shortDrag: boolean;
  transition: number;
  hoverPause: boolean;
  trimWhiteSpace: boolean;
}

export interface SlideBounds {
  lower: number;
  upper: number;
}

export interface HooperContext {
  config: Ref<HooperConfig>;
  currentSlide: Ref<number>;
  slidesCount: Ref<number>;
  slideWidth: Ref<number>;
  slideHeight: Ref<number>;
  slideBounds: ComputedRef<SlideBounds>;
  trimStart: Ref<number>;
  trimEnd: Ref<number>;
  slides: () => any[];
  slideTo: (index: number, isSource?: boolean) => void;
  slideNext: () => void;
  slidePrev: () => void;
  restartTimer: () => void;
}

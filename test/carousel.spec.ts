import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { h, nextTick, defineComponent } from "vue";
import { Hooper, Slide } from "../src/index";

const createCarousel = (props = {}, slots = {}) => {
  const defaultSlots = {
    default: () => [
      h(Slide, { key: 0 }, () => "slide 1"),
      h(Slide, { key: 1 }, () => "slide 2"),
      h(Slide, { key: 2 }, () => "slide 3"),
    ],
    ...slots,
  };

  return mount(Hooper, {
    props,
    slots: defaultSlots,
    attachTo: document.body,
  });
};

describe("Carousel Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    test("renders hooper container", () => {
      const wrapper = createCarousel();
      expect(wrapper.find(".hooper").exists()).toBe(true);
    });

    test("renders correct number of slides", () => {
      const wrapper = createCarousel();
      expect(wrapper.findAll(".hooper-slide").length).toBe(3);
    });

    test("renders hooper-track element", () => {
      const wrapper = createCarousel();
      expect(wrapper.find(".hooper-track").exists()).toBe(true);
    });

    test("renders hooper-list container", () => {
      const wrapper = createCarousel();
      expect(wrapper.find(".hooper-list").exists()).toBe(true);
    });

    test("renders accessibility live region", () => {
      const wrapper = createCarousel();
      expect(wrapper.find(".hooper-liveregion").exists()).toBe(true);
    });
  });

  describe("props", () => {
    test("applies vertical class when vertical prop is true", () => {
      const wrapper = createCarousel({ vertical: true });
      expect(wrapper.find(".is-vertical").exists()).toBe(true);
    });

    test("applies rtl class when rtl prop is true", () => {
      const wrapper = createCarousel({ rtl: true });
      expect(wrapper.find(".is-rtl").exists()).toBe(true);
    });

    test("uses default itemsToShow of 1", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.itemsToShow).toBe(1);
    });

    test("respects custom itemsToShow prop", () => {
      const wrapper = createCarousel({ itemsToShow: 3 });
      expect(wrapper.vm.config.itemsToShow).toBe(3);
    });

    test("uses default itemsToSlide of 1", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.itemsToSlide).toBe(1);
    });

    test("respects custom itemsToSlide prop", () => {
      const wrapper = createCarousel({ itemsToSlide: 2 });
      expect(wrapper.vm.config.itemsToSlide).toBe(2);
    });

    test("has infiniteScroll disabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.infiniteScroll).toBe(false);
    });

    test("has centerMode disabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.centerMode).toBe(false);
    });

    test("has autoPlay disabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.autoPlay).toBe(false);
    });

    test("has default playSpeed of 2000ms", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.playSpeed).toBe(2000);
    });

    test("has mouseDrag enabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.mouseDrag).toBe(true);
    });

    test("has touchDrag enabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.touchDrag).toBe(true);
    });

    test("has wheelControl enabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.wheelControl).toBe(true);
    });

    test("has keysControl enabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.keysControl).toBe(true);
    });

    test("has shortDrag enabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.shortDrag).toBe(true);
    });

    test("has default transition of 300ms", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.transition).toBe(300);
    });

    test("has hoverPause enabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.hoverPause).toBe(true);
    });

    test("has trimWhiteSpace disabled by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.config.trimWhiteSpace).toBe(false);
    });
  });

  describe("navigation methods", () => {
    test("slideNext increments currentSlide", async () => {
      const wrapper = createCarousel();
      await flushPromises();

      expect(wrapper.vm.currentSlide).toBe(0);
      wrapper.vm.slideNext();

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(1);
    });

    test("slidePrev decrements currentSlide", async () => {
      const wrapper = createCarousel({ initialSlide: 2 });
      await flushPromises();

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(2);
      wrapper.vm.slidePrev();

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(1);
    });

    test("slideTo navigates to specific slide", async () => {
      const wrapper = createCarousel();
      await flushPromises();

      wrapper.vm.slideTo(2);

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(2);
    });

    test("slideTo does not go below 0 without infiniteScroll", async () => {
      const wrapper = createCarousel();
      await flushPromises();

      wrapper.vm.slideTo(-1);

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(0);
    });

    test("slideTo does not exceed slidesCount without infiniteScroll", async () => {
      const wrapper = createCarousel();
      await flushPromises();

      wrapper.vm.slideTo(10);

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(2);
    });

    test("slideTo allows negative index with infiniteScroll", async () => {
      const wrapper = createCarousel({ infiniteScroll: true });
      await flushPromises();

      wrapper.vm.slideTo(-1);

      vi.advanceTimersByTime(300);
      await nextTick();

      // Should normalize to last slide
      expect(wrapper.vm.currentSlide).toBe(2);
    });

    test("slideNext with itemsToSlide > 1", async () => {
      const wrapper = createCarousel({ itemsToSlide: 2 });
      await flushPromises();

      expect(wrapper.vm.currentSlide).toBe(0);
      wrapper.vm.slideNext();

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(2);
    });
  });

  describe("events", () => {
    test("emits beforeSlide before sliding", async () => {
      const wrapper = createCarousel();
      await flushPromises();

      wrapper.vm.slideTo(1);

      expect(wrapper.emitted("beforeSlide")).toBeTruthy();
      expect(wrapper.emitted("beforeSlide")![0]).toEqual([
        { currentSlide: 0, slideTo: 1 },
      ]);
    });

    test("emits slide event during sliding", async () => {
      const wrapper = createCarousel();
      await flushPromises();

      wrapper.vm.slideTo(1);

      expect(wrapper.emitted("slide")).toBeTruthy();
      expect(wrapper.emitted("slide")![0]).toEqual([
        { currentSlide: 1, slideFrom: 0 },
      ]);
    });

    test("emits updated event on update", async () => {
      const wrapper = createCarousel();
      await flushPromises();

      wrapper.vm.update();

      expect(wrapper.emitted("updated")).toBeTruthy();
      const event = wrapper.emitted("updated")![0][0] as any;
      expect(event).toHaveProperty("containerWidth");
      expect(event).toHaveProperty("containerHeight");
      expect(event).toHaveProperty("slideWidth");
      expect(event).toHaveProperty("slideHeight");
      expect(event).toHaveProperty("settings");
    });
  });

  describe("computed properties", () => {
    test("slideBounds returns correct bounds", async () => {
      const wrapper = createCarousel({ itemsToShow: 2 });
      await flushPromises();

      expect(wrapper.vm.slideBounds.lower).toBe(0);
      expect(wrapper.vm.slideBounds.upper).toBe(1);
    });

    test("slideBounds with centerMode", async () => {
      const wrapper = createCarousel({ itemsToShow: 3, centerMode: true });
      await flushPromises();

      // With centerMode, bounds are centered around currentSlide
      expect(wrapper.vm.slideBounds.lower).toBe(-1);
      expect(wrapper.vm.slideBounds.upper).toBe(1);
    });

    test("trackTransform includes transform style", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.trackTransform).toContain("transform: translate");
    });

    test("trackTransform uses vertical translate when vertical", () => {
      const wrapper = createCarousel({ vertical: true });
      expect(wrapper.vm.trackTransform).toContain("translate(0,");
    });

    test("trackTransition returns empty string when not initialized", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.trackTransition).toBe("");
    });

    test("trackTransition returns transition style when sliding after initialization", async () => {
      const wrapper = createCarousel();
      await flushPromises();

      // Wait for initialization
      vi.advanceTimersByTime(300);
      await nextTick();

      wrapper.vm.isSliding = true;

      expect(wrapper.vm.trackTransition).toContain("transition:");
      expect(wrapper.vm.trackTransition).toContain("300ms");
    });
  });

  describe("data state", () => {
    test("starts with isDragging false", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.isDragging).toBe(false);
    });

    test("starts with isSliding false", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.isSliding).toBe(false);
    });

    test("starts with isHover false", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.isHover).toBe(false);
    });

    test("starts with isFocus false", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.isFocus).toBe(false);
    });

    test("tracks slide count correctly", async () => {
      const wrapper = createCarousel();
      await flushPromises();

      expect(wrapper.vm.slidesCount).toBe(3);
    });
  });

  describe("infiniteScroll", () => {
    test("renders buffer slides when infiniteScroll is enabled", async () => {
      const wrapper = createCarousel({ infiniteScroll: true });
      await flushPromises();

      // With infiniteScroll, we have: before clones (3) + original (3) + after clones (3) = 9
      const slides = wrapper.findAll(".hooper-slide");
      expect(slides.length).toBe(9);
    });

    test("does not render buffer slides without infiniteScroll", async () => {
      const wrapper = createCarousel({ infiniteScroll: false });
      await flushPromises();

      const slides = wrapper.findAll(".hooper-slide");
      expect(slides.length).toBe(3);
    });
  });

  describe("trimWhiteSpace", () => {
    test("trimStart and trimEnd are 0 and 1 by default", () => {
      const wrapper = createCarousel();
      expect(wrapper.vm.trimStart).toBe(0);
      expect(wrapper.vm.trimEnd).toBe(1);
    });

    test("trimWhiteSpace adjusts trimEnd based on itemsToShow", async () => {
      const wrapper = createCarousel({
        trimWhiteSpace: true,
        itemsToShow: 2,
      });
      await flushPromises();

      wrapper.vm.update();

      expect(wrapper.vm.trimStart).toBe(0);
      expect(wrapper.vm.trimEnd).toBe(2);
    });

    test("trimWhiteSpace with centerMode adjusts both trimStart and trimEnd", async () => {
      const wrapper = createCarousel({
        trimWhiteSpace: true,
        itemsToShow: 3,
        centerMode: true,
      });
      await flushPromises();

      wrapper.vm.update();

      expect(wrapper.vm.trimStart).toBe(1);
      expect(wrapper.vm.trimEnd).toBe(2);
    });

    test("trimWhiteSpace is ignored with infiniteScroll", async () => {
      const wrapper = createCarousel({
        trimWhiteSpace: true,
        infiniteScroll: true,
        itemsToShow: 2,
      });
      await flushPromises();

      wrapper.vm.update();

      expect(wrapper.vm.trimStart).toBe(0);
      expect(wrapper.vm.trimEnd).toBe(1);
    });
  });

  describe("keyboard control", () => {
    test("ArrowRight triggers slideNext in LTR mode", async () => {
      const wrapper = createCarousel({ keysControl: true, rtl: false });
      await flushPromises();

      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      wrapper.vm.onKeypress(event);

      expect(wrapper.vm.currentSlide).toBe(1);
    });

    test("ArrowLeft triggers slidePrev in LTR mode", async () => {
      const wrapper = createCarousel({
        keysControl: true,
        rtl: false,
        initialSlide: 1,
      });
      await flushPromises();

      vi.advanceTimersByTime(300);
      await nextTick();

      const event = new KeyboardEvent("keydown", { key: "ArrowLeft" });
      wrapper.vm.onKeypress(event);

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(0);
    });

    test("ArrowRight triggers slidePrev in RTL mode", async () => {
      const wrapper = createCarousel({
        keysControl: true,
        rtl: true,
        initialSlide: 1,
      });
      await flushPromises();

      vi.advanceTimersByTime(300);
      await nextTick();

      const event = new KeyboardEvent("keydown", { key: "ArrowRight" });
      wrapper.vm.onKeypress(event);

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(0);
    });

    test("ArrowDown triggers slideNext in vertical mode", async () => {
      const wrapper = createCarousel({ keysControl: true, vertical: true });
      await flushPromises();

      const event = new KeyboardEvent("keydown", { key: "ArrowDown" });
      wrapper.vm.onKeypress(event);

      expect(wrapper.vm.currentSlide).toBe(1);
    });

    test("ArrowUp triggers slidePrev in vertical mode", async () => {
      const wrapper = createCarousel({
        keysControl: true,
        vertical: true,
        initialSlide: 1,
      });
      await flushPromises();

      vi.advanceTimersByTime(300);
      await nextTick();

      const event = new KeyboardEvent("keydown", { key: "ArrowUp" });
      wrapper.vm.onKeypress(event);

      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(0);
    });
  });

  describe("hover and focus states", () => {
    test("sets isHover to true on mouseenter", async () => {
      const wrapper = createCarousel();
      await wrapper.find(".hooper").trigger("mouseover");
      expect(wrapper.vm.isHover).toBe(true);
    });

    test("sets isHover to false on mouseleave", async () => {
      const wrapper = createCarousel();
      await wrapper.find(".hooper").trigger("mouseover");
      await wrapper.find(".hooper").trigger("mouseleave");
      expect(wrapper.vm.isHover).toBe(false);
    });

    test("sets isFocus to true on focusin", async () => {
      const wrapper = createCarousel();
      await wrapper.find(".hooper").trigger("focusin");
      expect(wrapper.vm.isFocus).toBe(true);
    });

    test("sets isFocus to false on focusout", async () => {
      const wrapper = createCarousel();
      await wrapper.find(".hooper").trigger("focusin");
      await wrapper.find(".hooper").trigger("focusout");
      expect(wrapper.vm.isFocus).toBe(false);
    });
  });

  describe("dragging state", () => {
    test("adds is-dragging class when dragging", async () => {
      const wrapper = createCarousel();
      wrapper.vm.isDragging = true;
      await nextTick();
      expect(wrapper.find(".is-dragging").exists()).toBe(true);
    });

    test("isInvalidDirection returns true for horizontal drag in vertical mode", () => {
      const wrapper = createCarousel({ vertical: true });
      expect(wrapper.vm.isInvalidDirection(100, 10)).toBe(true);
    });

    test("isInvalidDirection returns false for vertical drag in vertical mode", () => {
      const wrapper = createCarousel({ vertical: true });
      expect(wrapper.vm.isInvalidDirection(10, 100)).toBe(false);
    });

    test("isInvalidDirection returns true for vertical drag in horizontal mode", () => {
      const wrapper = createCarousel({ vertical: false });
      expect(wrapper.vm.isInvalidDirection(10, 100)).toBe(true);
    });

    test("isInvalidDirection returns false for horizontal drag in horizontal mode", () => {
      const wrapper = createCarousel({ vertical: false });
      expect(wrapper.vm.isInvalidDirection(100, 10)).toBe(false);
    });
  });
});

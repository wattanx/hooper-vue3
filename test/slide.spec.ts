import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { h, nextTick } from "vue";
import { Hooper, Slide } from "../src/index";

const createCarouselWithSlides = (carouselProps = {}, slideProps: any[] = []) => {
  const defaultSlideProps = [
    { key: 0 },
    { key: 1 },
    { key: 2 },
    { key: 3 },
    { key: 4 },
  ];

  const slidesToUse = slideProps.length > 0 ? slideProps : defaultSlideProps;

  return mount(Hooper, {
    props: carouselProps,
    slots: {
      default: () =>
        slidesToUse.map((props, index) =>
          h(Slide, { ...props, key: index }, () => `slide ${index + 1}`)
        ),
    },
    attachTo: document.body,
  });
};

describe("Slide Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("rendering", () => {
    test("renders as li element", () => {
      const wrapper = createCarouselWithSlides();
      const slides = wrapper.findAll("li.hooper-slide");
      expect(slides.length).toBe(5);
    });

    test("has hooper-slide class", () => {
      const wrapper = createCarouselWithSlides();
      expect(wrapper.findAll(".hooper-slide").length).toBe(5);
    });

    test("renders slot content", () => {
      const wrapper = createCarouselWithSlides();
      const slides = wrapper.findAll(".hooper-slide");
      expect(slides[0].text()).toBe("slide 1");
      expect(slides[1].text()).toBe("slide 2");
    });
  });

  describe("isActive computed property", () => {
    test("first slide is active when currentSlide is 0", async () => {
      const wrapper = createCarouselWithSlides();
      await flushPromises();

      const slides = wrapper.findAll(".hooper-slide");
      expect(slides[0].classes()).toContain("is-active");
    });

    test("only one slide is active with itemsToShow of 1", async () => {
      const wrapper = createCarouselWithSlides({ itemsToShow: 1 });
      await flushPromises();

      const activeSlides = wrapper.findAll(".is-active");
      expect(activeSlides.length).toBe(1);
    });

    test("multiple slides are active with itemsToShow > 1", async () => {
      const wrapper = createCarouselWithSlides({ itemsToShow: 3 });
      await flushPromises();

      const activeSlides = wrapper.findAll(".is-active");
      expect(activeSlides.length).toBe(3);
    });

    test("active slides shift when navigating", async () => {
      const wrapper = createCarouselWithSlides({ itemsToShow: 2 });
      await flushPromises();

      // Initially slides 0, 1 are active
      let slides = wrapper.findAll(".hooper-slide");
      expect(slides[0].classes()).toContain("is-active");
      expect(slides[1].classes()).toContain("is-active");
      expect(slides[2].classes()).not.toContain("is-active");

      // Navigate to next
      wrapper.vm.slideNext();
      vi.advanceTimersByTime(300);
      await nextTick();

      slides = wrapper.findAll(".hooper-slide");
      expect(slides[0].classes()).not.toContain("is-active");
      expect(slides[1].classes()).toContain("is-active");
      expect(slides[2].classes()).toContain("is-active");
    });
  });

  describe("isCurrent computed property", () => {
    test("first slide has is-current class initially", async () => {
      const wrapper = createCarouselWithSlides();
      await flushPromises();

      const slides = wrapper.findAll(".hooper-slide");
      expect(slides[0].classes()).toContain("is-current");
    });

    test("only one slide has is-current at a time", async () => {
      const wrapper = createCarouselWithSlides({ itemsToShow: 3 });
      await flushPromises();

      const currentSlides = wrapper.findAll(".is-current");
      expect(currentSlides.length).toBe(1);
    });

    test("is-current moves with navigation", async () => {
      const wrapper = createCarouselWithSlides();
      await flushPromises();

      wrapper.vm.slideTo(2);
      vi.advanceTimersByTime(300);
      await nextTick();

      const slides = wrapper.findAll(".hooper-slide");
      expect(slides[0].classes()).not.toContain("is-current");
      expect(slides[2].classes()).toContain("is-current");
    });
  });

  describe("isPrev computed property", () => {
    test("no slides have is-prev class when at first slide", async () => {
      const wrapper = createCarouselWithSlides();
      await flushPromises();

      const prevSlides = wrapper.findAll(".is-prev");
      expect(prevSlides.length).toBe(0);
    });

    test("previous slide has is-prev class after navigation", async () => {
      const wrapper = createCarouselWithSlides();
      await flushPromises();

      wrapper.vm.slideTo(1);
      vi.advanceTimersByTime(300);
      await nextTick();

      const slides = wrapper.findAll(".hooper-slide");
      expect(slides[0].classes()).toContain("is-prev");
    });

    test("multiple prev slides with itemsToSlide > 1", async () => {
      const wrapper = createCarouselWithSlides({ itemsToSlide: 2 });
      await flushPromises();

      wrapper.vm.slideTo(2);
      vi.advanceTimersByTime(300);
      await nextTick();

      const prevSlides = wrapper.findAll(".is-prev");
      expect(prevSlides.length).toBe(2);
    });
  });

  describe("isNext computed property", () => {
    test("next slide has is-next class", async () => {
      const wrapper = createCarouselWithSlides();
      await flushPromises();

      const slides = wrapper.findAll(".hooper-slide");
      expect(slides[1].classes()).toContain("is-next");
    });

    test("no slides have is-next class at last slide", async () => {
      const wrapper = createCarouselWithSlides();
      await flushPromises();

      wrapper.vm.slideTo(4);
      vi.advanceTimersByTime(300);
      await nextTick();

      const nextSlides = wrapper.findAll(".is-next");
      expect(nextSlides.length).toBe(0);
    });

    test("multiple next slides with itemsToSlide > 1", async () => {
      const wrapper = createCarouselWithSlides({ itemsToSlide: 2 });
      await flushPromises();

      const nextSlides = wrapper.findAll(".is-next");
      expect(nextSlides.length).toBe(2);
    });
  });

  describe("style computed property", () => {
    test("has width style in horizontal mode", async () => {
      const wrapper = createCarouselWithSlides({ vertical: false });
      await flushPromises();

      wrapper.vm.update();
      await nextTick();

      const slide = wrapper.find(".hooper-slide");
      const style = slide.attributes("style");
      expect(style).toContain("width:");
    });

    test("has height style in vertical mode", async () => {
      const wrapper = createCarouselWithSlides({ vertical: true });
      await flushPromises();

      wrapper.vm.update();
      await nextTick();

      const slide = wrapper.find(".hooper-slide");
      const style = slide.attributes("style");
      expect(style).toContain("height:");
    });
  });

  describe("isClone prop", () => {
    test("clone slides have is-clone class", async () => {
      const wrapper = createCarouselWithSlides({ infiniteScroll: true });
      await flushPromises();

      const cloneSlides = wrapper.findAll(".is-clone");
      // 5 slides × 2 (before and after clones) = 10 clones
      expect(cloneSlides.length).toBe(10);
    });

    test("non-clone slides do not have is-clone class", async () => {
      const wrapper = createCarouselWithSlides({ infiniteScroll: false });
      await flushPromises();

      const cloneSlides = wrapper.findAll(".is-clone");
      expect(cloneSlides.length).toBe(0);
    });
  });

  describe("centerMode behavior", () => {
    test("active bounds are centered in centerMode", async () => {
      const wrapper = createCarouselWithSlides({
        itemsToShow: 3,
        centerMode: true,
      });
      await flushPromises();

      // In centerMode, active slides should be centered around currentSlide
      // With itemsToShow: 3, bounds are lower: -1, upper: 1
      // So only slide at index 0 is active (since index -1 doesn't exist)
      const slides = wrapper.findAll(".hooper-slide");

      // Slide 0 should be active (it's within bounds)
      expect(slides[0].classes()).toContain("is-active");
    });

    test("navigating in centerMode shifts active region", async () => {
      const wrapper = createCarouselWithSlides({
        itemsToShow: 3,
        centerMode: true,
      });
      await flushPromises();

      wrapper.vm.slideTo(2);
      vi.advanceTimersByTime(300);
      await nextTick();

      // With currentSlide: 2 and centerMode, bounds are lower: 1, upper: 3
      const slides = wrapper.findAll(".hooper-slide");
      expect(slides[1].classes()).toContain("is-active");
      expect(slides[2].classes()).toContain("is-active");
      expect(slides[3].classes()).toContain("is-active");
    });
  });

  describe("aria-hidden attribute", () => {
    test("active slides have aria-hidden set", async () => {
      const wrapper = createCarouselWithSlides();
      await flushPromises();

      const slide = wrapper.find(".is-active");
      expect(slide.attributes("aria-hidden")).toBeDefined();
    });
  });

  describe("duration prop", () => {
    test("slide can have custom duration prop", async () => {
      const wrapper = mount(Hooper, {
        slots: {
          default: () => [
            h(Slide, { key: 0, duration: 1000 }, () => "slide 1"),
            h(Slide, { key: 1, duration: 2000 }, () => "slide 2"),
            h(Slide, { key: 2 }, () => "slide 3"),
          ],
        },
        attachTo: document.body,
      });
      await flushPromises();

      // Verify slides render correctly with duration prop
      expect(wrapper.findAll(".hooper-slide").length).toBe(3);
    });
  });
});

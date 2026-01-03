import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import { mount, flushPromises } from "@vue/test-utils";
import { h, nextTick } from "vue";
import {
  Hooper,
  Slide,
  Navigation,
  Pagination,
  Progress,
  Icon,
} from "../src/index";

const createCarouselWithAddon = (
  addon: any,
  carouselProps = {},
  addonProps = {}
) => {
  return mount(Hooper, {
    props: carouselProps,
    slots: {
      default: () => [
        h(Slide, { key: 0 }, () => "slide 1"),
        h(Slide, { key: 1 }, () => "slide 2"),
        h(Slide, { key: 2 }, () => "slide 3"),
        h(Slide, { key: 3 }, () => "slide 4"),
        h(Slide, { key: 4 }, () => "slide 5"),
      ],
      "hooper-addons": () => [h(addon, addonProps)],
    },
    attachTo: document.body,
  });
};

describe("Icon Component", () => {
  test("renders svg element", () => {
    const wrapper = mount(Icon, { props: { name: "arrowLeft" } });
    expect(wrapper.find("svg").exists()).toBe(true);
  });

  test("renders with correct icon class", () => {
    const wrapper = mount(Icon, { props: { name: "arrowLeft" } });
    expect(wrapper.find("svg").classes()).toContain("icon");
    expect(wrapper.find("svg").classes()).toContain("icon-arrowLeft");
  });

  test("renders title element with readable name", () => {
    const wrapper = mount(Icon, { props: { name: "arrowLeft" } });
    expect(wrapper.find("title").text()).toBe("Arrow Left");
  });

  test("has correct viewBox", () => {
    const wrapper = mount(Icon, { props: { name: "arrowRight" } });
    expect(wrapper.find("svg").attributes("viewBox")).toBe("0 0 24 24");
  });

  test("has correct dimensions", () => {
    const wrapper = mount(Icon, { props: { name: "arrowUp" } });
    expect(wrapper.find("svg").attributes("width")).toBe("24px");
    expect(wrapper.find("svg").attributes("height")).toBe("24px");
  });

  test("renders all icon types", () => {
    const icons = ["arrowUp", "arrowDown", "arrowLeft", "arrowRight"] as const;

    icons.forEach((iconName) => {
      const wrapper = mount(Icon, { props: { name: iconName } });
      expect(wrapper.find("svg").exists()).toBe(true);
      expect(wrapper.find("path[d]").exists()).toBe(true);
    });
  });

  test("renders correct path for arrowUp", () => {
    const wrapper = mount(Icon, { props: { name: "arrowUp" } });
    const paths = wrapper.findAll("path");
    // First path is empty (fill: none), second is the icon
    expect(paths[1].attributes("d")).toBe(
      "M7.41 15.41L12 10.83l4.59 4.58L18 14l-6-6-6 6z"
    );
  });

  test("renders correct path for arrowDown", () => {
    const wrapper = mount(Icon, { props: { name: "arrowDown" } });
    const paths = wrapper.findAll("path");
    expect(paths[1].attributes("d")).toBe(
      "M7.41 8.59L12 13.17l4.59-4.58L18 10l-6 6-6-6 1.41-1.41z"
    );
  });
});

describe("Navigation Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders navigation container", async () => {
    const wrapper = createCarouselWithAddon(Navigation);
    await flushPromises();
    expect(wrapper.find(".hooper-navigation").exists()).toBe(true);
  });

  test("renders prev and next buttons", async () => {
    const wrapper = createCarouselWithAddon(Navigation);
    await flushPromises();
    expect(wrapper.find(".hooper-prev").exists()).toBe(true);
    expect(wrapper.find(".hooper-next").exists()).toBe(true);
  });

  test("prev button is disabled at first slide", async () => {
    const wrapper = createCarouselWithAddon(Navigation);
    await flushPromises();
    expect(wrapper.find(".hooper-prev").classes()).toContain("is-disabled");
  });

  test("next button is not disabled at first slide", async () => {
    const wrapper = createCarouselWithAddon(Navigation);
    await flushPromises();
    expect(wrapper.find(".hooper-next").classes()).not.toContain("is-disabled");
  });

  test("prev button becomes enabled after navigation", async () => {
    const wrapper = createCarouselWithAddon(Navigation);
    await flushPromises();

    wrapper.vm.slideNext();
    vi.advanceTimersByTime(300);
    await nextTick();

    expect(wrapper.find(".hooper-prev").classes()).not.toContain("is-disabled");
  });

  test("next button becomes disabled at last slide", async () => {
    const wrapper = createCarouselWithAddon(Navigation);
    await flushPromises();

    wrapper.vm.slideTo(4);
    vi.advanceTimersByTime(300);
    await nextTick();

    expect(wrapper.find(".hooper-next").classes()).toContain("is-disabled");
  });

  test("buttons are never disabled with infiniteScroll", async () => {
    const wrapper = createCarouselWithAddon(Navigation, {
      infiniteScroll: true,
    });
    await flushPromises();

    // At first slide, prev should not be disabled
    expect(wrapper.find(".hooper-prev").classes()).not.toContain("is-disabled");

    // At last slide, next should not be disabled
    wrapper.vm.slideTo(4);
    vi.advanceTimersByTime(300);
    await nextTick();

    expect(wrapper.find(".hooper-next").classes()).not.toContain("is-disabled");
  });

  test("clicking next button navigates forward", async () => {
    const wrapper = createCarouselWithAddon(Navigation);
    await flushPromises();

    await wrapper.find(".hooper-next").trigger("click");
    vi.advanceTimersByTime(300);
    await nextTick();

    expect(wrapper.vm.currentSlide).toBe(1);
  });

  test("clicking prev button navigates backward", async () => {
    const wrapper = createCarouselWithAddon(Navigation, { initialSlide: 2 });
    await flushPromises();

    vi.advanceTimersByTime(300);
    await nextTick();

    await wrapper.find(".hooper-prev").trigger("click");
    vi.advanceTimersByTime(300);
    await nextTick();

    expect(wrapper.vm.currentSlide).toBe(1);
  });

  test("renders correct icon for horizontal mode", async () => {
    const wrapper = createCarouselWithAddon(Navigation, { vertical: false });
    await flushPromises();

    expect(wrapper.find(".icon-arrowLeft").exists()).toBe(true);
    expect(wrapper.find(".icon-arrowRight").exists()).toBe(true);
  });

  test("renders correct icon for vertical mode", async () => {
    const wrapper = createCarouselWithAddon(Navigation, { vertical: true });
    await flushPromises();

    expect(wrapper.find(".icon-arrowUp").exists()).toBe(true);
    expect(wrapper.find(".icon-arrowDown").exists()).toBe(true);
  });

  test("renders correct icon for RTL mode", async () => {
    const wrapper = createCarouselWithAddon(Navigation, { rtl: true });
    await flushPromises();

    // In RTL, prev uses arrowRight, next uses arrowLeft
    expect(wrapper.find(".hooper-prev .icon-arrowRight").exists()).toBe(true);
    expect(wrapper.find(".hooper-next .icon-arrowLeft").exists()).toBe(true);
  });

  test("adds is-vertical class in vertical mode", async () => {
    const wrapper = createCarouselWithAddon(Navigation, { vertical: true });
    await flushPromises();
    expect(wrapper.find(".hooper-navigation.is-vertical").exists()).toBe(true);
  });

  test("adds is-rtl class in RTL mode", async () => {
    const wrapper = createCarouselWithAddon(Navigation, { rtl: true });
    await flushPromises();
    expect(wrapper.find(".hooper-navigation.is-rtl").exists()).toBe(true);
  });

  test("next button disabled with trimWhiteSpace at boundary", async () => {
    const wrapper = createCarouselWithAddon(Navigation, {
      trimWhiteSpace: true,
      itemsToShow: 2,
    });
    await flushPromises();

    // With 5 slides and itemsToShow: 2, last valid slide is 5 - 2 = 3
    wrapper.vm.slideTo(3);
    vi.advanceTimersByTime(300);
    await nextTick();

    expect(wrapper.find(".hooper-next").classes()).toContain("is-disabled");
  });
});

describe("Pagination Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  describe("indicator mode (default)", () => {
    test("renders pagination container", async () => {
      const wrapper = createCarouselWithAddon(Pagination);
      await flushPromises();
      expect(wrapper.find(".hooper-pagination").exists()).toBe(true);
    });

    test("renders indicators list", async () => {
      const wrapper = createCarouselWithAddon(Pagination);
      await flushPromises();
      expect(wrapper.find(".hooper-indicators").exists()).toBe(true);
    });

    test("renders correct number of indicators", async () => {
      const wrapper = createCarouselWithAddon(Pagination);
      await flushPromises();
      expect(wrapper.findAll(".hooper-indicator").length).toBe(5);
    });

    test("first indicator is active initially", async () => {
      const wrapper = createCarouselWithAddon(Pagination);
      await flushPromises();
      const indicators = wrapper.findAll(".hooper-indicator");
      expect(indicators[0].classes()).toContain("is-active");
    });

    test("only one indicator is active at a time", async () => {
      const wrapper = createCarouselWithAddon(Pagination);
      await flushPromises();
      expect(wrapper.findAll(".hooper-indicator.is-active").length).toBe(1);
    });

    test("clicking indicator navigates to that slide", async () => {
      const wrapper = createCarouselWithAddon(Pagination);
      await flushPromises();

      const indicators = wrapper.findAll(".hooper-indicator");
      await indicators[2].trigger("click");
      vi.advanceTimersByTime(300);
      await nextTick();

      expect(wrapper.vm.currentSlide).toBe(2);
    });

    test("active indicator changes on navigation", async () => {
      const wrapper = createCarouselWithAddon(Pagination);
      await flushPromises();

      wrapper.vm.slideTo(3);
      vi.advanceTimersByTime(300);
      await nextTick();

      const indicators = wrapper.findAll(".hooper-indicator");
      expect(indicators[0].classes()).not.toContain("is-active");
      expect(indicators[3].classes()).toContain("is-active");
    });

    test("indicators have screen reader text", async () => {
      const wrapper = createCarouselWithAddon(Pagination);
      await flushPromises();
      expect(wrapper.find(".hooper-sr-only").exists()).toBe(true);
    });
  });

  describe("fraction mode", () => {
    test("renders fraction instead of indicators", async () => {
      const wrapper = createCarouselWithAddon(Pagination, {}, { mode: "fraction" });
      await flushPromises();

      expect(wrapper.find(".hooper-indicators").exists()).toBe(false);
      expect(wrapper.find(".hooper-pagination").text()).toContain("/");
    });

    test("shows current slide number and total", async () => {
      const wrapper = createCarouselWithAddon(Pagination, {}, { mode: "fraction" });
      await flushPromises();

      // Format is "1 / 5" (current + 1 because 0-indexed)
      const text = wrapper.find(".hooper-pagination").text();
      expect(text).toContain("1");
      expect(text).toContain("5");
    });

    test("fraction updates on navigation", async () => {
      const wrapper = createCarouselWithAddon(Pagination, {}, { mode: "fraction" });
      await flushPromises();

      wrapper.vm.slideTo(2);
      vi.advanceTimersByTime(300);
      await nextTick();

      const text = wrapper.find(".hooper-pagination").text();
      expect(text).toContain("3"); // 2 + 1
    });
  });

  test("adds is-vertical class in vertical mode", async () => {
    const wrapper = createCarouselWithAddon(Pagination, { vertical: true });
    await flushPromises();
    expect(wrapper.find(".hooper-pagination.is-vertical").exists()).toBe(true);
  });
});

describe("Progress Component", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("renders progress container", async () => {
    const wrapper = createCarouselWithAddon(Progress);
    await flushPromises();
    expect(wrapper.find(".hooper-progress").exists()).toBe(true);
  });

  test("renders inner progress bar", async () => {
    const wrapper = createCarouselWithAddon(Progress);
    await flushPromises();
    expect(wrapper.find(".hooper-progress-inner").exists()).toBe(true);
  });

  test("progress starts at 0% at first slide", async () => {
    const wrapper = createCarouselWithAddon(Progress);
    await flushPromises();

    const inner = wrapper.find(".hooper-progress-inner");
    expect(inner.attributes("style")).toContain("width: 0%");
  });

  test("progress increases as slides advance", async () => {
    const wrapper = createCarouselWithAddon(Progress);
    await flushPromises();

    wrapper.vm.slideTo(2);
    vi.advanceTimersByTime(300);
    await nextTick();

    const inner = wrapper.find(".hooper-progress-inner");
    const style = inner.attributes("style");
    // With 5 slides, at index 2: (2 - 0) * 100 / (5 - 0 - 1) = 50%
    expect(style).toContain("width: 50%");
  });

  test("progress is 100% at last slide", async () => {
    const wrapper = createCarouselWithAddon(Progress);
    await flushPromises();

    wrapper.vm.slideTo(4);
    vi.advanceTimersByTime(300);
    await nextTick();

    const inner = wrapper.find(".hooper-progress-inner");
    expect(inner.attributes("style")).toContain("width: 100%");
  });

  test("progress accounts for trimWhiteSpace", async () => {
    const wrapper = createCarouselWithAddon(Progress, {
      trimWhiteSpace: true,
      itemsToShow: 2,
    });
    await flushPromises();

    wrapper.vm.update();
    await nextTick();

    // With trimWhiteSpace, the range changes
    // range = slidesCount - trimStart - trimEnd = 5 - 0 - 2 = 3
    wrapper.vm.slideTo(1);
    vi.advanceTimersByTime(300);
    await nextTick();

    const inner = wrapper.find(".hooper-progress-inner");
    const style = inner.attributes("style");
    // progress = ((1 - 0) * 100) / 3 = 33.33...%
    expect(style).toMatch(/width: 33\.3/);
  });
});

import { describe, test, expect } from "vitest";

import { mount } from "@vue/test-utils";
import { Hooper, Slide, Navigation } from "../src/index";

const App = {
  components: {
    Hooper,
    Slide,
    Navigation,
  },
  template: `
      <hooper>
        <slide>slide 1</slide>
        <slide>slide 2</slide>
        <slide>slide 3</slide>
        <template #hooper-addons>
          <navigation></navigation>
        </template>
      </hooper>
    `,
};

describe("Testing hooper component", () => {
  const wrapper = mount(App);

  test("default slot", () => {
    const slides = wrapper.findAll(".hooper-slide");
    expect(slides.length).toEqual(3);
  });
  test("addons slot", () => {
    expect(wrapper.find(".hooper-navigation").exists()).toBe(true);
    expect(wrapper.find(".hooper-next").exists()).toBe(true);
    expect(wrapper.find(".hooper-prev").exists()).toBe(true);
  });
});

import { h, defineComponent } from "vue";
import { normalizeSlideIndex } from "../utils";
import "../styles/pagination.css";

function renderFraction(current: number, totalCount: number) {
  return [h("span", current + 1), h("span", "/"), h("span", totalCount)];
}

function renderIndicator(
  index: number,
  isCurrent: boolean,
  onClick: () => void
) {
  return h("li", [
    h(
      "button",
      {
        class: { "hooper-indicator": true, "is-active": isCurrent },
        type: "button",
        onClick: onClick,
      },
      [h("span", { class: "hooper-sr-only" }, `item ${index}`)]
    ),
  ]);
}

function renderDefault(
  current: number,
  totalCount: number,
  slideToIndex: (index: number) => void
) {
  const children = [];
  for (let i = 0; i < totalCount; i++) {
    children.push(renderIndicator(i, i === current, () => slideToIndex(i)));
  }

  return [
    h(
      "ol",
      {
        class: "hooper-indicators",
      },
      children
    ),
  ];
}

export default defineComponent({
  inject: ["$hooper"],
  name: "HooperPagination",
  props: {
    mode: {
      default: "indicator",
      type: String,
    },
  },
  computed: {
    currentSlide() {
      return normalizeSlideIndex(
        this.$hooper.currentSlide,
        this.$hooper.slidesCount
      );
    },
    slides() {
      // @ts-expect-error
      const slides = this.$hooper.slides.map((_, index) => index);
      return slides.slice(
        this.$hooper.trimStart,
        this.$hooper.slidesCount - this.$hooper.trimEnd + 1
      );
    },
  },
  render() {
    const totalCount = this.$hooper.slidesCount;
    const children =
      this.mode === "indicator"
        ? renderDefault(this.currentSlide, totalCount, (index) =>
            this.$hooper.slideTo(index)
          )
        : renderFraction(this.currentSlide, totalCount);

    return h(
      "div",
      {
        class: {
          "hooper-pagination": true,
          "is-vertical": this.$hooper.config.vertical,
        },
      },
      children
    );
  },
});

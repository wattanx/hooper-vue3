import { h } from "vue";
import { normalizeSlideIndex } from "../utils";
import "../styles/pagination.css";

function renderFraction(current, totalCount) {
  return [h("span", current + 1), h("span", "/"), h("span", totalCount)];
}

function renderIndicator(index, isCurrent, onClick) {
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

function renderDefault(current, totalCount, slideToIndex) {
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

export default {
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
};

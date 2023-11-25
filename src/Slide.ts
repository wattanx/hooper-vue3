import { h, defineComponent } from "vue";
import { normalizeChildren } from "./utils";
import "./styles/slide.css";

export default defineComponent({
  name: "HooperSlide",
  inject: ["$hooper"],
  props: {
    isClone: {
      type: Boolean,
      default: false,
    },
    index: {
      type: Number,
      default: 0,
    },
    duration: {
      type: Number,
      default: 0,
    },
  },
  computed: {
    style() {
      const { config, slideHeight, slideWidth } = this.$hooper || {};
      if (config.vertical) {
        return `height: ${slideHeight}px`;
      }

      return `width: ${slideWidth}px`;
    },
    isActive() {
      const { upper, lower } = this.$hooper.slideBounds;

      return this.index >= lower && this.index <= upper;
    },
    isPrev() {
      const { lower } = this.$hooper.slideBounds;
      const { itemsToSlide } = this.$hooper.config;

      return this.index < lower && this.index >= lower - itemsToSlide;
    },
    isNext() {
      const { upper } = this.$hooper.slideBounds;
      const { itemsToSlide } = this.$hooper.config;

      return this.index > upper && this.index <= upper + itemsToSlide;
    },
    isCurrent() {
      return this.index === this.$hooper.currentSlide;
    },
  },
  render() {
    const classes = {
      "hooper-slide": true,
      "is-clone": this.isClone,
      "is-active": this.isActive,
      "is-prev": this.isPrev,
      "is-next": this.isNext,
      "is-current": this.isCurrent,
    };

    const children = normalizeChildren(this);

    return h(
      "li",
      {
        class: classes,
        style: this.style,
        "aria-hidden": this.isActive,
      },
      children
    );
  },
});

import { h, defineComponent } from "vue";
import { normalizeSlideIndex } from "../utils";
import "../styles/progress.css";

export default defineComponent({
  inject: ["$hooper"],
  name: "HooperProgress",
  computed: {
    currentSlide() {
      return normalizeSlideIndex(
        this.$hooper.currentSlide,
        this.$hooper.slidesCount
      );
    },
    progress() {
      const range =
        this.$hooper.slidesCount -
        this.$hooper.trimStart -
        this.$hooper.trimEnd;
      return ((this.currentSlide - this.$hooper.trimStart) * 100) / range;
    },
  },
  render() {
    return h("div", { class: "hooper-progress" }, [
      h("div", {
        class: "hooper-progress-inner",
        style: `width: ${this.progress}%`,
      }),
    ]);
  },
});

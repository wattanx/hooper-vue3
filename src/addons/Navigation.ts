import { h, defineComponent } from "vue";
import Icon from "./Icon";
import "../styles/navigation.css";

function iconName(isVertical: boolean, isRTL: boolean, isPrev: boolean) {
  if (isPrev) {
    return isVertical ? "arrowUp" : isRTL ? "arrowRight" : "arrowLeft";
  }

  return isVertical ? "arrowDown" : isRTL ? "arrowLeft" : "arrowRight";
}

function renderButton(
  disabled: boolean,
  slot: any,
  isPrev: boolean,
  { isVertical, isRTL }: { isVertical: boolean; isRTL: boolean },
  onClick: () => void
) {
  const children =
    slot && slot.length
      ? slot()
      : [
          h(Icon, {
            name: iconName(isVertical, isRTL, isPrev),
          }),
        ];

  return h(
    "button",
    {
      class: {
        [`hooper-${isPrev ? "prev" : "next"}`]: true,
        "is-disabled": disabled,
      },
      type: "button",
      onClick: onClick,
    },
    children
  );
}

export default defineComponent({
  inject: ["$hooper"],
  name: "HooperNavigation",
  computed: {
    isPrevDisabled() {
      if (this.$hooper.config.infiniteScroll) {
        return false;
      }
      return this.$hooper.currentSlide === 0;
    },
    isNextDisabled() {
      if (this.$hooper.config.infiniteScroll) {
        return false;
      }

      if (this.$hooper.config.trimWhiteSpace) {
        return (
          this.$hooper.currentSlide ===
          this.$hooper.slidesCount -
            Math.min(this.$hooper.config.itemsToShow, this.$hooper.slidesCount)
        );
      }

      return this.$hooper.currentSlide === this.$hooper.slidesCount - 1;
    },
  },
  methods: {
    slideNext() {
      this.$hooper.slideNext();
      this.$hooper.restartTimer();
    },
    slidePrev() {
      this.$hooper.slidePrev();
      this.$hooper.restartTimer();
    },
  },
  render() {
    const config = {
      isRTL: this.$hooper.config.rtl,
      isVertical: this.$hooper.config.vertical,
    };

    const children = [
      renderButton(
        this.isPrevDisabled,
        this.$slots["hooper-prev"],
        true,
        config,
        () => this.slidePrev()
      ),
      renderButton(
        this.isNextDisabled,
        this.$slots["hooper-next"],
        false,
        config,
        () => this.slideNext()
      ),
    ];

    return h(
      "div",
      {
        class: {
          "hooper-navigation": true,
          "is-vertical": this.$hooper.config.vertical,
          "is-rtl": this.$hooper.config.rtl,
        },
      },
      children
    );
  },
});

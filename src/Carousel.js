import { h, nextTick, cloneVNode } from "vue";
import {
  getInRange,
  now,
  Timer,
  normalizeSlideIndex,
  normalizeChildren,
} from "./utils";
import "./styles/carousel.css";
import emitter from "tiny-emitter/instance";

let EMITTER = {
  $on: (...args) => emitter.on(...args),
  $once: (...args) => emitter.on(...args),
  $off: (...args) => emitter.on(...args),
  $emit: (...args) => emitter.on(...args),
};

function renderBufferSlides(slides) {
  const before = [];
  const after = [];
  // reduce prop access
  const slidesCount = slides.length;

  for (let i = 0; i < slidesCount; i++) {
    const slide = slides[i];
    const clonedBefore = cloneVNode(slide);
    let slideIndex = i - slidesCount;
    clonedBefore.key = `before_${i}`;
    clonedBefore.props = {
      index: slideIndex,
      isClone: true,
    };

    before.push(clonedBefore);

    const clonedAfter = cloneVNode(slide);
    slideIndex = i + slidesCount;
    clonedAfter.key = `after_${slideIndex}`;
    clonedAfter.props = {
      index: slideIndex,
      isClone: true,
    };
    after.push(clonedAfter);
  }

  return [...before, ...slides, ...after];
}

export default {
  name: "Hooper",
  provide() {
    return {
      $hooper: this,
    };
  },
  props: {
    // count of items to showed per view
    itemsToShow: {
      default: 1,
      type: Number,
    },
    // count of items to slide when use navigation buttons
    itemsToSlide: {
      default: 1,
      type: Number,
    },
    // index number of initial slide
    initialSlide: {
      default: 0,
      type: Number,
    },
    // control infinite scrolling mode
    infiniteScroll: {
      default: false,
      type: Boolean,
    },
    // control center mode
    centerMode: {
      default: false,
      type: Boolean,
    },
    // vertical sliding mode
    vertical: {
      default: false,
      type: Boolean,
    },
    // enable rtl mode
    rtl: {
      default: null,
      type: Boolean,
    },
    // enable auto sliding to carousel
    autoPlay: {
      default: false,
      type: Boolean,
    },
    // speed of auto play to trigger slide
    playSpeed: {
      default: 2000,
      type: Number,
    },
    // toggle mouse dragging
    mouseDrag: {
      default: true,
      type: Boolean,
    },
    // toggle touch dragging
    touchDrag: {
      default: true,
      type: Boolean,
    },
    // toggle mouse wheel sliding
    wheelControl: {
      default: true,
      type: Boolean,
    },
    // toggle keyboard control
    keysControl: {
      default: true,
      type: Boolean,
    },
    // enable any move to commit a slide
    shortDrag: {
      default: true,
      type: Boolean,
    },
    // sliding transition time in ms
    transition: {
      default: 300,
      type: Number,
    },
    // pause autoPlay on mousehover
    hoverPause: {
      default: true,
      type: Boolean,
    },
    // remove empty space around slides
    trimWhiteSpace: {
      default: false,
      type: Boolean,
    },
    // an object to pass all settings
    settings: {
      default() {
        return {};
      },
      type: Object,
    },
    group: {
      type: String,
      default: null,
    },
  },
  data() {
    return {
      isDragging: false,
      isSliding: false,
      isTouch: false,
      isHover: false,
      isFocus: false,
      initialized: false,
      slideWidth: 0,
      containerWidth: 0,
      containerHeight: 0,
      slideHeight: 0,
      slidesCount: 0,
      trimStart: 0,
      trimEnd: 1,
      currentSlide: null,
      timer: null,
      defaults: {},
      breakpoints: {},
      delta: { x: 0, y: 0 },
      config: {},
    };
  },
  emits: ["updated", "slide", "afterSlide", "beforeSlide", "loaded"],
  computed: {
    slideBounds() {
      const { config, currentSlide } = this;
      // Because the "isActive" depends on the slides shown, not the number of slidable ones.
      // but upper and lower bounds for Next,Prev depend on whatever is smaller.
      const siblings = config.itemsToShow;
      const lower = config.centerMode
        ? Math.ceil(currentSlide - siblings / 2)
        : currentSlide;
      const upper = config.centerMode
        ? Math.floor(currentSlide + siblings / 2)
        : Math.floor(currentSlide + siblings - 1);

      return {
        lower,
        upper,
      };
    },
    trackTransform() {
      const { infiniteScroll, vertical, rtl, centerMode } = this.config;

      const direction = rtl ? -1 : 1;
      const slideLength = vertical ? this.slideHeight : this.slideWidth;
      const containerLength = vertical
        ? this.containerHeight
        : this.containerWidth;
      const dragDelta = vertical ? this.delta.y : this.delta.x;
      const clonesSpace = infiniteScroll ? slideLength * this.slidesCount : 0;
      const centeringSpace = centerMode
        ? (containerLength - slideLength) / 2
        : 0;

      // calculate track translate
      const translate =
        dragDelta +
        direction *
          (centeringSpace - clonesSpace - this.currentSlide * slideLength);

      if (vertical) {
        return `transform: translate(0, ${translate}px);`;
      }

      return `transform: translate(${translate}px, 0);`;
    },
    trackTransition() {
      if (this.initialized && this.isSliding) {
        return `transition: ${this.config.transition}ms`;
      }

      return "";
    },
  },
  watch: {
    group(val, oldVal) {
      if (val === oldVal) {
        return;
      }

      EMITTER.$off(`slideGroup:${oldVal}`, this._groupSlideHandler);
      this.addGroupListeners();
    },
    autoPlay(val, oldVal) {
      if (val === oldVal) {
        return;
      }
      this.restartTimer();
    },
  },
  methods: {
    // controlling methods
    slideTo(slideIndex, isSource = true) {
      if (this.isSliding || slideIndex === this.currentSlide) {
        return;
      }

      const { infiniteScroll, transition } = this.config;

      const index = infiniteScroll
        ? slideIndex
        : getInRange(
            slideIndex,
            this.trimStart,
            this.slidesCount - this.trimEnd
          );

      this.$emit("beforeSlide", {
        currentSlide: this.currentSlide,
        slideTo: index,
      });

      const previousSlide = this.currentSlide;

      // Notify others if in a group and is the slide event initiator.
      if (this.group && isSource) {
        EMITTER.$emit(`slideGroup:${this.group}`, slideIndex);
      }

      this.currentSlide = index;
      this.isSliding = true;

      window.setTimeout(() => {
        this.isSliding = false;
        this.currentSlide = normalizeSlideIndex(index, this.slidesCount);
      }, transition);

      this.$emit("slide", {
        currentSlide: this.currentSlide,
        slideFrom: previousSlide,
      });
    },
    slideNext() {
      this.slideTo(this.currentSlide + this.config.itemsToSlide);
    },
    slidePrev() {
      this.slideTo(this.currentSlide - this.config.itemsToSlide);
    },

    initEvents() {
      // get the element direction if not explicitly set
      if (this.defaults.rtl === null) {
        this.defaults.rtl = getComputedStyle(this.$el).direction === "rtl";
      }

      if (this.$props.autoPlay) {
        this.initAutoPlay();
      }
      if (this.config.keysControl) {
        this.$el.addEventListener("keydown", this.onKeypress);
      }
      if (this.config.wheelControl) {
        this.lastScrollTime = now();
        this.$el.addEventListener("wheel", this.onWheel, { passive: false });
      }
      window.addEventListener("resize", this.update);
    },
    getCurrentSlideTimeout() {
      const curIdx = normalizeSlideIndex(this.currentSlide, this.slidesCount);
      const children = normalizeChildren(this);
      return children[curIdx].props?.duration ?? this.playSpeed;
    }, // switched to using a timeout which defaults to the prop set on this component, but can be overridden on a per slide basis.
    initAutoPlay() {
      this.timer = new Timer(() => {
        if (
          this.isSliding ||
          this.isDragging ||
          (this.isHover && this.config.hoverPause) ||
          this.isFocus ||
          !this.$props.autoPlay
        ) {
          this.timer.set(this.getCurrentSlideTimeout());
          return;
        }
        if (
          this.currentSlide === this.slidesCount - 1 &&
          !this.config.infiniteScroll
        ) {
          this.slideTo(0);
          this.timer.set(this.getCurrentSlideTimeout());
          return;
        }
        this.slideNext();
        this.timer.set(this.getCurrentSlideTimeout());
      }, this.getCurrentSlideTimeout());
    },
    initDefaults() {
      this.breakpoints = this.settings.breakpoints;
      this.defaults = Object.assign({}, this.$props, this.settings);
      this.config = Object.assign({}, this.defaults);
    },
    // updating methods
    update() {
      if (this.breakpoints) {
        this.updateConfig();
      }
      this.updateWidth();
      this.updateTrim();
      this.$emit("updated", {
        containerWidth: this.containerWidth,
        containerHeight: this.containerHeight,
        slideWidth: this.slideWidth,
        slideHeight: this.slideHeight,
        settings: this.config,
      });
    },
    updateTrim() {
      const { trimWhiteSpace, itemsToShow, centerMode, infiniteScroll } =
        this.config;
      if (!trimWhiteSpace || infiniteScroll) {
        this.trimStart = 0;
        this.trimEnd = 1;
        return;
      }
      this.trimStart = centerMode ? Math.floor((itemsToShow - 1) / 2) : 0;
      this.trimEnd = centerMode ? Math.ceil(itemsToShow / 2) : itemsToShow;
    },
    updateWidth() {
      const rect = this.$el.getBoundingClientRect();
      this.containerWidth = rect.width;
      this.containerHeight = rect.height;
      if (this.config.vertical) {
        this.slideHeight = this.containerHeight / this.config.itemsToShow;
        return;
      }
      this.slideWidth = this.containerWidth / this.config.itemsToShow;
    },
    updateConfig() {
      const breakpoints = Object.keys(this.breakpoints).sort((a, b) => b - a);
      let matched;
      breakpoints.some((breakpoint) => {
        matched = window.matchMedia(`(min-width: ${breakpoint}px)`).matches;
        if (matched) {
          this.config = Object.assign(
            {},
            this.config,
            this.defaults,
            this.breakpoints[breakpoint]
          );
          return true;
        }
      });
      if (!matched) {
        this.config = Object.assign(this.config, this.defaults);
      }
    },
    restartTimer() {
      nextTick(() => {
        if (this.timer === null && this.$props.autoPlay) {
          this.initAutoPlay();
          return;
        }

        if (this.timer) {
          this.timer.stop();
          if (this.$props.autoPlay) {
            this.timer.set(this.getCurrentSlideTimeout());
            this.timer.start();
          }
        }
      });
    },
    restart() {
      nextTick(() => {
        this.update();
      });
    },
    // events handlers
    onDragStart(event) {
      this.isTouch = event.type === "touchstart";
      if (!this.isTouch && event.button !== 0) {
        return;
      }

      this.startPosition = { x: 0, y: 0 };
      this.endPosition = { x: 0, y: 0 };
      this.isDragging = true;
      this.startPosition.x = this.isTouch
        ? event.touches[0].clientX
        : event.clientX;
      this.startPosition.y = this.isTouch
        ? event.touches[0].clientY
        : event.clientY;

      document.addEventListener(
        this.isTouch ? "touchmove" : "mousemove",
        this.onDrag
      );
      document.addEventListener(
        this.isTouch ? "touchend" : "mouseup",
        this.onDragEnd
      );
    },
    isInvalidDirection(deltaX, deltaY) {
      if (!this.config.vertical) {
        return Math.abs(deltaX) <= Math.abs(deltaY);
      }

      if (this.config.vertical) {
        return Math.abs(deltaY) <= Math.abs(deltaX);
      }

      return false;
    },
    onDrag(event) {
      if (this.isSliding) {
        return;
      }

      this.endPosition.x = this.isTouch
        ? event.touches[0].clientX
        : event.clientX;
      this.endPosition.y = this.isTouch
        ? event.touches[0].clientY
        : event.clientY;
      const deltaX = this.endPosition.x - this.startPosition.x;
      const deltaY = this.endPosition.y - this.startPosition.y;
      // Maybe scrolling.
      if (this.isInvalidDirection(deltaX, deltaY)) {
        return;
      }

      this.delta.y = deltaY;
      this.delta.x = deltaX;

      if (!this.isTouch) {
        event.preventDefault();
      }
    },
    onDragEnd() {
      const tolerance = this.config.shortDrag ? 0.5 : 0.15;
      this.isDragging = false;

      if (this.config.vertical) {
        const draggedSlides = Math.round(
          Math.abs(this.delta.y / this.slideHeight) + tolerance
        );
        this.slideTo(
          this.currentSlide - Math.sign(this.delta.y) * draggedSlides
        );
      }
      if (!this.config.vertical) {
        const direction = (this.config.rtl ? -1 : 1) * Math.sign(this.delta.x);
        const draggedSlides = Math.round(
          Math.abs(this.delta.x / this.slideWidth) + tolerance
        );
        this.slideTo(this.currentSlide - direction * draggedSlides);
      }
      this.delta.x = 0;
      this.delta.y = 0;
      document.removeEventListener(
        this.isTouch ? "touchmove" : "mousemove",
        this.onDrag
      );
      document.removeEventListener(
        this.isTouch ? "touchend" : "mouseup",
        this.onDragEnd
      );
      this.restartTimer();
    },
    onTransitionend() {
      this.isSliding = false;
      this.$emit("afterSlide", {
        currentSlide: this.currentSlide,
      });
    },
    onKeypress(event) {
      const key = event.key;
      if (key.startsWith("Arrow")) {
        event.preventDefault();
      }
      if (this.config.vertical) {
        if (key === "ArrowUp") {
          this.slidePrev();
        }
        if (key === "ArrowDown") {
          this.slideNext();
        }
        return;
      }
      if (this.config.rtl) {
        if (key === "ArrowRight") {
          this.slidePrev();
        }
        if (key === "ArrowLeft") {
          this.slideNext();
        }
        return;
      }
      if (key === "ArrowRight") {
        this.slideNext();
      }
      if (key === "ArrowLeft") {
        this.slidePrev();
      }
    },
    onWheel(event) {
      event.preventDefault();
      if (now() - this.lastScrollTime < 200) {
        return;
      }
      // get wheel direction
      this.lastScrollTime = now();
      const value = event.wheelDelta || -event.deltaY;
      const delta = Math.sign(value);
      if (delta === -1) {
        this.slideNext();
      }
      if (delta === 1) {
        this.slidePrev();
      }
    },
    addGroupListeners() {
      if (!this.group) {
        return;
      }

      this._groupSlideHandler = (slideIndex) => {
        // set the isSource to false to prevent infinite emitting loop.
        this.slideTo(slideIndex, false);
      };
      EMITTER.$on(`slideGroup:${this.group}`, this._groupSlideHandler);
    },
    renderSlides() {
      const children = normalizeChildren(this);

      const childrenCount = children.length;
      let idx = 0;
      let slides = [];

      for (let i = 0; i < childrenCount; i++) {
        const child = children[i];
        if (!child || child.type.name !== "HooperSlide") {
          continue;
        }

        slides.push({
          ...child,
          key: idx,
          props: {
            ...(child.props || {}),
            isClone: false,
            index: idx++,
          },
        });
      }

      // update hooper's information of the slide count.
      this.slidesCount = slides.length;
      if (this.config.infiniteScroll) {
        slides = renderBufferSlides(slides);
      }

      return h(
        "ul",
        {
          class: {
            "hooper-track": true,
            "is-dragging": this.isDragging,
          },
          style: this.trackTransform + this.trackTransition,
          ref: "track",
          onTransitionend: this.onTransitionend,
          onMousedown: this.config.mouseDrag
            ? function (e) {
                this.onDragStart(e);
              }
            : undefined,
          onTouchstart: this.config.mouseDrag
            ? function (e) {
                this.onDragStart(e);
              }
            : undefined,
        },
        slides
      );
    },
    renderBody() {
      const slides = this.renderSlides();
      const addons =
        (this.$slots["hooper-addons"] && this.$slots["hooper-addons"]()) || [];
      const a11y = h(
        "div",
        {
          class: "hooper-liveregion hooper-sr-only",
          "aria-live": "polite",
          "aria-atomic": "true",
        },
        `Item ${this.currentSlide + 1} of ${this.slidesCount}`
      );

      const children = [...addons, a11y];

      return [
        h(
          "div",
          {
            class: "hooper-list",
            ref: "list",
          },
          slides
        ),
        children,
      ];
    },
  },
  created() {
    this.initDefaults();
  },
  mounted() {
    this.initEvents();
    this.addGroupListeners();
    nextTick(() => {
      this.update();
      this.slideTo(this.config.initialSlide || 0);

      nextTick(() => {
        this.update();
      });

      setTimeout(() => {
        this.$emit("loaded");
        this.initialized = true;
      }, this.transition);
    });
  },
  beforeDestroy() {
    window.removeEventListener("resize", this.update);
    if (this.group) {
      EMITTER.$off(`slideGroup:${this.group}`, this._groupSlideHandler);
    }

    if (this.timer) {
      this.timer.stop();
    }
  },
  render() {
    const body = this.renderBody();

    return h(
      "section",
      {
        tabindex: "0",
        class: {
          hooper: true,
          "is-vertical": this.config.vertical,
          "is-rtl": this.config.rtl,
        },
        onFocusin: () => (this.isFocus = true),
        onFocusout: () => (this.isFocus = false),
        onMouseover: () => (this.isHover = true),
        onMouseleave: () => (this.isHover = false),
      },
      body
    );
  },
};

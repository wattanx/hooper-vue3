export function getInRange(value: number, min: number, max: number) {
  return Math.max(Math.min(value, max), min);
}

export function now() {
  return Date.now();
}

export class Timer {
  private timer: number | null = null;
  private defaultTime: number;
  private callback: Function;

  constructor(callback: Function, defaultTime: number) {
    this.callback = callback;
    this.defaultTime = defaultTime;
    this.timer = this.create();
  }

  create() {
    return window.setTimeout(this.callback, this.defaultTime);
  }

  stop() {
    if (this.timer) {
      window.clearTimeout(this.timer);
      this.timer = null;
    }
  }

  start() {
    if (!this.timer) {
      this.timer = this.create();
    }
  }

  set(newTime: number) {
    const timeout = newTime || this.defaultTime;
    this.timer = window.setTimeout(this.callback, timeout);
  }
}

export function camelCaseToString(camelCase: string) {
  camelCase = camelCase.replace(/([A-Z]+)/g, " $1");
  return camelCase.charAt(0).toUpperCase() + camelCase.slice(1);
}

export function normalizeSlideIndex(index: number, slidesCount: number) {
  let realIndex;
  if (index < 0) {
    realIndex = (index + slidesCount) % slidesCount;
  } else {
    realIndex = index % slidesCount;
  }

  // Test for NaN
  if (realIndex !== realIndex) {
    return 0;
  }

  return realIndex;
}

// @ts-expect-error
export function cloneNode(h, vNode) {
  // use the context that the original vnode was created in.
  const children = vNode.children || vNode.text;
  const tag = vNode.children;

  return h(tag, vNode.data, children);
}

export const assign = Object.assign;

function signPoly(value: any) {
  if (value < 0) {
    return -1;
  }

  return value > 0 ? 1 : 0;
}

export const sign = Math.sign || signPoly;

export function normalizeChildren(context: any, slotProps = {}) {
  return context.$slots.default(slotProps) || [];
}

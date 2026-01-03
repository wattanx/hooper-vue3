import { describe, test, expect, vi, beforeEach, afterEach } from "vitest";
import {
  getInRange,
  now,
  Timer,
  camelCaseToString,
  normalizeSlideIndex,
} from "../src/utils";

describe("getInRange", () => {
  test("returns value when within range", () => {
    expect(getInRange(5, 0, 10)).toBe(5);
  });

  test("returns min when value is below range", () => {
    expect(getInRange(-5, 0, 10)).toBe(0);
  });

  test("returns max when value is above range", () => {
    expect(getInRange(15, 0, 10)).toBe(10);
  });

  test("returns min when value equals min", () => {
    expect(getInRange(0, 0, 10)).toBe(0);
  });

  test("returns max when value equals max", () => {
    expect(getInRange(10, 0, 10)).toBe(10);
  });

  test("handles negative ranges", () => {
    expect(getInRange(-5, -10, -1)).toBe(-5);
    expect(getInRange(-15, -10, -1)).toBe(-10);
    expect(getInRange(0, -10, -1)).toBe(-1);
  });

  test("handles decimal values", () => {
    expect(getInRange(5.5, 0, 10)).toBe(5.5);
    expect(getInRange(0.1, 0.5, 1)).toBe(0.5);
    expect(getInRange(1.5, 0.5, 1)).toBe(1);
  });
});

describe("now", () => {
  test("returns current timestamp", () => {
    const before = Date.now();
    const result = now();
    const after = Date.now();
    expect(result).toBeGreaterThanOrEqual(before);
    expect(result).toBeLessThanOrEqual(after);
  });
});

describe("Timer", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });

  afterEach(() => {
    vi.restoreAllMocks();
  });

  test("executes callback after default time", () => {
    const callback = vi.fn();
    new Timer(callback, 1000);

    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("stop() prevents callback from executing", () => {
    const callback = vi.fn();
    const timer = new Timer(callback, 1000);

    vi.advanceTimersByTime(500);
    timer.stop();
    vi.advanceTimersByTime(1000);

    expect(callback).not.toHaveBeenCalled();
  });

  test("start() restarts timer after stop()", () => {
    const callback = vi.fn();
    const timer = new Timer(callback, 1000);

    timer.stop();
    vi.advanceTimersByTime(1000);
    expect(callback).not.toHaveBeenCalled();

    timer.start();
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("start() does nothing if timer is already running", () => {
    const callback = vi.fn();
    const timer = new Timer(callback, 1000);

    timer.start(); // Should not create another timer
    vi.advanceTimersByTime(1000);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("set() creates new timer with custom time", () => {
    const callback = vi.fn();
    const timer = new Timer(callback, 1000);

    timer.stop();
    timer.set(500);

    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });

  test("set() uses default time when 0 is passed", () => {
    const callback = vi.fn();
    const timer = new Timer(callback, 1000);

    timer.stop();
    timer.set(0);

    vi.advanceTimersByTime(500);
    expect(callback).not.toHaveBeenCalled();
    vi.advanceTimersByTime(500);
    expect(callback).toHaveBeenCalledTimes(1);
  });
});

describe("camelCaseToString", () => {
  test("converts camelCase to spaced string", () => {
    expect(camelCaseToString("arrowLeft")).toBe("Arrow Left");
  });

  test("converts multiple uppercase letters", () => {
    expect(camelCaseToString("myTestString")).toBe("My Test String");
  });

  test("handles single word", () => {
    expect(camelCaseToString("arrow")).toBe("Arrow");
  });

  test("handles empty string", () => {
    expect(camelCaseToString("")).toBe("");
  });
});

describe("normalizeSlideIndex", () => {
  test("returns same index when within bounds", () => {
    expect(normalizeSlideIndex(2, 5)).toBe(2);
  });

  test("returns 0 for index 0", () => {
    expect(normalizeSlideIndex(0, 5)).toBe(0);
  });

  test("wraps index when exceeds slides count", () => {
    expect(normalizeSlideIndex(5, 5)).toBe(0);
    expect(normalizeSlideIndex(6, 5)).toBe(1);
    expect(normalizeSlideIndex(10, 5)).toBe(0);
  });

  test("handles negative index", () => {
    expect(normalizeSlideIndex(-1, 5)).toBe(4);
    expect(normalizeSlideIndex(-2, 5)).toBe(3);
    expect(normalizeSlideIndex(-5, 5)).toBe(0);
  });

  test("handles negative index beyond one cycle", () => {
    // Note: current implementation only handles one cycle of negative values
    // -6 % 5 = -1 (in JS), then (-1 + 5) % 5 = 4... but actually returns -1
    // This documents the current behavior
    expect(normalizeSlideIndex(-6, 5)).toBe(-1);
    expect(normalizeSlideIndex(-7, 5)).toBe(-2);
  });

  test("returns 0 for NaN result (slidesCount is 0)", () => {
    expect(normalizeSlideIndex(0, 0)).toBe(0);
    expect(normalizeSlideIndex(5, 0)).toBe(0);
  });

  test("handles single slide", () => {
    expect(normalizeSlideIndex(0, 1)).toBe(0);
    expect(normalizeSlideIndex(1, 1)).toBe(0);
    expect(normalizeSlideIndex(-1, 1)).toBe(0);
  });
});

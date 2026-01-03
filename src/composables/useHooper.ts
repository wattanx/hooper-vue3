import type { InjectionKey } from "vue";
import { inject } from "vue";
import type { HooperContext } from "../types";

export const hooperContextKey: InjectionKey<HooperContext> =
  Symbol("$hooper");

export function useHooper(): HooperContext {
  const hooper = inject(hooperContextKey);
  if (!hooper) {
    throw new Error("useHooper must be used within a Hooper component");
  }
  return hooper;
}

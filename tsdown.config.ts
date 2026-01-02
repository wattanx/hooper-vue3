import { defineConfig } from "tsdown";

export default defineConfig({
  entry: ["src/index.ts"],
  external: ["vue"],
  dts: true,
});

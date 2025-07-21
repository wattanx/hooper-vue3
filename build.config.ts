import { defineBuildConfig } from "unbuild";

export default defineBuildConfig({
  entries: [{ input: 'src/index.ts' }],
  externals: ["vue"],
  declaration: true,
});

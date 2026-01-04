import { defineConfig } from "vitepress";

// https://vitepress.dev/reference/site-config
export default defineConfig({
  title: "@wattanx/hooper-vue3",
  description: "A customizable accessible carousel slider optimized for Vue 3",
  themeConfig: {
    // https://vitepress.dev/reference/default-theme-config
    nav: [
      { text: "Home", link: "/" },
      { text: "Getting Started", link: "/getting-started" },
      { text: "API", link: "/api" },
      { text: "Examples", link: "/examples" },
    ],

    sidebar: [
      {
        text: "Guide",
        items: [
          { text: "Getting Started", link: "/getting-started" },
          { text: "API Reference", link: "/api" },
          { text: "Examples", link: "/examples" },
        ],
      },
    ],

    socialLinks: [
      { icon: "github", link: "https://github.com/wattanx/hooper-vue3" },
    ],
  },
});

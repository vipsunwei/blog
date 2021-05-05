const themeConfig = require("./config/theme/");

module.exports = {
  title: "Uncle Wei",
  description: "Enjoy when you can, and endure when you must.",
  dest: "dist",
  base: "/",
  head: [
    ["link", { rel: "icon", href: "/favicon.ico" }],
    [
      "meta",
      {
        name: "viewport",
        content: "width=device-width,initial-scale=1,user-scalable=no",
      },
    ],
  ],
  theme: "reco",
  themeConfig,
  markdown: {
    lineNumbers: true,
  },
  plugins: ["@vuepress/medium-zoom", "flowchart"],
};

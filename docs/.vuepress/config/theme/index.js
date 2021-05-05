const themeReco = require("./themeReco.js");
const nav = require("../nav/");
const sidebar = require("../sidebar/");

module.exports = Object.assign({}, themeReco, {
  nav,
  sidebar,
  // logo: "/head.png",
  authorAvatar: "/head.jpg",
  // 搜索设置
  search: true,
  searchMaxSuggestions: 10,
  // 自动形成侧边导航
  sidebar: "auto",
  // 备案
  record: "",
  recordLink: "",
  cyberSecurityRecord: "鲁公网安备 37010302000917号",
  cyberSecurityLink:
    "http://www.beian.gov.cn/portal/registerSystemInfo?recordcode=37010302000917",
  // 项目开始时间，只填写年份
  startYear: "2020",
});

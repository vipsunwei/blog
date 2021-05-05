module.exports = {
  type: "blog",
  // 博客设置
  blogConfig: {
    category: {
      location: 2, // 在导航栏菜单中所占的位置，默认2
      text: "Category", // 默认 “分类”
    },
    tag: {
      location: 3, // 在导航栏菜单中所占的位置，默认3
      text: "Tag", // 默认 “标签”
    },
    socialLinks: [
      // 信息栏展示社交信息
      { icon: "reco-github", link: "https://github.com/vipsunwei" },
      { icon: "reco-zhihu", link: "https://www.zhihu.com/people/vipsunwei" },
    ],
  },
  // 最后更新时间
  lastUpdated: "Last Updated", // string | boolean
  // 作者
  author: "vipsunwei",
  // 备案号
  record: "鲁公网安备 37010302000917号",
  // 项目开始时间
  startYear: "2020",
};

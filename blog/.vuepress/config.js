module.exports = {
  title: 'SUNWEI',
  description: "I'm a fan of Zhao Liying",
  theme: 'ting', // OR shortcut: @vuepress/blog
  base: '/blog/',
  themeConfig: {
    author: 'sunwei',
    headImg: '/blog/img/zhaoliying-head.jpg', // 选填：头像
    // 导航栏
    nav: [
      { text: 'HOME', link: '/' },
      { text: 'TAGS', link: '/catalog' },
      // { text: '项目列表', link: '/config/about' },
      { text: 'Github', type: 'url', link: 'https://github.com/vipsunwei' }
    ],
    catalogUrl: '/catalog', //必填 目录路径
    lastUpdated: 'Last Updated', //必填：文章显示最新修改时间
    smoothScroll: true, //选填
    // 选填/live2d模型路径
    // live2dModel: '/live2d/model/poi/poi.model.json',
    pageNum: 10, //选填：目录每页显示条数
    // gitalk: {
    //   //选填：gitalk留言设置
    //   clientID: '5b8613cfe15e02db85b7',
    //   clientSecret: 'd4129094c33b8da73e873470fb89aea53dfaf396',
    //   githubName: 'Chenyating'
    // },
    /**
     * Ref: https://vuepress-theme-blog.ulivz.com/#modifyblogpluginoptions
     */
    // modifyBlogPluginOptions(blogPluginOptions) {
    //   return blogPluginOptions
    // },
    footer: '单身狗  求带走'
  }
}

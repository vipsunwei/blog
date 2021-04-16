/**
 * 定义多个服务器信息 及 导出服务器列表
 */
const SERVER_LIST = {
  blog: {
    // 博客服务器
    id: 0,
    name: "vipsunwei.com/blog/",
    domain: "vipsunwei.com", // 域名
    host: "62.234.127.232", // ip
    port: 22, // 端口
    username: "root", // 登录服务器的账号
    password: "2r_xUm)Yyq9}", // 登录服务器的账号
    path: "/usr/share/nginx/html/vipsunwei/", // 发布至静态服务器的项目路径
    relativePath: "./blog/.vuepress/dist",
  },
  // 'webapps': { // http://172.16.100.10测试环境
  //   id: 1,
  //   name: '172.16.100.10',
  //   domain: '172.16.100.10', // 域名
  //   host: '172.16.100.10', // ip
  //   port: 22, // 端口
  //   username: 'hdy', // 登录服务器的账号
  //   password: 'hdy@demo', // 登录服务器的账号
  //   path: '/opt/project/webapps/', // 发布至静态服务器的项目路径
  //   relativePath: './dist'
  // }
};

module.exports = SERVER_LIST;

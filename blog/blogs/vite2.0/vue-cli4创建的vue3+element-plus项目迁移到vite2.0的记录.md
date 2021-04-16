# vue-cli4 创建的 vue3+element-plus 项目迁移到 vite2.0 的记录

## 先创建一个 vite 项目

> 注意：vite 需要 node.js 版本 >= 12.0.0

使用 NPM:

```shell
npm init @vitejs/app
```

使用 Yarn:

```shell
yarn create @vitejs/app
```

然后按照提示操作即可！

## 安装项目依赖

### 安装 dependencies

把 `vue-cli` 创建的项目 `package.json` 文件中的`dependencies`复制到 `vite` 新创建的项目的 `package.json` 文件中

变成了这样：

```json
{
  "dependencies": {
    "axios": "^0.21.1",
    "element-plus": "^1.0.2-beta.40",
    "lodash-es": "^4.17.21",
    "mitt": "^2.1.0",
    "vue": "^3.0.11",
    "vue-router": "^4.0.6",
    "vuex": "^4.0.0"
  }
}
```

打开终端执行安装命令

使用 `Yarn`

```sh
yarn
```

使用 `NPM`

```shell
npm install
```

启动开发服务器试试

```bash
yarn dev
或者
npm run dev
```

### 安装 devDependencies

报错提示：找不到 `sass`，需要安装`sass`包

```bash
yarn add sass --dev
或者
npm i sass -D
```

装完就好了，啥也没配置

```json
{
  "devDependencies": {
    "@vitejs/plugin-vue": "^1.2.1",
    "@vue/compiler-sfc": "^3.0.5",
    "sass": "^1.32.8",
    "vite": "^2.1.5"
  }
}
```

按照报错信息，缺啥就安装啥，不要一股脑的把 `webpack` 之前依赖的那些开发工具包全都拿过来安装。

### 使用 CDN 引入非 ESM 的依赖包

如果发现有的依赖引入后报错，那么可能是这个依赖中有不符合 `ESM` 的地方，我的项目里有用到一个工具 `vertx3-eventbus-client` 这个包就不是 `ES Module` 的，报错说 `global` 未定义，而我的代码中没有写什么 `global`，看调用栈是这个包引起的，没找到其他解决办法，最后选择了直接在`index.html`中以 `CDN` 的方式引入这个包

```html
<script src="https://cdn.jsdelivr.net/npm/sockjs-client@1/dist/sockjs.min.js"></script>
<script src="https://cdn.jsdelivr.net/npm/@vertx/eventbus-bridge-client.js@1/vertx-eventbus.min.js"></script>
```

搜索 `CDN` 地址的时候发现 `vertx3-eventbus-client` 这个包已经被弃用了，官方推荐更换到`@vertx/eventbus-bridge-client`，所以就是上边引入的新地址。

接下来就是对照终端中的报错和浏览器控制台中的报错，解决这些报错问题。

## 解决报错

### 路径别名问题：

原项目中有些地方用了`@`作为`src` 的别名，我们打开 `vite.config.js` 配置文件配置一下：

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  // 增加路径别名
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "src"),
    },
  },
});
```

### 环境变量问题：

原项目中用了`.env.development` 和`.env.production` 来定义的，然后在封装接口 api 的地方 `process.env.VUE_APP_HOST` 这样来使用的，`vite` 项目中会报错 `process` 不能用了，官网说的 `import.meta.env` 这里边有内建变量，也有你定义的额外环境变量，自己打印出来看看就知道怎么用了，

`.env` 文件
`vite` 使用 `dotenv` 在你的项目根目录下从以下文件加载额外的环境变量：

```bash
.env              # 所有情况下都会加载
.env.local        # 所有情况下都会加载，但会被 git 忽略
.env.[mode]       # 只在置顶模式下加载
.env.[mode].local # 只在指定模式下加载， 但会被 git 忽略
```

加载的环境变量也会通过 `import.meta.env` 暴露给客户端源码。

为了防止意外地将一些环境变量泄漏到客户端，只有以 `VITE_` 为前缀的变量才会暴露给经过 `vite` 处理的代码。例如下面这个文件中：

```bash
DB_PASSWORD=foobar
VITE_SOME_KEY=123
```

只有 `VITE_SOME_KEY` 会被暴露为 `import.meta.env.VITE_SOME_KEY` 提供给客户端源码，而 `DB_PASSWORD` 则不会。

> 注意：固定的前缀 VITE\_ 才会被暴露
> 安全警告

> .env.\*.local 文件应是本地的，可以包含敏感变量。你应该加上 .local 到你的 .gitignore 以避免他们被检出到 git。

> 由于暴露在 Vite 源码中的任何变量都将最终出现在客户端包中，VITE\_\* 变量应该不包含任何敏感信息。

将原来 `VUE_APP_` 开头的全都改成 `VITE_` 就行了。

我没有把`.env` 文件复制过来，我直接在 `vite.config.js` 配置文件中定义了一下

```json
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
import { resolve } from "path";

export default defineConfig({
  plugins: [vue()],
  // 增加路径别名
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "src"),
    },
  },
  // 增加定义常量
  define: {
    HOST: JSON.stringify("http://api.test.com:8000"),
    EVENTBUS_HOST: JSON.stringify("http://api.test.com:8001")
  }
})
```

一般修改配置文件后，最好重新启动一下项目。

这种定义方式在项目中使用的话就不需要 `import.meta.env` 写这么长一串了，直接写 `HOST` 就行了。

```js
import axios from "axios";
// const host = process.env.VUE_APP_HOST;
const host = HOST;
const request = axios.create({
  baseURL: host,
  timeout: 10 * 1000,
});

export default request;
```

### 批量导入

我项目中有一些 `MP3` 文件需要批量导入，做成 `object` 的数据形式使用，原来用的 `require.context` 这里不支持 `require` 了

```js
// index.js
// 我这个入口文件和MP3文件在同一个目录中，所以直接从当前目录导入MP3结尾的文件，不会匹配到入口index.js文件

// 原项目写法
// const files = require.context(".", false, /.mp3$/);
// const steps = files.keys().reduce((obj, path) => {
//   const name = path.replace(/^\.\/步序改变维(.*)\.mp3/, "$1");
//   obj[name] = files(path);
//   return obj;
// }, {});

// vite项目写法
const files = import.meta.globEager("./*.mp3");

const steps = Object.keys(files).reduce((obj, item) => {
  // 匹配出一段自己想要的字符串作为对象的属性名，可以是中文的，没毛病
  // 属性值就是这个MP3文件的url了
  const key = item.replace(/^\.\/步序改变维(.*)\.mp3$/, "$1");
  obj[key] = files[item].default;
  return obj;
}, {});

export default steps;
```

### 解决 require 报错

封装接口的 `api` 文件中，接口方法里使用了 `require` 导入假数据文件，两种方式静态导入、动态导入下边分别给出示例：

```js
// 假数据 tkyinfo.js
const data = {
  key: "value",
  // ...
};

export default { data, status: 200 };
```

导入需要的假数据

```js
// 封装api
import { getToken } from "../utils/auth.js";

// 原项目require的写法
// export const getTkyInfoByFQTime = (st, et) => {
//   const token = getToken();
//   const url = `/api/history/getTkyInfo`;
//   if (!IS_MOCK) {
//     return request.get(url, { params: { token, startTime: st, endTime: et } });
//   }
//   return Promise.resolve(require("../data/tkyinfo.js").default.data);
// };

// 静态导入方式
import tkyinfo from "../data/tkyinfo.js";
export const getTkyInfoByFQTime = (st, et) => {
  const token = getToken();
  const url = `/api/history/getTkyInfo`;
  if (!IS_MOCK) {
    return request.get(url, { params: { token, startTime: st, endTime: et } });
  }
  return Promise.resolve(tkyinfo.data);
};

// 动态导入方式
export const getTkyInfoByFQTime = async (st, et) => {
  const token = getToken();
  const url = `/api/history/getTkyInfo`;
  if (!IS_MOCK) {
    return request.get(url, { params: { token, startTime: st, endTime: et } });
  }
  const tkyinfo = await import("../data/tkyinfo.js");
  return Promise.resolve(tkyinfo.default.data);
};
```

不带 `default` 的模块导出方式

```js
// 假数据 tkyidarr.js
export const tkyIdArr = [
  { id: "a3ne8f3" },
  // ...
];
```

导入不带 `default` 的模块中数据

```js
// 封装api
import { getToken } from "../utils/auth.js";

// 原项目写法
// export function getTkyInfoByJCTime(st, et) {
//   const token = getToken();
//   const url = "/api/history/getTkyInfoByJCTime";
//   if (!IS_MOCK) {
//     return request.get(url, { params: { token, startTime: st, endTime: et } });
//   }
//   return Promise.resolve(require("../data/tkyidarr.js").tkyidarr);
// }

// 静态导入方式
import { tkyIdArr } from "tkyidarr.js";
export function getTkyInfoByJCTime(st, et) {
  const token = getToken();
  const url = "/api/history/getTkyInfoByJCTime";
  if (!IS_MOCK) {
    return request.get(url, { params: { token, startTime: st, endTime: et } });
  }
  return Promise.resolve(tkyIdArr);
}

// 动态导入方式
export async function getTkyInfoByJCTime(st, et) {
  const token = getToken();
  const url = `/api/history/getTkyInfoByJCTime`;
  if (!IS_MOCK) {
    return request.get(url, { params: { token, startTime: st, endTime: et } });
  }
  const result = await import("../data/tkyidarr.js");
  return Promise.resolve(result.tkyIdArr);
}
```

## 使用按需引入插件导入 element-plus

### 安装插件

```bash
yarn add vite-plugin-style-import --dev
或者
npm i vite-plugin-style-import -D
```

```json
{
  "devDependencies": {
    "@vitejs/plugin-vue": "^1.2.1",
    "@vue/compiler-sfc": "^3.0.5",
    "sass": "^1.32.8",
    "vite": "^2.1.5",
    "vite-plugin-style-import": "^0.9.2"
  }
}
```

### 修改 vite.config.js

```js
import { defineConfig } from "vite";
import vue from "@vitejs/plugin-vue";
// 导入插件
import styleImport from "vite-plugin-style-import";
import { resolve } from "path";

// https://vitejs.dev/config/
export default defineConfig({
  // 在plugins中增加这个插件的配置, 如果你想使用sass，可以去element-plus官方文档快速上手中，往下翻到vite部分查看具体配置
  plugins: [
    vue(),
    styleImport({
      libs: [
        {
          libraryName: "element-plus",
          esModule: true,
          ensureStyleFile: true,
          resolveStyle: (name) => {
            return `element-plus/lib/theme-chalk/${name}.css`;
          },
          resolveComponent: (name) => {
            return `element-plus/lib/${name}`;
          },
        },
      ],
    }),
  ],
  resolve: {
    alias: {
      "@": resolve(process.cwd(), "src"),
    },
  },
  define: {
    HOST: JSON.stringify("http://api.test.com:8000"),
    EVENTBUS_HOST: JSON.stringify("http://api.test.com:8001"),
  },
});
```

### 注册你要使用的 element-plus 组件

#### 注册成全局组件

```js
// element-ui.js
import {
  ElContainer,
  ElAside,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElTable,
  ElTableColumn,
  ElDatePicker,
  // ...一些你用到的组件
} from "element-plus";

const components = [
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElTable,
  ElTableColumn,
  ElDatePicker,
  // ...一些你用到的组件
];

const plugins = [ElLoading];

function install(app) {
  components.map((component) => {
    app.component(component.name, component);
  });
  plugins.map((plugin) => {
    app.use(plugin);
  });
}

export default install;
```

在 `main.js` 中导入 `element-ui.js`

```js
import { createApp } from "vue";

import App from "./App.vue";

import ElementPlus from "./element-ui.js";

const app = createApp(App);

app.use(ElementPlus);
// 也可以这么用
// ElementPlus(app);

app.mount("#app");
```

发现 `icon` 图标不显示了，这时候就需要去 `element-ui.js` 中增加引入`ElIcon`组件了

```js
// element-ui.js
import {
  // 需要导入ElIcon组件
  ElIcon,
  ElContainer,
  ElAside,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElTable,
  ElTableColumn,
  ElDatePicker,
  // ...一些你用到的组件
} from "element-plus";

const components = [
  // 需要导入ElIcon组件
  ElIcon,
  ElContainer,
  ElHeader,
  ElAside,
  ElMain,
  ElMenu,
  ElMenuItem,
  ElTable,
  ElTableColumn,
  ElDatePicker,
  // ...一些你用到的组件
];

const plugins = [ElLoading];

function install(app) {
  components.map((component) => {
    app.component(component.name, component);
  });
  plugins.map((plugin) => {
    app.use(plugin);
  });
}

export default install;
```

#### 作为局部组件使用

```js
import { defineComponent } from "vue";
import {
  ElContainer,
  ElHearder,
  ElMain,
  ElMenu,
  // ... 用到啥就引入啥
} from "element-plus";

export default defineComponent({
  name: "Hello",
  components: {
    ElContainer,
    ElHearder,
    ElMain,
    ElMenu,
    // ... 用到啥就注册啥
  },
});
```

### 国际化

设置 `element-plus` 组件语言为中文，设置全局 `size` 和 `zIndex`

```js
// main.js

import lang from "element-plus/lib/locale/lang/zh-cn";
import { locale } from "element-plus";
import "dayjs/locale/zh-cn";

// ... 省略一些代码

// 设置语言
locale(lang);
app.use(ElementPlus);
// 按需引入时，设置全局size和z-index的方法，zIndex默认：2000
app.config.globalProperties.$ELEMENT = { size: "", zIndex: 3000 };

// ... 省略一些代码
```

## 打包的一些配置

### 将打包后的文件按类型输出到不同的文件夹

默认是平铺在 `assets` 文件夹中的，我们可以修改`vite.config.js`把 `css`、`js` 分别输出到对应的文件夹中

```js
// vite.config.js
import { defineConfig } from "vite";
module.exports = defineConfig({
  // ... 其它配置项

  build: {
    assetsDir: "assets", // 字体、图片、音频等静态资源默认就是输出到assets中的，此项可不写
    rollupOptions: {
      output: {
        assetFileNames: "css/[name].[hash].css",
        chunkFileNames: "js/[name].[hash].js",
        entryFileNames: "js/[name].[hash].js",
      },
    },
  },
});
```

### 将第三方依赖包拆分到独立的 js 文件

手动将 `node_modules` 中的第三方包拆分到独立的 `js` 文件，避免全都打到 `vendor.js` 中，导致文件 `size` 过大，会在终端报性能会有影响的警告

```js
// vite.config.js
import { defineConfig } from "vite";
module.exports = defineConfig({
  // ... 其它配置项

  build: {
    assetsDir: "assets", // 字体、图片、音频等静态资源默认就是输出到assets中的，此项可不写
    rollupOptions: {
      output: {
        assetFileNames: "css/[name].[hash].css",
        chunkFileNames: "js/[name].[hash].js",
        entryFileNames: "js/[name].[hash].js",
        // 此处手动设置，将项目依赖的第三方包都拆分到独立的js文件，避免vendor包size过大，（不喜欢看到终端的警告）
        manualChunks: {
          "lodash-es": ["lodash-es"],
          // 试了一下传字符串也是可以的
          // "lodash-es": "lodash-es",
          "element-plus": ["element-plus"],
          axios: ["axios"],
          vuex: ["vuex"],
          "vue-router": ["vue-router"],
          mitt: ["mitt"],
          vue: ["vue"],
        },
      },
    },
  },
});
```

### 开发环境跨域代理配置

```js
// vite.config.js
import { defineConfig } from "vite";
module.exports = defineConfig({
  // ... 其它配置项

  server: {
    proxy: {
      "^/api/.*": {
        target: "https://...",
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api/, ""),
      },
    },
  },
});
```

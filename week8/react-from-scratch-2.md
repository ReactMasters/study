참고 : [프로젝트 레포](https://github.com/JeGwan/react-from-scratch)

### module과 require

바벨은 코드 문법을 컴파일 해주는 도구였습니다. dependency 및 번들링은 생각하지 않습니다. 오로지 문법이나 JSX같은 자바스크립트 표현을 바꿔줄 뿐이죠.

`require`는 CJS(CommonJS) 모듈입니다. 브라우저에서 동작하려면 모듈로더가 필요합니다.

또한 그로부터 불러오는 `react`, `react-dom`같은 패키지들이 브라우저 런타임엔 없습니다.

때문에 이렇게 불러오는 파일을 브라우저에서 가져오는 파일로 만들어주어야 하며, 해당 패키지들의 문법 또한 브라우저가 인식하고 동작할 수 있게 바꾸어야겠죠.

이제 `webpack`이 필요한 때입니다.

## 3. Webpack 필요한 이유 및 설치와 설정

웹팩은 `bundler` 이자 `task runner` 입니다.

- `bundler` : 우리가 module기반으로 작성한 코드들을 production(브라우저) 환경에 배포할 수 있게 만들어주는 도구입니다.
- `task runner` : 말 그대로 일련의 작업들을 실행시켜주는 도구입니다.

### Webpack의 Bundling

하나의 Entry 파일부터 시작해 해당 프로젝트의 dependency graph를 그립니다. 그 뒤 해당 그래프에 따라 필요한 파일들을 번들링합니다.

### Webpack의 Loader

- Webpack은 기본적으로 `JavaScript`, `JSON` 파일을 번들링할 수 있습니다.
- 그 외의 확장자, 타입의 파일들을 모듈로 인식하고 적절한 전략으로 번들링 하기 위해 `loader`가 필요합니다.

#### Loader의 사용법

1. `config.module.rules`에 배열 형태로 `rule`을 전달합니다.
2. 각 `rule`은 다음과 같은 설정항목이 있습니다.

- `test` : 적용할 파일을 지정합니다. 정규표현식을 지원하기 때문에 주로 정규 표현식 형태로 많이 씁니다.
- `use` : `test`에 해당하는 파일에 어떤 로더를 쓸 것인지 배열로 씁니다. 로더의 적용 순서는 배열의 가장 마지막 부터 차례대로 적용됩니다.

예를 들어 `.scss` 파일을 코드에서는 모듈처럼 가져다 쓰고, 빌드시 파일에 포함하기 위해 다음과 같은 로더를 적용했습니다.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.scss$/,
        use: [
          // style-loader
          { loader: "style-loader" },
          // css-loader
          {
            loader: "css-loader",
            options: {
              modules: true,
            },
          },
          // sass-loader
          { loader: "sass-loader" },
        ],
      },
    ],
  },
};
```

적용 순서 및 설명

1. `sass-loader`: `.scss`로 끝나는 파일을 만나면 `.css`형식으로 바꿔주는 역할을 합니다.
2. `css-loader`: `.css`로 끝나는 파일을 만나면 `import`한 `path` 또는 `url`을 웹팩의 require로 바꿔줍니다. 오로지 모듈로 인식하게 할뿐, css를 적용하진 않습니다.
3. `style-loader` : `.css`로 불러와지는 모듈을 실제로 html 에 주입(\*Inject CSS into the DOM)시켜주는 역할입니다.

이제 우리 프로젝트에서 `webpack`을 설치하고 번들링할 수 있게 설정해줍시다.

### 설치

일단 `webpack`, `webpack-cli`만 설치해보아요.

```bash
yarn add -D webpack webpack-cli
```

- webpack을 production(브라우저)에서 쓰진않습니다. 우리가 만든 앱을 브라우저에서 동작하도록 번들링 해주는 도구이기에 `-D` 플래그를 이용, `devDependencies`로 설치했습니다.
- `webpack` : `@babel/core` 처럼 웹팩의 기능적인 소스들이 들어있는 패키지입니다.
- `webpack-cli` : `@babel/cli` 처럼 웹팩을 CLI에서 실행할 수 있게 해주는 패키지입니다.

그 뒤 그냥 `npx webpack` 이라고 쳐봅시다.

```
assets by status 331 bytes [cached] 1 asset
./src/index.js 478 bytes [built] [code generated] [1 error]

WARNING in configuration
The 'mode' option has not been set, webpack will fallback to 'production' for this value.
Set 'mode' option to 'development' or 'production' to enable defaults for each environment.
You can also set it to 'none' to disable any default behavior. Learn more: https://webpack.js.org/configuration/mode/

ERROR in ./src/index.js 7:2
Module parse failed: Unexpected token (7:2)
You may need an appropriate loader to handle this file type, currently no loaders are configured to process this file. See https://webpack.js.org/concepts#loaders
|
| ReactDOM.render(
>   <React.StrictMode>
|     <App />
|   </React.StrictMode>,
```

에러가 뜹니다!

1. mode 를 명시해주어야 합니다. (기본값으로 `production`을 쓰긴합니다)
2. `JSX` 문법을 만나자 `Unexpected token` 에러를 냅니다.

설정값을 더 넣어줘야 합니다!

기본적으로 아무 설정없이 실행하면 `webpack`은

- `entry`로 `./src/index.js`를 삼습니다.
- 번들을 내뿜을 `output`으로 `./dist/main.js`로 삼습니다.

더 나아가기전에 js로만 구성된 파일들 가지고 실험을 해봅시다.

### webpack 테스트

웹팩이 잘동작하는지 테스트하기 위해서 다음과 같은 사항들을 볼겁니다.

1. depth가 다른 여러모듈을 불러올 때 번들링을 어떻게 하는지 살펴본다
2. `node_modules`를 통해 불러온 모듈을 어떻게 처리하는지 살펴본다.

그러기 위해서 다음과 같이 테스트를 준비했습니다.

```js
// 기존 ./src/test.js => ./test/index.js로 변경
// dayjs 설치

// 구조 :
// test
// ├── d1
// │   └── m2.js
// ├── index.js
// └── m1.js

// ./test/index.js
import dayjs from "dayjs";
import { subs, sum } from "./m1";

console.log(subs(1, 2), sum(3, 2), dayjs().format("YYYY-MM-DD"));

// ./test/m1.js
export { sum } from "./d1/m2";
export const subs = (a, b) => a - b;

// ./test/d1/m2.js
export const sum = (a, b) => a + b;
```

이제 다음의 명령어로 번들링해봅시다.

```bash
npx webpack --entry ./test/index.js --mode=production
```

그럼 다음과 같이 생성됩니다.

```
dist
 └── main.js
```

그리고 해당 스크립트를 가져오는 test.html을 만들어 실행해보니 아주 잘 실행이됩니다.
그리고 우리가 `./test/index.js`에서 만든 코드가 다음과 같이 바뀌었습니다.

```js
console.log(subs(1, 2), sum(3, 2), dayjs().format("YYYY-MM-DD"));
// 👇
console.log(-1, 5, n()().format("YYYY-MM-DD"));
```

다음과 같은 결론을 얻을 수 있었습니다.

1. depth가 다른 여러모듈을 불러올 때 번들링을 어떻게 하는지 :
   기본적으로 하나의 파일로 bundling 합니다.
2. `node_modules`를 통해 불러온 모듈을 어떻게 처리하는지 :
   역시 하나의 파일에 포함되게 됩니다.

그래서 코드 스플리팅할 필요성이 생깁니다.

이제 진짜 설정하러 갑시다.

### Webpack 초기 설정

일단 설정 파일부터 만들어봅시다.
`webpack.config.js`를 루트에 생성해주세요.

```js
// ./webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const path = require("path");
const isProd = process.env.NODE_ENV === "production";
module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? undefined : "eval-cheap-module-source-map",
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
    ],
  },
  output: {
    clean: true,
    filename: (pathData) => {
      return pathData.chunk.name === "main"
        ? "bundles/index.js"
        : "bundles/chunks/[contenthash].js";
    },
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  plugins: [new HtmlWebpackPlugin({ template: "./public/index.html" })],
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
```

#### 설명

- `mode` :

  - `production` : module과 chunk에 대해 FlagDependencyUsagePlugin, FlagIncludedChunksPlugin, ModuleConcatenationPlugin, NoEmitOnErrorsPlugin, TerserPlugin 등 플로그인을 적용하여 minify, uglify 된 뭉개진(mangled) 코드로 만들어줍니다.
  - `development` : module과 chunk를 뭉개지 않습니다. 우리가 읽을 수 있게 해줍니다.

- `devtool` :webpack이 소스 코드를 번들로 묶을 때, 오류와 경고의 원래 위치를 추적하기 어렵기 때문에 컴파일된 코드를 원래 소스로 매핑하는 소스맵을 제공하는 옵션입니다. 개발 모드에서만 사용합시다!
- `resolve.extensions` : 확장자를 생략한 import문을 발견 했을 때(e.g. `import App from './App'`) 어느 확장자로 이어서 찾을지 명시해줍니다. 즉 해당 배열안에 넣는 확장자로 된 파일들은 import 시 확장자를 생략하게 할 수도 있습니다. 위의 경우 확장자가 없는 가져오기를 발견했을 때 아래처럼 동작합니다.
  1. `./App.js` 를 찾습니다.
  2. 없으면 `./App.jsx`를 찾습니다.
  3. 없으면 `resolve 할수가 없어 자식아 😡` 라고 빌드시 에러가 납니다.
- `rule.loader`, `rule.use` : 하나의 로더만 쓸 땐 loader를 씁니다. use는 여러 로더를 순서적으로 적용하고 싶을 때 배열로 받아 쓸 수 있습니다.
- `output`

  - `clean`: true일 경우 빌드 시마다 그전 빌드를 지워줍니다.
  - `filename` : 번들 파일의 이름을 지어줍니다. string이거나 function을 쓸 수 있습니다. 또 파일 이름뿐 아니라 output path아래로 경로를 정해줄 수도 있습니다. 저는 여기서 모두 bundles아래로, main 만 index.js 로, 나머지는 chunks로 묶었습니다.
  - `path`: 번들링한 파일들이 내뿜어질 디렉토리를 지정합니다.
  - `publicPath` : 번들링한 파일을 어떤 주소로 접근가능하게 할지 설정합니다. 상대 경로로 쓸 수도 있고, 번들을 cdn에 올린다면, cdn 주소로도 쓸 수 있습니다.

- `HtmlWebpackPlugin` : HtmlWebpackPlugin은 webpack 번들을 제공하는 HTML 파일 생성을 도와줍니다. 우리가 `bundle.js`처럼 고정적인 이름의 번들 하나만 쓴다면 `index.html`에서 해당하는 번들만 잡아주면 되지만, 컴파일 시마다 변경되는 hash filename을 가진 하나 이상의 번들이 생성된다면, 자동으로 html에서 번들을 불러오게끔 해주는 편이 편합니다. 이것을 도와주는 플러그인입니다.

#### optimization 옵션 [참고](https://webpack.js.org/plugins/split-chunks-plugin/#defaults)

중요한 개념이라 따로 뺐습니다.
웹팩은 기본적으로 chunk를 다음과 같은 조건으로 분할합니다.

1. 공유될 수 있는 새로운 청크나, node_modules 폴더 안의 모듈
2. 새로 생기는 청크는 20kb 이상이어야 합니다.
3. (on demand) 병렬적으로 청크 요청이 30개 이하가 되도록
4. (initial page load) 병렬적으로 청크 요청이 30개 이하가 되도록

그러니깐 웹팩 자체에서 브라우저가 가져오는 번들 사이즈와, 개수를 어느정도 고려하고 분할하고 있습니다.
기본값은 다음과 같습니다.

```js
module.exports = {
  //...
  optimization: {
    splitChunks: {
      chunks: "async",
      minSize: 20000,
      minRemainingSize: 0,
      minChunks: 1,
      maxAsyncRequests: 30,
      maxInitialRequests: 30,
      enforceSizeThreshold: 50000,
      cacheGroups: {
        defaultVendors: {
          test: /[\\/]node_modules[\\/]/,
          priority: -10,
          reuseExistingChunk: true,
        },
        default: {
          minChunks: 2,
          priority: -20,
          reuseExistingChunk: true,
        },
      },
    },
  },
};
```

`chunk` 옵션은 최적화를 위해 어떤 애덜이 대상이 될 건지 지정합니다.
저는 이옵션에 `all`을 해주었는데, `async`(on demand) , `initial`(initial page load) 둘다 대상이 됩니다.

### 실행 스크립트 만들기 📃

그리고 다음처럼 빌드 스크립트를 써주어 봅시다.

```json
{
  "scripts": {
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

이제 `yarn build` 를 통해 빌드를 해보세요!

## 4. Webpack dev server

CRA나 Next.js를 써보셨다면 개발용 서버를 띄웠던 경험이 있을겁니다.
Webpack 설정에서 다음을 추가해서 개발 서버를 띄워봅시다.

```js
// ./webpack.config.js
module.exports = {
  // ...
  devServer: {
    port: 3000,
    contentBase: [
      path.resolve(__dirname, "public/images"),
      path.resolve(__dirname, "public/assets"),
    ],
    contentBasePublicPath: ["/images", "/assets"],
  },
};
```

- `devServer` : 개발 서버 속성입니다. 사실 지정안해도 쓸 수 있습니다. 웹팩이 기본값을 가지고 있거덩요.
  - `port` : 개발 서버 포트를 지정해줍니다.
  - `contentBase` : 정적 파일을 제공하고 싶을 때, 그 정적 파일을 어디서 가져올 지 지시합니다.
  - `contentBasePublicPath`:정적 파일들이 어떤 주소로 접근가능하게 할지 설정합니다.

저는 images와 assets이라는 폴더를 정적 파일을 제공할 수 있게 설정해 둔것입니다. `localhost:3000/images`로 접근가능할거에요.
스크립트에 다음을 추가해주세요.

```json
{
  "scripts": {
    "dev": "webpack serve",
    "build": "cross-env NODE_ENV=production webpack"
  }
}
```

이제 `yarn dev`를 하면 개발서버가 짜잔✨ 하고 열립니다!

### 주의

`webpack-dev-server` 로 개발 서버를 여는 것은
`webapck-cli 4.x`, `webpack 5.x` 버전에서 문제가 생기고 있습니다.
`webpack-dev-server` 로 쓰셨던 분들은 아래처럼 바꾸면 잘 동작합니다.

```sh
# 기존 실행 스크립트
webpack-dev-server
# 이렇게 바꾸면 잘동작합니다.
webpack serve
```

참고 : https://github.com/webpack/webpack-dev-server/issues/2029#issuecomment-707196728

## 5. React에서 Hot Module Replacement 적용

이제 `yarn dev`를 치면! 개발서버가 열리고 확인할 수 있게 되었습니다.

근데 `HMR`은 안되는 것 같습니다? 파일을 고치고 저장해봐도 컴파일은 되는데 브라우저에서 해당 부분만 리로딩하지 않습니다.
`HMR`을 위한 추가 설정이 필요합니다!

### Hot Module Replacement 이란

Hot Module Replacement(이하 HMR)는 모듈 전체를 다시 로드하지 않고 애플리케이션이 실행되는 동안 교환, 추가 또는 제거합니다. 다음의 몇가지 방법으로 개발 속도를 크게 높일 수 있습니다.

- full refresh 중에 손실되는 애플리케이션의 state를 유지합니다.
- 변경된 사항만 갱신합니다.
- 소스코드에서 css/js 를 수정하면 즉시 업데이트합니다. 브라우저 개발자도구에서 직접 변경하는 것과 거의 똑같은 속도!

즉 새로고침 없이, 변경된 스크립트만 개발서버에서 다시 빌드해준 것을 공급해주는 방식이에요. file change가 일어나면, watch하고 있던 녀석이 동작하여 브라우저에게 websocket을 통해 "야 파일 변경됐다 이걸로 다시 받어!" 라고 알려주고 바뀌는 방식입니다.

### React 에서의 HMR

Dan abramov 는 react-hot-loader가 곧 React fast refresh로 대체될 것이라고 했습니다

> React-Hot-Loader is expected to be replaced by React Fast Refresh [원문](https://github.com/gaearon/react-hot-loader)

관련 이슈 : https://github.com/facebook/react/issues/16604

react-fresh라는 이름으로 패키지가 있습니다.

이에 대한 설정을 하려면 컴포넌트 레벨에서도 붙여줘야할게 많아서 따로 플러그인이 있는지 찾아보니 아래와 같습니다.

react-refresh-webpack-plugin : https://github.com/pmmmwh/react-refresh-webpack-plugin

개인 레포인줄 알았는데, CRA로 설치한 것을 eject 했을 때도 포함되어있는 거보니 리액트에서 HMR을 위한 latest한 방식 같습니다.\
그리고 해당 플러그인을 사용하기 위한 리액트, 웹팩 버전이 명시되어있습니다. 최소 React 16.9.0, Webpack 4.43.0 정도는 되어야합니다.

이 플러그인을 통해 React HMR을 적용해봅시다.

1. 패키지를 설치해줍시다.

```bash
yarn add -D @pmmmwh/react-refresh-webpack-plugin react-refresh
```

2. webpack.config.js를 수정해줍시다.

- `babel` 옵션에도 설정을 해주어야 하는데, 환경변수에 따라 다른 설정을 넣어주기 위해 기존 바벨 설정 파일을 json형식에서 js로 바꾸겠습니다. (`.babelrc` => `babel.config.js`).
- 왜인지 모르겠지만, `.browserslistrc` 로 target 브라우저를 설정하는 방식으로 두면 자꾸 HMR적용이 안되었습니다. 해당 설정을 그대로 `babel.config.js`로 이전시키니 잘 동작했습니다. 기존 `.browserslistrc`를 삭제해주세요!
- `development` 모드일때 ReactRefreshWebpackPlugin를 활성화 해줍니다.
- `devServer.hot` : hot reload를 지원하기 위해 devServer에 hot이라는 설정도 추가해줍시다.

```js
// ./webpack.config.js
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ReactRefreshWebpackPlugin = require("@pmmmwh/react-refresh-webpack-plugin");
const path = require("path");
const isProd = process.env.NODE_ENV === "production";
module.exports = {
  mode: isProd ? "production" : "development",
  devtool: isProd ? undefined : "eval-cheap-module-source-map",
  entry: "./src/index.js",
  resolve: { extensions: [".js", ".jsx"] },
  module: {
    rules: [
      {
        test: /\.(js|jsx)$/,
        exclude: /node_modules/,
        use: "babel-loader",
      },
      {
        test: /\.css$/,
        use: ["style-loader", "css-loader"],
      },
    ],
  },
  output: {
    clean: true,
    filename: (pathData) => {
      return pathData.chunk.name === "main"
        ? "bundles/index.js"
        : "bundles/chunks/[contenthash].js";
    },
    path: path.resolve(__dirname, "dist"),
    publicPath: "/",
  },
  devServer: {
    port: 3000,
    contentBase: [
      path.resolve(__dirname, "public/images"),
      path.resolve(__dirname, "public/assets"),
    ],
    contentBasePublicPath: ["/images", "/assets"],
    hot: true,
  },
  plugins: [
    !isProd && new ReactRefreshWebpackPlugin(),
    new HtmlWebpackPlugin({ template: "./public/index.html" }),
  ].filter(Boolean),
  optimization: {
    splitChunks: {
      chunks: "all",
    },
  },
};
```

변경된 babel.config.js는 다음과 같습니다.

```js
// ./babel.config.js
const isProd = process.env.NODE_ENV === "production";
module.exports = {
  presets: [
    [
      "@babel/preset-env",
      {
        useBuiltIns: "usage",
        corejs: "3.16.0",
        targets: isProd
          ? "> 0.5%, last 2 versions, Firefox ESR, not dead"
          : "defaults",
      },
    ],
    ["@babel/preset-react", { development: !isProd, runtime: "automatic" }],
  ],
  ...(!isProd && { plugins: ["react-refresh/babel"] }),
};
```

## 6. sass-loader 적용

그냥 css로 작업하는거 너무 힘들죠. 이번엔 css pre-processor중 가장 많이 쓰이는 sass를 적용해볼게요.

rules에서 css 담당 로더를 다음과 같이 바꿉니다.

- 이젠 `.sass, .scss, .css`를 모두 포함합니다.
- 가장먼저 `sass-loader`가 모듈을 relsove 합니다.

```js
module.exports = {
  module: {
    rules: [
      {
        test: /\.(sa|sc|c)ss$/,
        use: ["style-loader", "css-loader", "sass-loader"],
      },
    ],
  },
};
```

이제 다음처럼 scss 모듈을 쓸 수 있습니다.

```js
import styles from "./Count.module.scss";
const Count = () => {
  return (
    <div>
      <div className={styles.count}></div>
      <div className={styles.buttons}></div>
    </div>
  );
};
export default Count;
```

# 7. css 파일로 추출하기

style-loader는 기본적으로 head안에 style태그로 인라인 css를 주입합니다.
캐싱을 위해선 적절하지 않습니다.
`linkTag`라는 옵션으로 따로 css를 추출할 수 있긴 한데, chunk형태로 쪼개는 기능은 없었습니다.
이를 위해 `mini-css-extract-plugin`을 썼는데요. webpack에서도 권장하는 사항입니다.
자세한 글은 길어져서 따로 문서로 만들었습니다.

- [style-loader](docs/Webpack.style-loader.md)
- [mini-css-extract-plugin](docs/Webpack.mini-css-extract-plugin.md)

```js
module.exports = {
  plugins: [
    new MiniCssExtractPlugin({
      filename: isProd
        ? "static/css/[name].[contenthash].css"
        : "static/css/[name].css",
      chunkFilename: isProd
        ? "static/css/[id].[contenthash].css"
        : "static/css/[id].css",
    }),
  ],
};
```

### 코드 스플리팅 (준비중)

### 타입스크립트 적용 (준비중)

## 그 외 협업을 위해 거의 필수로 필요한 것들 (준비중)

### eslint (준비중)

`.eslintrc` 로 사용

### prettier (준비중)

`.prettierrc` 로 사용

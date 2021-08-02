# React from scratch

## React 기본 패키지 설치

```bash
yarn add react react-dom web-vitals
```

## 빌드를 위한 도구 설치

리액트를 JSX문법도 쓰고 ES6로 작성해도 브라우저에서 도는 호환성있는 코드로 빌드 하기 위해서 필요한게 있습니다.

### babel

### 님 이거 왜 필요해여?? 🤔

- JSX, ES6 을 ES5 코드로 컴파일 해줍니다.
- 브라우저 호환성을 위한 polyfill도 해줍니다.

```bash
yarn add -D @babel/core @babel/cli @babel/preset-env @babel/preset-react
```

- `@babel/core` : 바벨이 파일을 컴파일 해주는 핵심 소스들이 여기에 있습니다.
- `@babel/cli` : 바벨 명령어를 커맨드라인에서 사용할 수 있게 해주는 패키지입니다.
- `@babel/preset-env` : 최신 ES6+ 문법을 쓰고 브라우저에서 동작하는 자바스크립트로 변환해줍니다. 옵셔널로 폴리필도 해줍니다.
- `@babel/preset-react` : 핵심은 JSX 문법을 자바스크립트 코드로 바꿔주는 역할입니다.

### 아니 왜케 쪼개놓나요? 설치하기 골치 아프게 😡

다양한 환경에서 필요한 기능이 서로 다를 텐데, 한 몸뚱아리로 거대하게 갖는 것보단, 파일 컴파일에 필요한 녀석을 선택적으로 설치할 수 있게 하기 위함입니다.

리액트에서는 저거 네개 다 필요하니까 달달 외우세여 ㅡㅡ 따라해봅시다.

> CCPP! 코어! 씨엘아이! 프리셋엔브! 프리셋리액트!

자 근데 설치만 한다고 앱이 빌드하는 방법을 아는게 아닙니다. 연장만 들고 있는 상태죠.
이제 _"이거 들고 어떻게 일해라"_ 라고 가르쳐 줘야합니다. 컴퓨터는 멍청하니까요.

자 프로젝트 루트에다가 다음 파일 딱 생성합시다.

- `.babelrc` : 바벨이 어떤 preset, plugin을 이용해 파일을 컴파일할지 적어주는 설정 문서입니다.

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

자 설정까지 다 해줬습니다. 이제 컴파일 명령어만 내리면 됩니다. 한번 해봅시다.
테스트를 위해 다음 파일을 작성해봅시다.

```js
// src/test.js

// Arrow function & Default parameter
const f = (x, y = 7, z = 42) => x + y + z;
f(1) === 50;

// Spread operator
var params = ["hello", true, 7];
var other = [1, 2, ...params];

// Template literal, String interpolation
var customer = { name: "Foo" };
var card = { amount: 7, product: "Bar", unitprice: 42 };
var message = `Hello ${customer.name},
want to buy ${card.amount} ${card.product} for
a total of ${card.amount * card.unitprice} bucks?`;

// Promise
new Promise((resolve, reject) => {
  resolve();
}).finally(() => console.log("end"));
```

이제 cli에서 바벨로 트랜스폼 해주는 명령어를 내려봅시다.

```bash
npx babel src/test.js --out-dir dist
```

결과를 봅시다.

```js
// dist/test.js

"use strict";

// Arrow function & Default parameter
var f = function f(x) {
  var y = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : 7;
  var z =
    arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 42;
  return x + y + z;
};

f(1) === 50; // Spread operator

var params = ["hello", true, 7];
var other = [1, 2].concat(params); // Template literal, String interpolation

var customer = {
  name: "Foo",
};
var card = {
  amount: 7,
  product: "Bar",
  unitprice: 42,
};
var message = "Hello "
  .concat(customer.name, ",\nwant to buy ")
  .concat(card.amount, " ")
  .concat(card.product, " for\na total of ")
  .concat(card.amount * card.unitprice, " bucks?"); // Promise

new Promise(function (resolve, reject) {
  resolve();
})["finally"](function () {
  return console.log("end");
});
```

음... 다 잘 바뀌는데??
잉??? `Promise`의 polyfill이 안보이넵쇼??

잠깐 `@babel/preset-env`가 어떻게 컴파일 하는지 알아볼 필요가 있습니다.

### `@babel/preset-env`는 어떻게 컴파일을 하는가

브라우저별로 지원되거나 지원되지 않는 기능들이 있을겁니다. 바벨에서는 이런 것을 모아 모아서 어떤 브라우저의 어떤 버전이 어떤걸 지원하는지 mapping 해두었습니다. [여기](https://github.com/babel/babel/blob/main/packages/babel-compat-data/data/plugins.json)를 들어가보세요!

우리가 특정 타겟 브라우저들을 입력해주면, 바벨을 해당 브라우저들이 지원하지 않는 문법을 변환해주거나, 아예 없는 기능들은 폴리필로 만들어줍니다.

타겟 브라우저 설정은 `targets` 라는 옵션으로 할 수 있습니다.
근데 아까 우리가 타겟 브라우저들을 정해주었나요?
안했죠. 안해줄 때 `@babel/preset-env` 는 오로지 ES6+ -> ES5 로만 컴파일 합니다.

아무것도 안넣어줄 때도 좀... 해주지 왜 그랬냐구요?

> Since one of the original goals of preset-env was to help users easily transition from using preset-latest, it behaves similarly when no targets are specified: preset-env will transform all ES2015-ES2020 code to be ES5 compatible - 출처 : https://babeljs.io/docs/en/babel-preset-env#no-targets

`preset-latest`를 쓰던 사용자가 쉽게 전환하게 하기 위해서입니다. `preset-latest`이 바로 ES6+ -> ES5 로만 컴파일하던 것이 었습니다.

그리고 이렇게 하는 것은 babel에서 별로 권하질 않습니다. 핵심인 polyfill이 빠져있으니까요.

이제 `targets`를 넣어줍시다.

지정하는 방법은 브라우저별 버전을 직접 명시하는 방법도 있고, market share기준으로 넣는 방법도 있습니다

#### 브라우저 버전 명시

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": {
          "edge": "17",
          "firefox": "60",
          "chrome": "67",
          "safari": "11.1"
        }
      }
    ],
    "@babel/preset-react"
  ]
}
```

#### 마켓 쉐어 기준

```json
{
  "presets": [
    [
      "@babel/env",
      {
        "targets": "> 0.5%, last 2 versions, Firefox ESR, not dead"
      }
    ],
    "@babel/preset-react"
  ]
}
```

- `> 0.5%` : 마켓 쉐어가 0.5% 이상인 브라우저 대상입니다.
- `not dead` : 운영이 중지된것입니다.
- `last 2 versions` : 각 브라우저의 마지막 2개 버전까지가 대상입니다.
- `Firefox ESR` : 파이어폭스가 큰 기관이나 대학에 지원하는 버전입니다. 최신 기능은 지원하지 않으나 안전성, 보안은 업데이트 됩니다.

위에서 쓴 옵션이 `browserlist`의 기본 옵션입니다.
그게 뭐냐고요?

### browserlist

타겟 브라우저를 `.babelrc`에 적는 방식도 있는데 더 좋은 방식이 있습니다.
support 할 브라우저 버전을 명시해놓고 여러 front-end 툴들이 공유하게 하는 약속같은 파일이 있습니다.
바로 browserlist 입니다.

[browserlist 공식 Github repo](https://github.com/browserslist/browserslist)

여러가지 방식으로 쓸 수 있는데 우리는 `.browserslistrc` 라는 파일로 관리하겠습니다.
설정 파일은 가급적 분리되어있는 파일로 존재하는 것이 역할 scope이 잘 나뉘어지기 때문입니다.

위의 설정을 `.browserslistrc` 파일에 맞게 적으면 아래와 같습니다.

```sh
# Browsers that we support
> 0.5%
last 2 versions
Firefox ESR
not dead
```

기존 `.babelrc` 는 다시 원래대로 두겠습니다.

```json
{
  "presets": ["@babel/preset-env", "@babel/preset-react"]
}
```

다시 컴파일 하여 폴리필이 잘 되는지 확인합시다.
미리 말하지만 안될겁니다..!

마지막 옵션이 있습니다.

### `@babel/preset-env`의 `useBuiltIns`

`useBuiltIns` 옵션은 `"usage" | "entry" | false` 를 가질 수 있고 기본값은 `false` 입니다.

#### `entry` 일 때

엔트리 파일에서 딱 한번 `import "core-js/stable"; import "regenerator-runtime/runtime";`을 선언하면 필요한 컴파일시 `core-js`모듈만을 불러오도록 바꿉니다.

#### `usage` 일 때

각 파일별로 딱 필요한 polyfill 만을 불러옵니다.
번들러가 같은 폴리필을 딱 한번만 불러온다는 장점이 있습니다.

### `@babel/preset-env`의 `corejs`

`useBuiltIns` 옵션을 `false`외의 값으로 쓸 때 이젠 필수로 명시해야하는 필드입니다.
`core-js`의 버전을 명시해줍니다. 이 문서가 쓰일 때 시점에 바벨 docs에 3.6.5를 쓰는 예시가 있었었고, latest는 3.16.0이었슴다.
저는 3.16.0을 써보겠슴다!

```bash
yarn add core-js@3.16.0
```

`.babelrc`

```json
{
  "presets": [
    ["@babel/preset-env", { "useBuiltIns": "usage", "corejs": "3.16.0" }],
    "@babel/preset-react"
  ]
}
```

다시 컴파일 하여 폴리필이 잘 되는지 확인합시다.

```bash
npx babel src/test.js --out-dir dist
```

```js
// dist/test.js
"use strict";

require("core-js/modules/es.array.concat.js");

require("core-js/modules/es.object.to-string.js");

require("core-js/modules/es.promise.js");

require("core-js/modules/es.promise.finally.js");
// ....
```

호오 아주 잘됩니다?

일단 여기까지가 babel까지 적용해본 것이었슴다.

이제 리액트 코드까지 빌드해보져

```bash
npx babel src --out-dir dist
```

잘 빌드 되는 것 같은데 index.html을 실행하면 브라우저에서 require 를 찾을 수 없다고 나옵니다.
또 한가지 문제가 있습니다.
`react`는 해당 코드에서 `node_modules`에서 불러오는 형태를 유지하고만 뿐,
웹환경에서 react에 대한 코드는 찾을 수 없습니다.
이제 `webpack`이 필요한 때입니다.

```js
// index.js
"use strict";

var _react = _interopRequireDefault(require("react"));

var _reactDom = _interopRequireDefault(require("react-dom"));
// ...
```

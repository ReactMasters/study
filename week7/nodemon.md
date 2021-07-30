# nodemon 에 대하여

nodemon은 node.js 기반의 앱을 file change를 감지함으로서 재시작하게 해주는 도구입니다.

nodemon을 쓰기 위해 코드 자체에 무언가 해주어야할 필요는 없고 오로지 `node` 로 실행하던 것을 `nodemon` 으로 실행하는, 일종의 wrapper입니다.

## 설치

```bash
npm i -g nodemon
```

## 실행

```bash
nodemon [your node app]
```

## CLI 옵션

```bash
--config file ............ (기본값인) nodemon.json 외의 config file 을 지정합니다.
-e, --ext ................ 변경을 감지할 확장자들을 넣습니다. ie. js,pug,hbs.
-x, --exec <script> ...... script로 실행합니다. ie. -x "python -v".
-w, --watch path ......... 변경을 감지할 폴더나 파일들을 지정합니다.
-i, --ignore ............. 변경을 무시할 폴더나 파일들을 지정합니다.
-V, --verbose ............ 무엇이 restart를 일으켰는지 자세히 보여줍니다.
-- <your args> ........... 실행할 앱에 args를 전달합니다.
```

이러한 옵션으로 nodemon 을 사용시 커스텀하게 재시작 조건을 지정할 수 있습니다.
다만 매번 이렇게 쓰는 것은 번거로워, 스크립트로 지정해 놓거나 configuration 파일로 만들 수 있습니다.

# config file

nodemon은 local 및 global config file을 지원합니다.
`nodemon.json`의 파일로 이름을 짓고 현재 작업중인 디렉토리(local config)나, 홈 디렉토리(global config)에 둘 수 있습니다.
혹은 -- config <file> 옵션으로 config 파일을 직접 지정할 수도 있습니다.
적용 우선순위는 다음과 같습니다.

- command line arguments
- local config
- global config

config 파일은 cli argument 들을 JSON key value로 받습니다.

```js
{
  "restartable": "local", // nodemon 실행중 콘솔에서 입력하면 재실행 할 수 있는 키워드 입니다.
  "verbose": false,
  "watch": ["server/*.js"],
  "exec": "node server",
  "execMap": {
    // nodemon 이 지원하지 않는 확장자를 실행해줄 프로그램을 지정합니다.
    "pl": "perl"
  }
}
```

# nodemon 자체 default config

```js
// default options for config.options
module.exports = {
  restartable: "rs",
  colours: true,
  execMap: {
    py: "python",
    rb: "ruby",
    ts: "ts-node",
    // more can be added here such as ls: lsc - but please ensure it's cross
    // compatible with linux, mac and windows, or make the default.js
    // dynamically append the `.cmd` for node based utilities
  },
  ignoreRoot: ignoreRoot.map((_) => `**/${_}/**`),
  watch: ["*.*"],
  stdin: true,
  runOnChangeOnly: false,
  verbose: false,
  signal: "SIGUSR2",
  // 'stdout' refers to the default behaviour of a required nodemon's child,
  // but also includes stderr. If this is false, data is still dispatched via
  // nodemon.on('stdout/stderr')
  stdout: true,
  watchOptions: {},
};
```

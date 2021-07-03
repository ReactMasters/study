# The Performance of Styled Components (v5.0.0+)

# Styled Components

---

Styled Component는 React와 React Native 컴포넌트 스타일링을 위한 라이브러리다. Styled Components는 CSS-in-JS 방법을 사용하는 대표적인 라이브러리다. 

# CSS-in-JS

---

`CSS-in-JS` 방법으로 CSS를 작성하면 다음과 같은 문제점을 해결한다.  

- Global namespace
    - 클래스명이 build time에 유니크한 해시값으로 변경되기 때문에 별도의 명명 규칙이 필요하지 않다.
- Dependencies
    - CSS가 컴포넌트 단위로 추상화되기 때문에 CSS 모듈간에 의존성을 신경쓰지 않아도 된다.
- Dead Code Elimination
    - 컴포넌트와 CSS가 동일한 구조로 관리되므로 수정 및 삭제가 용이하다.
- Minification
    - 네임스페이스 충돌을 막기위해 [BEM(Block-Element-Modifier)](https://wenukagtx.medium.com/bem-namespaces-81a5868e725c) 같은 방법론을 사용하면 클래스명이 길어질 수 있지만, CSS-in-JS는 짧은 길이의 유니크한 클래스명을 자동으로 생성한다.
- Sharing Constants
    - CSS 코드를 JS에 작성하므로 컴포넌트의 상태에 따른 동적 코딩이 가능하다.
- Non-deterministic Resolution
    - CSS가 컴포넌트 스코프에서만 적용되기 때문에 우선 순위에 따른 문제가 발생하지 않는다.
- Isolation
    - CSS가 JS와 결함해있기 때문에 상속에 관한 문제를 신경 쓰지 않아도 된다.

그렇다면 `CSS-in-JS`는 어떤 단점이 있을까?

- 번들 크기가 커진다.
    - 별도의 라이브러리가 필요없는 CSS-in-CSS와 다르게 CSS-in-JS는 별도의 라이브러리를 추가로 설치해야 하고, 필요하다면 관련된 라이브러리의 추가 설치가 필요하다.
    - 번들 크기가 커지면 다운로드 시간이 길어져 초기 진입이 느려진다. 게다가 JS가 모두 로딩된 후에 CSS 코드가 생성되기 때문에 더욱 느려질 수 밖에 없다.
    - SSR(Server Side Rendering)을 적용하면 초기 진입 시 완성된 HTML을 다운로드하기 때문에, 번들 파일을 내려받기 전에 콘텐츠를 볼 수 있다. 단, 동적 인터렉션이 필요한 웹사이트에 적용하게 되면, 번들이 다운되고 인터렉션에 필요한 CSS가 삽입되기 전까지 제대로 된 인터렉션이 적용되지 않을 수있다.
- 인터렉션이 느리다.
    - [Issue#134](https://github.com/styled-components/styled-components/issues/134)에서 언급했듯 매우 동적인(highly dynamic) 스타일에 적합하지 않다.
        - 다음의 코드는 [Issue#359](https://github.com/styled-components/styled-components/issues/359)에서 언급된 방법으로, 높은 fps로 styled-components를 업데이트하기 위해 inline 스타일로 작성한 것이다.

        ```jsx
        const Comp = styled.div.attrs({
        	style: props => ({
        		color: props.color
        	})
        })`
        	// other rules
        `;
        ```

- 컴포넌트가 스크린 위에 있을 경우에만 렌더된다. 이는 전체 CSS파일을 로드하는 것보다 빠르기에 장점이지만, 스타일이 한 번 parse되면 모든 코드가 `index.html` 파일에 추가되고 CSS를 JS와 분리시킬 수 없다는 단점이 있다.
    - Single Page Application (SPA)에 적합하다. 어차피 SPA는 요청마다 코드를 다운로드해야하기 때문이다.
    - styled components를 반드시 렌더 메소드 바깥에 정의해야 한다. 그렇지 않으면 매 렌더링마다 컴포넌트가 재생성된다.
- 디버깅하기 어렵다.

# Bundle size

---

- 코드의 압축된 사이즈와 압축되지 않은 사이즈에는 큰 차이가 있다.
- 압축된 사이즈가 작을수록, 더 적은 데이터가 클라이언트에 전달되므로 앱은 더 빨리 로드된다. 즉, 압축된 사이즈는 전달하는 속도에 영향을 끼친다.
- 압축되지 않은 사이즈는 파싱(parsing)하고, 컴파일(compile)하고, 코드를 실행하는 속도에 영향을 끼친다.
- 아래는 [Bundlephobia](https://bundlephobia.com)를 이용해 번들 사이즈를 분석한 결과이다.

![The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled.png](The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled.png)

# Performance Comparison: Styled components vs. Linaria

---

이 섹션은 Tomas Pustelnik 블로그에서 2021년 쓰여진 포스트 "[Real-world CSS vs. CSS-in-JS performance comparison](https://pustelto.com/blog/css-vs-css-in-js-perf/)"를 참조하고 있다. 퍼포먼스 측정에 사용된 어플리케이션에 관한 정보는 다음과 같다. 

- Bootstrapped using Create React App (CRA), with Redux
- Styled using Styled components (v5)
- A fairly large app with many screens, customizable dashboards, customer theming, and more.
- Client-side rendering

해당 테스트는 Chrome dev tools를 이용하였으며, 각 3번씩 테스트를 실행하였고, 다음의 결과는 3번의 테스트 결과의 평균값이다. 모든 테스트에서 CPU 스로틀링은 4x로, 네트워크 스로틀링은 Slow 3G로 설정하였다. 아쉽게도 참조한 블로그 글에서는 테스트한 기기의 CPU 스펙을 명시하지 않았다. 

퍼포먼스를 비교한 두 라이브러리 Styled-components와 Linaria는 모두 CSS-in-JS 방식이다. Linaria는 기존 CSS-in-JS 방식의 라이브러리와 달리, 스타일을 CSS 파일로 추출하여 프로젝트를 빌드하고, CSS 파일을 로드한다. 

## Network stats comparison

![The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled%201.png](The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled%201.png)

## Coverage

![The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled%202.png](The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled%202.png)

## Lighthouse performance profiling

- Scripting time은 Javascript execution time을 말한다.
- Rendering time은 각 DOM 노드와 관련된 스타일을 계산하는 데 소요되는 시간이다.
- Painting time은 픽셀을 페인팅하는 데 소요되는 시간으로 Paint, Decode Image, 혹은 Resize Image 같은 이벤트를 포함한다.

![The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled%203.png](The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled%203.png)

## User Interaction

다음은 드래그 앤 드롭 인터렉션의 퍼포먼스를 측정한 결과이다. 

![The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled%204.png](The%20Performance%20of%20Styled%20Components%20(v5%200%200+)%20c12e3fe3f8fd47e0be2c7df289b2b61f/Untitled%204.png)

# 참고자료

---

[https://blueshw.github.io/2020/09/14/why-css-in-css/](https://blueshw.github.io/2020/09/14/why-css-in-css/)

[https://blog.logrocket.com/moving-from-scss-to-styled-components-advantages-and-caveats/](https://blog.logrocket.com/moving-from-scss-to-styled-components-advantages-and-caveats/)

[https://stackoverflow.com/questions/54304944/does-css-in-js-not-prevent-browser-from-css-caching](https://stackoverflow.com/questions/54304944/does-css-in-js-not-prevent-browser-from-css-caching)

[https://itnext.io/css-in-js-vs-pre-post-processors-in-2019-8b1e20c066ed](https://itnext.io/css-in-js-vs-pre-post-processors-in-2019-8b1e20c066ed)

[https://pustelto.com/blog/css-vs-css-in-js-perf/](https://pustelto.com/blog/css-vs-css-in-js-perf/)

[https://blog.primehammer.com/the-performance-of-styled-react-components/](https://blog.primehammer.com/the-performance-of-styled-react-components/)
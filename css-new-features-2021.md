# The latest features of CSS in 2021

이 포스트는 2021년 기준 새롭게 제공하고 있는 css 기능들과 간단한 예시들을 정리하였습니다. 

다음의 기능들은 1개 이상의 브라우저가 현재 지원하고 있는 특징들만 작성하였습니다. 



## CSS Scroll snap

[CSS Scroll Snap](https://developer.mozilla.org/en-US/docs/Web/CSS/CSS_Scroll_Snap)은 사용자가 터치나 스크롤 조작을 하였을 때 offset을 설정할 수 있는 CSS 모듈입니다. 

CSS Scroll Snap 모듈에서 가장 중요한 속성은 `scroll-snap-type`과 `scroll-snap-align`입니다. 

* `scroll-snap-type`: 이 속성은 [scroll container](https://developer.mozilla.org/en-US/docs/Glossary/Scroll_container)의 스크롤 스냅핑이 일어날 방향과 스크롤 스냅핑의 엄격도를 설정할 수 있습니다. 문법 형식은 다음과 같습니다. 자세한 설명은 [링크](https://developer.mozilla.org/en-US/docs/Web/CSS/scroll-snap-type) 참조바랍 니다. 

```
scroll-snap-type: none | [ x | y | block | inline | both ] [ mandatory | proximity ]?`
```

엄격도를 따로 설정하지 않는다면 default 값으로 `proximity`로 설정됩니다. 

* `scroll-snap-align`: 이 속성은 스냅할 때 어떤 방향으로 정렬할건지 설정할 수 있습니다. 

예를 들어, 아래와 같이 scroll 가능한 container 안에 여러 개의 item이 세로로 있을 때, y축으로 항상 스냅이 가능하고 가운데 정렬되어 스냅하고 싶다면 다음과 같이 코드를 작성하면 됩니다. 

```css
<h3>Scroll down &darr;</h3>
<div id="container">
	<div class="item">1</div>
	<div class="item">2</div>
	<div class="item">3</div>
	<div class="item">4</div>
	<div class="item">5</div>
	<div class="item">6</div>
	<div class="item">7</div>
	<div class="item">8</div>
</div>
```

 ```css
 #container {
 	width: 500px;
 	height: 500px;
 	overflow: auto;
 	/* ADD THIS TO THE PARENT */
 	scroll-snap-type: y mandatory;
 }
 
 .item {
 	/* ADD THIS TO THE CHILD */
 	scroll-snap-align: center;
 	display: inline-block;
 	width: 500px;
 	height: 500px;
 	display: flex;
 	justify-content: center;
 	align-items: center;
 	font-size: 38px;
 }
 ```



## The aspect ratio feature

`aspect ratio`는 너비와 높이의 비율을 일정하게 유지하는 기능을 제공합니다. 

[cumulative layout shift](https://web.dev/cls/) 문제를 방지하기 위해서라도 반응형 웹의 레이아웃을 구상할 때 일정한 비율을 유지하는 것은 중요합니다. 

사용할 수 있는 상황예시는 다음과 같습니다.

* 로드할 내용을 위한 컨테이너에 placeholder를 만들 때
* 카드와 같은 일관적인, 일정한 사이즈의 커포넌트를 만들 때
* 반응형 iframes를 만들 때

문법은 간단합니다. (너비)/(높이) 비율을 `aspect-ratio` 값으로 적어주면 됩니다. 주의할 점은 `height`와 `width`를 모두 설정하면 이 속성은 적용되지 않습니다. 

```css
img {
	aspect-ratio: 16 / 9;
}
```



## `Content-visibility` property

이 속성을 이용하면 페이지 렌더링 성능을 향상시킬 수 있습니다. 브라우저가 특정 엘리먼트 렌더링을 실제 보이기 전까지 생략하도록 할 수 있습니다. 

이 속성을 사용하기 전 다음 사항을 반드시 고려해야합니다. 

* 페이지의 높이: `content-visibility: auto` 또는 `content-visibility: hidden`으로 설정하면 렌더링 전까지 `height`를 0으로 만들어 보이지 않도록 합니다. 이는 페이지 높이와 스크롤을 변화시키게 됩니다. 
* 접근성에 미치는 영향: 중요한 부분(e.g., headings)에 이 속성을 사용한다면 페이지가 로드되더라도 스크린 리더는 해당 부분에 접근할 수 없습니다. 이는 콘텐츠 접근성을 하락시킵니다. 다양한 유즈케이스는 [링크](https://marcysutton.com/content-visibility-accessible-semantics)를 참조하시길 바랍니다. 

아래 예시에서는 긴 페이지의 렌더링 비용을 줄이기 위해 auto로 값을 설정하였습니다. 

```html
<section>...</section>
<section>...</section>
<section>...</section>
<section>...</section>
...
```

```css
section {
  content-visibility: auto;
  contain-intrinsic-size: 0 500px;
}
```



## CSS Selectors Level 4 - :where(), :is()

다음은 [CSS Selectors Level 4](https://drafts.csswg.org/selectors-4/#zero-matches)에 포함된 가상 클래스 :where()와 :is()입니다. 

:where(), :is()는 서로 기능과 사용방법이 같습니다. 

예를 들어, 아래와 같은 코드가 있다고 해봅시다. 

```css
a:not(:hover){
	text-decoration: none;
}

header a,
nav a,
main a {
	text-decoration: underline;
}
```

위의 코드를 다음과 같이 고칠 수 있습니다. 

```css
a:not(:hover){
	text-decoration: none;
}

:where(header, nav, main) a{
	text-decoration: underline;
}
```

위와 같이, :where()나 ()is를 사용하여 ***중복 선언을 줄일 수*** 있습니다. 



그렇다면 :where()와 :is()의 차이는 무엇일까요?

바로 :is()가 :where()보다 명시도(speciality)가 높다는 점입니다. :where()의 명시도는 0이지만, :is()는 구체적인 명시도 값을 가집니다. 

MDN [:where()](https://developer.mozilla.org/en-US/docs/Web/CSS/:where) 페이지의 예제 Comparing :where() and :is()를 보면 보다 더 정확하게 이해하실 수 있습니다. 



## CSS Grid Layout Level 2 - Subgrid

`display: grid`를 사용하면 오로지 직계 자손만 grid 속성이 적용됩니다. 만약 grid를 "nest"하고 싶다면 이 속성을 사용할 수 있습니다. 

```html
<div class="wrapper">
  <div class="box a">A</div>
  <div class="box b">B</div>
  <div class="box c">C</div>
  <div class="box d">
    <div class="box e">E</div>
    <div class="box f">F</div>
    <div class="box g">G</div>
  </div>
</div>
```

```css
body {
  margin: 40px;
}

.wrapper {
  display: grid;
  gap: 10px;
  grid-template-colulmns: 150px;
  grid-template-rows: repeat(3, minmax(100px, auto));
  background-color: #fff;
  color: #444;
}

.box{
  background-color: #444;
  color: #fff;
  border-radius: 5px;
  padding: 20px;
  font-size: 150%;
}

.box .box {
  background-color: #ccc;
  color: #444;
}
```



## CSS Color Module Level 4 - The `color` function

`color()`함수는 색상을 특정한 [color space](https://www.w3.org/TR/css-color-4/#color-space)로 나타냅니다. 이 함수를 사용하면 좀 더 넓은 범위에서 색성을 설정할 수 있습니다. 

문법 형식은 다음과 같습니다. 

```
color() = color ( [<ident> | <dashed-ident>] | [ <number-percentage>+ ] [ /<alpha-value> ]? )
```

다음 표는 css에서 사용가능한 미리 정의된 colorspace입니다.

| Colorspace   | Volume (million Lab units) |
| ------------ | -------------------------- |
| sRGB         | 0.820                      |
| display-p3   | 1.233                      |
| prophoto-rgb | 2.896                      |
| rec2020      | 2.042                      |
| lab          | 6.578                      |

위의 표를 보면 `display-p3`가 `sRGB`보다 약 35% 더 넓은 colorpace를 가지고 있습니다.

아래 예시는 sRGB와 display-p3 두 가지를 활용한 코드입니다.

```
/* sRGB color */
:root {
	--bright-green: rgb(0, 255, 0);
}

/* display-p3 color, when supported */
@supports (color: color(display-p3 1 1 1)){
	:root {
		--bright-green: color(display-p3 0 1 0);
	}
}

header {
	color: var(--bright-green);
}
```





# 참고자료

https://blog.logrocket.com/the-latest-features-of-css-in-2021/
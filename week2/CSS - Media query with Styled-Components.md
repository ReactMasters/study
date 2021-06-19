# 반응형 웹 - Media query with Styled-Components

```
yarn add styled-components
```

## 1. Mobile First

```jsx
import styled from 'styled-components';

const Col = styled.div`
  float: left;
  width: 100%;
  padding: 1rem;

  @media only screen and (min-width: 768px) {
    width: ${(props) => (props.span ? (props.span / 12) * 100 : '8.33')}%;
  }
`;
```

## 2. Breakpoint 추가

- 768px 이하: xs를 span으로 적용
- 992px 이하: sm을 span으로 적용
- 1200px 이하: md를 span으로 적용
- 1200px 이상: lg를 span으로 적용

```jsx
//Column.js
const calcWidthPercent = (span) => {
  if (!span) return;

  const width = (span / 12) * 100;
  return width;
};

const BREAK_POINT_MOBILE = 768;
const BREAK_POINT_TABLET = 992;
const BREAK_POINT_PC = 1200;

const Col = styled.div`
  float: left;
  width: ${({ xs }) => (xs ? `${calcWidthPercent(xs)}%` : `100%`)};
  padding: 1rem;

  @media only screen and (min-width: ${BREAK_POINT_MOBILE}px) {
    width: ${({ sm }) => sm && `${calcWidthPercent(sm)}%`};
  }
  @media only screen and (min-width: ${BREAK_POINT_TABLET}px) {
    width: ${({ md }) => md && `${calcWidthPercent(md)}%`};
  }
  @media only screen and (min-width: ${BREAK_POINT_PC}px) {
    width: ${({ lg }) => lg && `${calcWidthPercent(lg)}%`};
  }
`;
```

```jsx
//App.js
return (
  <AppContainer>
    <Header />
    <Row>
      <Column xs={12} sm={3} md={3} lg={3}>
        <Menu />
      </Column>
      <Column xs={12} sm={9} md={6} lg={6}>
        <Main />
      </Column>
      <Column xs={12} sm={12} md={3} lg={3}>
        <Aside />
      </Column>
      <Column xs={12} sm={12} md={12} lg={12}>
        <Footer />
      </Column>
    </Row>
  </AppContainer>
);
```

## 3. Typical Device Breakpoints

- W3Schools.com에서 제시하는 5개의 사이즈

```jsx
/* Extra small devices (phones, 600px and down) */
@media only screen and (max-width: 600px) {
}
/* Small devices (portrait tablets and large phones, 600px and up) */
@media only screen and (min-width: 600px) {
}
/* Medium devices (landscape tablets, 768px and up) */
@media only screen and (min-width: 768px) {
}
/* Large devices (laptops/desktops, 992px and up) */
@media only screen and (min-width: 992px) {
}
/* Extra large devices (large laptops and desktops, 1200px and up) */
@media only screen and (min-width: 1200px) {
}
```

## 4. Orientation: Portrait(세로) / Landscape(가로)

```jsx
@media only screen and (orientation: landscape) {
}
```

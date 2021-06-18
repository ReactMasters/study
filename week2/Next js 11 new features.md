# Next.js 11 new features

한국 시간으로 2021년 6월 16일 오전 1시 Next.js를 만들고 maintain 하고 있는 vercel에서 Next.js 11의 새로운 기능들을 online conference 형식으로 개최했습니다.

발표 시간은 단 30분 밖에 되지 않았지만, 근사하고 설레는 기능들이 많았습니다. 이를 정리해보았습니다.

## Brief comments about Next.js

- Next.js는 지난 6개월동안 npm 다운로드수가 50% 증가했습니다. (weekly 145만 다운로드)
- 빠르고 즐길 수 있는 유저경험은 곧 빠르고 즐길 수 있는 개발자 경험을 바탕으로 하고 있다는 믿음하에 Next.js 는 DX와 UX의 증진에 힘써왔습니다.

## Next.js Live (Preview Release)

![Next%20js%2011%20new%20features/Untitled.png](Next%20js%2011%20new%20features/Untitled.png)

Next.js 에서 지원하는 라이브 코딩과 협업.

브라우저에서 코딩을 하며 협업 멤버들을 초대할 수 있고, 마우스로 선을 그릴 수도 있고, 채팅할 수도 있습니다.

프레임워크 자체의 기능이 아니고 마치 로컬에서 dev 모드로 코딩하며 개발해왔던 것을 브라우저로 올린 것과 같습니다.

지금은 베타 버전이라 early access 지원을 받고 지원자들에게 선공개할 예정입니다.

지원은 [**여기**](https://nextjs.org/live)에서 하실 수 있어요! (저는 지원했습니다 😆)

## Image Component(\*update in next.js 11)

이미지는 퍼포먼스에 가장 크게 영향을 미치는 요소중 하나입니다. 최적화 되지 않은 img 태그는 퍼포먼스를 낮추고 유저경험을 안좋게 만듭니다. 성능 점수도 낮게 나오죠.

Next.js는 자체의 Image 컴포넌트를 작년 10월부터 릴리즈 했습니다. 네이티브로 지원하는 이 Image 컴포넌트는 이미지 태그를 활용하는 Best practice를 제공하기 위해 만들어졌습니다.

여기에 11에서 부터 이미지가 전달되는 디바이스의 뷰포트에 맞게 최적화 하는 기능이 추가되었습니다.

네! 자동으로 resize 및 compression을 해줍니다 😊

쓰는 방법을 알아볼게요.

### src 속성

오로지 다음 중 하나의 경우로 씁니다.

- 정적 파일로 임포트(추가 속성이 필요없습니다)
- 외부 URL로 입력하는 경우

  - 쓰려고하는 호스트네임을 `next.config.js` 추가해야합니다.

    ```jsx
    // next.config.js
    module.exports = {
      images: {
        domains: ["cdn.pixabay.com"],
      },
    };
    ```

  - `width` `height` 를 주거나 `layout` 속성을 `fill` 로 주어야합니다.

- 내부 URL로 입력하는 경우(loader에 의해 처리)
  - `width` `height` 를 주거나 `layout` 속성을 `fill` 로 주어야합니다.

### quality 속성

1~ 100까지 줄 수 있습니다. 작을 수록 품질이 낮은 사진을, 높을 수록 품질이 높은 사진을 나타냅니다.

![Next%20js%2011%20new%20features/Untitled%201.png](Next%20js%2011%20new%20features/Untitled%201.png)

저는 하나의 사진을 정말 여러 장으로 빌드하는가 싶었는데 정말이더군요.

퀄리티에 따라 용량이 달라지는 만큼 만들어졌습니다.

![Next%20js%2011%20new%20features/Untitled%202.png](Next%20js%2011%20new%20features/Untitled%202.png)

![Next%20js%2011%20new%20features/Untitled%203.png](Next%20js%2011%20new%20features/Untitled%203.png)

### placeholder 속성(\*new in next.js 11)

[데모페이지로 이동](https://image-component.nextjs.gallery/placeholder)

네트워크 환경이 좋지 않은 유저가 접속했을 때 대용량의 이미지를 불러오는 페이지라면 이미지가 로드 될 때까지 빈 영역이 생길겁니다. Next.js 에서는 이러한 빈 영역부터 이미지로의 전환을 자연스럽게 해주기 위한 이미지 placeholder 를 지원합니다.

- `blur` : 블러로 선택될 땐 `blurDataURL` 속성에 지정한 이미지가 로딩되는 동안 보여집니다. 만약 정적 파일이고 형식이 jpg, png, webp 일 때 우리가 따로 지정하지 않아도 자동 생성해줍니다.
  그렇지 않을 땐 `blurDataURL` 을 직접 선언해주어야 합니다.
- `empty` : 기본값입니다. 이미지가 불러와지는동안 빈 공간만 있게 됩니다.

### blurDataURL 속성

placeholder 로서 `blur` 가 쓰일 때 `src` 이미지가 불러와지기 전까지 보여집니다.

반드시 base64로 인코딩된 이미지여야 합니다. 10px보다 작을 것을 추천합니다. 엄청 크게 블러처리 될거라서요. placeholder로 쓰이는 이미지가 크면 퍼포먼스에 안좋겠죠?

### loader 속성

웹팩의 로더가 아닙니다. 이미지 컴포넌트 속성의 로더는 이미지 src, width, quality 프로퍼티를 받아 불러올 url을 리턴하는 함수입니다.

```jsx
import Image from "next/image";

const myLoader = ({ src, width, quality }) => {
  return `https://example.com/${src}?w=${width}&q=${quality || 75}`;
};

const MyImage = (props) => {
  return (
    <Image
      loader={myLoader}
      src="me.png"
      alt="Picture of the author"
      width={500}
      height={500}
    />
  );
};
```

## Conformance(\*new in next.js 11)

개발자로서 conformance는 여러분들이 더이상 어마어마하게 많은 복잡한 룰이나 로딩 퍼포먼스에 대해서 기억하고 있지 않아도 된다는 것입니다.

마치 TypeScript와 같은 컴파일러라고 생각해도 좋습니다. Rule을 따르고, 제약합니다. 이렇게 함으로써 예측 가능한 결과물을 낼 수 있고, 그것이 팀의 생산성 및 기능의 확장, 그리고 팀의 확장으로 이어질 것입니다.

구글 내부적으로도 이러한 룰과 제약을 사용합니다.

Conformance는 ES Lint 와 개발 모드에서 runtime check를 조합한 결과물입니다. 새로운 앱은 이제 부터 기본적으로 로딩 퍼포먼스를 예측할 수 있는 next preset을 갖게됩니다.

이를테면 이런 제약들이 Conformance에 들어갑니다.

- 의도치 않은 render
- 스크립트 blocking
- `next/Link` 를 쓰지않아 벌어지는 의도치 않은 full page refresh

사용법도 단순합니다.

- 새로운 앱의 경우 `create-next-app` 을 활용하세요.
- 기존 앱의 경우 `npm i next@latest` 따위로 업그레이드 하세요.
- 그 뒤 `next lint` 라는 스크립트로 실행할 수 있습니다.

![Next%20js%2011%20new%20features/Untitled%204.png](Next%20js%2011%20new%20features/Untitled%204.png)

직접 실행해봤는데, 기존 `eslint` 에 next.js 전용룰을 만들어서 실행하는 것이었어요!

## Script Optimization

앱을 만들며 우리는 많은 third party library 를 포함하게 됩니다. analytics, ads, customer support, widget 등을 위해서 말이죠. 그리고 이런 스크립트들은 로딩 퍼포먼스를 무겁게 만들며, 유저 경험을 저하시킵니다.

`Script` 컴포넌트는 최적화된 스크립트 로딩을 위해서 탄생했습니다.

우리는 `Script` 컴포넌트를 불러와 strategy 라는 프로퍼티에 속성만 정해주면 Next.js가 각기 다른 전략으로 스크립트를 로딩하게 만들어 줍니다.

전략들은 다음과 같습니다.

- `beforeInteractive` - 페이지가 로드 되기 전 fetch해오고 실행합니다. 서버사이드 렌더링이 만들어주는 초기 HTML에 주입되어 있습니다.
- `afterInteractive` - 페이지가 로드 된 후 실행됩니다. Next.js 에서 각 페이지별 HTML은 최소한의 script를 불러옵니다. 그리고 CSR로 각 스크립트를 실행합니다. 이 과정을 hydration이라고 하는데 `afterInteractive` 전략의 스크립트는 이 hydration과정중에 불러와지고, hydration이 끝나자마자 실행됩니다.
- `lazyOnload` - body의 onload에 주입되어 불어와 집니다. 즉 로드가 다 끝난 뒤에 불러와지는 스크립트입니다.

```jsx
export default function Page() {
  return (
    <Wrapper>
      <Script
        strategy="afterInteractive"
        src="https://sdk.amazonaws.com/js/aws-sdk-2.931.0.min.js"
      />
      <Script
        strategy="beforeInteractive"
        src="https://code.jquery.com/jquery-3.6.0.js"
      />
      <Script
        strategy="lazyOnload"
        src="https://unpkg.com/swiper/swiper-bundle.min.js"
      />
    </Wrapper>
  );
}
```

![Next%20js%2011%20new%20features/Untitled%205.png](Next%20js%2011%20new%20features/Untitled%205.png)

defer, async 등을 활용했을 거라고 예상은 했는데, 스크립트를 붙이는 위치와 시간도 달랐습니다.

- `beforeInteractive` 스크립트는 폴리필을 제외하곤 최상위로 `head` 태그에 붙고 `defer`로 가져와집니다.
- `afterInteractive` 스크립트는 `body` 태그 끝에 달립니다.
- `lazyOnload` 스크립트는 후에 `body` 태그에 append 되어 불려와지는 것 같았습니다.

![Next%20js%2011%20new%20features/Untitled%206.png](Next%20js%2011%20new%20features/Untitled%206.png)

## Font Optimization(new feature in next.js 11)

많은 개발자들이 아름다운 웹 경험을 위해 web font를 제공합니다. 80% 이상의 웹페이지들이 그들의 브랜딩과 디자인, 그리고 크로스 브라우저와 디바이스 간의 일관성을 위해 web font를 사용하고 있습니다.

다만 web font를 불러오는 것은 꽤나 cost가 드는 동작입니다.

Next.js에서는 4월부터 커스텀 폰트의 css를 빌드타임에 자동으로 인라인으로 바꿔줍니다.

![Next%20js%2011%20new%20features/Untitled%207.png](Next%20js%2011%20new%20features/Untitled%207.png)

이를 통해 페칭을 위한 왕복을 제거하고, FCP(First Contentful Paint), LCP(Largest Contentful Paint)시간을 개선시킵니다.

이러한 폰트 최적화는 Google Fonts 와 Adobe Typekit에 한해 지원됩니다.

이를 통해 어떤 프로젝트의 Lighthouse perfomance score를 30점 증가 시킬 수 있었습니다.

또한 `rel` 속성에 `preconnect` 를 기본값으로 추가하여 폰트 파일을 불러오는 것을 더 빠르게 했습니다.

## References

[Next.js 11](https://nextjs.org/blog/next-11)

[Next.js Conf - Special Edition](https://www.youtube.com/watch?v=ze8ycxc1UzE&t=919s)

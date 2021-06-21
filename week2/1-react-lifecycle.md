발표 내용은 아래 링크에서 확인
https://www.notion.so/React-functional-component-lifecycle-c572bc5d098b4d8c8b9a48cf98fa206c

TLDR: render → useEffect → useEffect cleanup → useEffect

App.tsx

```jsx
import React, { useCallback, useEffect, useState } from 'react';
import './App.css';
import Home from './components/Home/Home';
import Post from './components/Post/Post';

function App() {
  const [page, setPage] = useState("Home");

  const renderPost = useCallback(() => {
    if (page === "Home") {
      return <Home setPage={setPage}></Home>
    } else if (page === "Post") {
      return <Post setPage={setPage}>

      </Post>
    }
  }, [page])
  return (
    <div>
      {renderPost()}
    </div>
  );
}

export default App;
```

Post.tsx

```jsx
import React, { useState, useEffect } from 'react';

interface Props {
    setPage: Function,
    children?: React.ReactNode
}

const Post = (props: Props) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log('Post: useEffect: count:', count);
        return () => {
            console.log('Post: cleanup: count', count);
        }
    });
    console.log('Post: render: count', count);

    return <>
        <div onClick={() => {
            setCount(count + 1);
        }}>Post Count</div>
        <div onClick={() => props.setPage("Home")}>Go Home</div>
    </>
}

export default Post;
```

Home.tsx

```jsx
import React, { useEffect, useState } from 'react';

interface Props {
    setPage: Function,
    children?: React.ReactNode
}

const Home = (props: Props) => {
    const [count, setCount] = useState(0);
    useEffect(() => {
        console.log('Home: useEffect', count);
        return () => {
            console.log('Home: cleanup', count);
        }
    }, []);
    console.log('Home: render', count);

    return <>
        <div onClick={()=>setCount(count+1)}>Home Count</div>
        <div onClick={() => props.setPage("Post")}>See Post</div>
    </>
}

export default Home;
```

```jsx
로그 결과
1) Home: render: count: 0
2) Home: useEffect: count 0
// Home Count 클릭
3) Home: render: count: 1
// See Post 클릭
4) Post: render: count: 0
5) Home: cleanup: count: 0
6) Post: useEffect: count: 0
```

함수형 컴포넌트와 useEffect 훅을 쓰게되면 클래스 컴포넌트에 비해 코드가 간결해진다. 반면componentDidMount, componentDidUpdate 등 클래스 컴포넌트의 라이프사이클 함수들은 이름을 보고 비교적 쉽게 사이클의 순서나 역할을 유추하기 쉬운 반면, useEffect는 다소 헷갈릴 수 있다. 위의 예제를 통해 정확히 알아보자.

1)은 이해하기 쉽다. State들이 초기화되고 가장 먼저 render를 실행시켜 UI 요소들을 화면에 그려내는 것이다. 다음으로 2)에서 useEffect 로그가 찍힌 것을 볼 수 있다. effect는 리액트 공식 문서에도 나와있듯이 side effect라고 생각하면 편하다. render 함수 이후에 UI 외의 부수적인 효과(API, subscription, logging 등)를 처리할 때 쓰이는 함수이다. 기본적으로는 render 함수가 호출될 때 마다 useEffect도 호출되며, 두 번째 파라미터를 통해 useEffect가 선택적으로 호출되도록 할 수 있다. 예제의 Home.tsx에서는 빈 배열을 인자로 넘겨, 최초 render 이후 한 번만 호출되도록 하였다. 3)의 render 이후 useEffect가 호출되지 않은 것을 확인할 수 있다.

See Post를 클릭하고 나면 Home 컴포넌트는 언마운트되고 Post 컴포넌트가 마운트된다. 마운트 이후에 Post 컴포넌트를 그려내기 위해 render 함수가 호출된 것을 4)에서 볼 수 있다. 

중요한 것은 그 다음 5)이다. Post 컴포넌트의 render가 호출되었으니 useEffect가 호출되어야 하는데, Home 컴포넌트의 cleanup 함수가 먼저 호출되었다. cleanup 함수는 이름에서 알 수 있듯이 useEffect를 통해 side effect를 처리한 이후에 "정리"하는 작업을 해주는 함수다. 당연히 다음 턴의 useEffect가 호출되기 전에 "정리"해주는 함수가 먼저 호출된다. 주의할 점은 count 값이 0이라는 것이다. 즉 cleanup 함수가 정의되는 시점의 state가 사용되며 가장 최근의 state 값이 사용된다는 것이다.
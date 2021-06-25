# What is React Render

본 글은 [https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/](https://blog.isquaredsoftware.com/2020/05/blogged-answers-a-mostly-complete-guide-to-react-rendering-behavior/)를 보고 한글로 요점을 정리한 것입니다.

리액트 렌더는 무엇일까? 화면을 그려내는 것? DOM을 업데이트 하는 것? 모두 틀렸다.
리액트 렌더의 정확한 개념에 대해 알아보자.

리액트 렌더는 각 컴포넌트가 "현재 Props와 State에 기반하여 화면에 최종적으로 그리고자 하는 것이 무엇인지 확인"하는 과정이다. 위의 문장을 두 부분으로 쪼개서 접근해보자.

*1). 현재 Props와 State에 기반하여*
: 다시 말해 현재 Props와 State의 변화가 없는 컴포넌트들은 렌더를 하지 않는다는 것이다. 여기서 주의할 점은 **부모 컴포넌트가 렌더될 때 모든 자식 컴포넌트도 렌더된다**는 것이다. 

좀 더 간단히 정리하면 렌더는
1. 현재 컴포넌트의 props나 state가 변할 때
2. 부모 컴포넌트가 렌더될 때
호출된다.

*2) 화면에 최종적으로 그리고자 하는 것이 무엇인지 확인*

화면에 최종적으로 그리고자 하는 것은 Javascript object의 형태로 정의된다. 이를 위해 JSX → React.createElement → javascript object(최종 결과물)의 변환 과정을 거친다. 이렇게 최종적으로 그리고자 하는 UI의 명세서(javascript objects tree)가 정해지면 실제 DOM과의 비교를 통해 최종적으로 실제 진행해야 하는 업데이트 목록을 생성한다. 리액트 렌더 함수가 하는 역할은 여기까지다. 업데이트 목록을 실제 DOM에 적용하는 것은 Commit Phase가 담당한다.

리액트 렌더가 작동하는 기본 원리를 이해하면 최적화를 위해 고려해야할 몇가지 포인트가 자연스럽게 도출된다.

그중에서 "부모 컴포넌트의 렌더는 자식 컴포넌트의 렌더를 일으킨다"는 점에서 아래 두가지 사항에 유의하자.

1. state는 가능한 최대한 아래(deep)의 컴포넌트에서 관리해라. 불필요하게 상위 컴포넌트에서 정의된 state는 불필요한 render을 일으킬 가능성이 높다.
2. "부모 컴포넌트의 렌더는 자식 컴포넌트의 렌더를 일으킨다"는 룰을 비켜가기 위한 몇가지 테크닉이 있다.
    1. props.children의 형태로 전달된 자식 컴포넌트는 부모의 렌더가 호출되도 자신은 렌더되지 않는다.
    2. useMemo를 통해 자식 컴포넌트를 리턴하면 두번째 인자로 전달된 dependencies가 변하지 않는 이상 해당 자식 컴포넌트는 렌더되지 않는다. 주의할 점은 아래 예제와 같이 useCallback으로 자식 컴포넌트를 리턴해버리는 경우, 콜백함수 자체가 Memoize되는 것이지 그 결과물이 Memoize되는 것이 아니기 때문에 여전히 렌더가 호출된다.

```jsx
import { ReactNode, useCallback, useMemo, useState } from "react";
import NormalChild from "../Children/NormalChild";
import MemoChild from "../Children/MemoChild";

const Parent = ({ children }: { children: ReactNode }) => {
    const [counter, setCounter]  = useState(0);
    const [counter2, setCounter2]  = useState(0);

    // useCallback memoize the function not the result. Even if the function itself
    // points at the same object, the result itself is not memoized. On the contrary,
    // useMemo memoizes the result(element in this case) itself. 

    // const renderMemoChild = useCallback(()=>{
    //     return <MemoChild></MemoChild>
    // },[]);

    // const renderMemoChild = useCallback(()=>{
    //     return <MemoChild></MemoChild>
    // },[counter2]);

    const renderMemoChild = useMemo(()=>{
        return <MemoChild></MemoChild>
    },[]);

		// Only NormalChild render is called
    return <div>
        <div onClick={()=>setCounter(counter+1)}>Counter: {counter}</div>
        <NormalChild></NormalChild>
        {children}
        {renderMemoChild}
    </div>
}

export default Parent;
```

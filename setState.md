# setState 비동기 처리 이해하기

## setState() 메소드가 실행되는 과정
1. 업데이트 할 컴포넌트 상태(state)를 포함하는 객체를 setState()의 인자로 전달한다. 
2. setState() 메소드는 위의 객체를 상태(state)에 merge하여 상태(state)를 업데이트한다.

```JSX
const [order, setOrder] = useState([]);
const onClickHandler = selectedItem => {
    setOrder([...order, selectedItem]);
};
```

## setState를 여러번 한다면? (State updates are merged.)
1. 각 setState()에 전달된 모든 객체를 추출하여 배치(batch) 작업을 수행
2. 이를 merge하여 단일 객체를 형성
3. 해당 단일 객체를 사용해 setState() 실행   
> React may batch multiple `setState()` calls into a single update for performance. 
```JSX
const [number, setNumber] = useState(0);

const func = () => {
    ...
    setNumber(number + 1);
    setNumber(number + 1);
    setNumber(number + 1);
    ...
};
```

## [state 업데이트는 비동기로 실행된다.](https://reactjs.org/docs/state-and-lifecycle.html#state-updates-may-be-asynchronous) 
> Because this.props and this.state may be updated asynchronously, you should not rely on their values for calculating the next state.


# 해결방법
## Functional `setState`
```JSX
setOrder(order => [...order, selectedItem]);
```
> It is safe to call setState with a fucntion multiple times. Updates will be queued and later executed **in the order they were called**
> -- Dan Abramov

### 함수형 setState가 강력한 이유
* 컴포넌트 클래스 외부에서 상태 업데이트 선언할 수 있다. 
* declarative -- 단순히 원하는 업데이트 유형을 선언하기만 하면 된다.
```JSX
const increaseScore = (state, props) => {score: state.score + 1};
class User {
    ...
    handleIncreaseScore(){
        this.setState(increaseScore);
    }
    ...
}
```
* 상태 변경 로직을 다른 모듈로 추출(export)한 후 컴포넌트에 가져와서(import) 사용할 수 있다. 
```JSX
import { increaseScore } from '../stateChanges';
class User {
    ...
    handleIncreaseScore(){
        this.setState(increaseScore);
    }
    ...
}
```

## useReducer()
```JSX
    // @types/react/index.d.ts
    type SetStateAction<S> = S | ((prevState: S) => S);
    type Reducer<S, A> = (prevState: S, action: A) => S;\
```
### When to use
* When the state depends on the previous one. 
```JSX
    const reducer = (state, action) => {
        switch(action.type){
            case 'ADD': return { count: state.count + 1 };
            case 'SUB': return { count: state.count - 1 };
            default: return state;
        }
    }
    const Counter() = () => {
        const [state, dispatch] = useReducer(reducer, { count: 0 });
        return (
            <>
                Count: {state.count}
                <button onClick={() => dispatch({type: 'ADD'})}>Add</button>
                <button onClick={() => dispatch({type: 'SUB'})}>Subtract</button>
            </>
        )
    };
```
* When the state consists of more than primitive values (e.g., nested object, arrays).
* When testing.
```JSX
    test("increments the count by one", () => {
        const newState = reducer({ count: 0 }, { type:: "ADD" });
        expect(newState.count).toBe(1);
    })
```


# 참고자료
* https://www.freecodecamp.org/news/functional-setstate-is-the-future-of-react-374f30401b6b/#.lt8jkdocr 
* https://leehwarang.github.io/2020/07/28/setState.html 
* https://www.freecodecamp.org/news/functional-setstate-is-the-future-of-react-374f30401b6b/ 
* https://stackoverflow.com/questions/48209452/when-to-use-functional-setstate 
* https://dev.to/spukas/3-reasons-to-usereducer-over-usestate-43ad 
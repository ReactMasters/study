# React Custom Hooks (React v.16.8+)

# React Hooks

---

개념적으로 React 컴포넌트는 함수에 더 가깝다. 리액트 훅(React Hooks)은 함수형 컴포넌트에서 계층의 변화 없이 상태 관련 로직을 재사용할 수 있도록 도와준다. 대표적으로 함수형 컴포넌트에서 상태 관리를 할 수 있는 `useState`, 그리고 렌더링 직후 작업을 설정하는 `useEffect` 가 있다. 

## useState

`useState` 는 함수형 컴포넌트에 가변적인 상태를 더하는 Hook이다. 초기 상태 값을 인수로 가지며, 현재 상태와 그 상태를 업데이트할 수 있는 함수를 반환한다. 

```jsx
import React, { useState } from 'react';

function Example() {
	const [state, setState] = useState(*initial_state*);
	...
}
```

## useEffect

`useEffect` 는 함수 컴포넌트에서 side effect를 수행하는 Hook이다. 데이터 가져오기, 구독(subscription) 설정하기, 수동으로 리액트 컴포넌트의 DOM 수정하기 등의 기능이 모두 side effect(혹은 effect)이다. 이 때, 리액트는 effect가 수행되는 시점엔 이미 DOM이 업데이트되었음을 보장한다.

`useEffect`는 리액트에게 컴포넌트가 렌더링 이후에 어떤 일을 수행하는지 알려주며, `componentWillUnmount`, `componentDidMount`, `componentWillUpdate`가 합쳐진 것으로 볼 수 있다. 

```jsx
import React, { useState, useEffect } from 'react';

function Example(){
	const sayHello = () => console.log('Hello');
	const [number, setNumber] = useState(0);
	const [aNumber, setAnumber] = useState(0);
	// number가 업데이트될 때에만 sayHello 이펙트 수행
	useEffect(sayHello, [number]); 
	
	return (
		<div>
			<div>Hi</div>
			<button onClick={() => setNumber(number + 1)} />
			<button onClick={() => setAnumber(aNumber + 1)} />
		</div>
	);
};

```

# React Custom Hooks를 만드는 방법

---

# 유용한 React Custom Hooks

---

아래 리액트 커스텀 훅은 [노마드코더](https://nomadcoders.co/)의 실전형 리액트 Hooks 10개 강의에서 배운 것을 정리하였다. 

- useInput

```jsx
import { useState } from "react";

const useInput = ( initialValue, validator ) => {
	const [value, setValue] = useState(initialValue);
	const onChange = (event) => {
		const {
			target: { value }
		} = event;
		let willUpdate = true;
		if(typeof validator === "function"){
			willUpdate = validator(value);
		}
		if(willUpdate){
			setValue(value);
		}
	};
	return { value, onChange };
};

const App = () => {
  const maxLen = (value) => value.length <= 10;
  const name = useInput("Mr.", maxLen);
  const email = useInput("@", maxLen);

  return (
    <div>
      <h1>Hi</h1>
      <input placeholder="Name" {...name} />
      <input placeholder="Email" {...email} />
    </div>
  );
};
export default App;
```

- useTabs

```jsx

import { useState } from "react";

const useTabs = ( initialTab, allTabs ) => {
	if(!allTabs || !Array.isArray(allTabs)){
    return;
  }
  const [currentIndex, setCurrentIndex] = useState(initialTab);
  return {
    currentItem: allTabs[currentIndex],
		changeItem: setCurrentIndex,
  };
};

const content = [
  {
    tab: "Section 1",
    content: "I'm the content of Section 1."
  },
  {
    tab: "Section 2",
    content: "I'm the content of Section 2."
  }
];

const App = () => {
  const { currentItem, changeItem } = useTabs(0, content);

  return (
    <div>
      <h1>Hi</h1>
      {content.map((section, index) => (
        <button onClick={() => changeItem(index)}>{section.tab}</button>
      ))}
      <div>{currentItem.content}</div>
    </div>
  );
};
export default App;
```

- useTitle

```jsx
import { useEffect, useState } from "react";

const useTitle = (initialTitle) => {
	const [title, setTitle] = useState(initialTitle);
	const updateTitle = () => {
		const htmlTitle = document.querySelector("title");
		htmlTitle.innerText = title;
	};
	useEffect(updateTitle, [title]);
	return setTitle;
};

const App = () => {
  const titleUpdator = useTitle("Loading...");
  return (
    <div>
      <h1>Hi</h1>
    </div>
  );
};
export default App;
```

- useClick

```jsx
import { useRef, useEffect } from "react";

const useClick = (onClick) => {
	const element = useRef();
	useEffect(() => {
		if(element.current){
			element.current.addEventListener("click", onClick);
		}
    return () => {
      if(element.current){
        element.current.removeEventListener("click", onClick);
      }
    };
	}, []);
  return element;
};

const App = () => {
  const sayHello = () => console.log("hello");
  const title = useClick(sayHello);
  return (
    <div>
      <h1 ref={title}>Hi</h1>
    </div>
  );
};
export default App;
```

비슷하게 useHover도 만들 수 있다. click 이벤트에서  hover 이벤트로만 바꿔주면 된다. 

- useConfirm: 사용자가 무엇을 하기 전에 confirm메세지를 보여주는 Hook.

```jsx
const useConfirm = (message = "", onConfirm, onCancel) => {
  if (onConfirm && typeof onConfirm !== "function") {
    return;
  }
  if (onCancel && typeof onCancel !== "function") {
    return;
  }
  const confirmAction = () => {
    if (window.confirm(message)) {
      onConfirm();
    } else {
      onCancel();
    }
  };
  return confirmAction;
};

const App = () => {
  const deleted = () => console.log("Deleted");
  const aborted = () => console.log("Aborted");
  const confirmDelete = useConfirm("Are you sure?", deleted, aborted);

  return (
    <div>
      <h1>Hi</h1>
      <button onClick={confirmDelete}>Delete</button>
    </div>
  );
};
export default App;
```

- usePreventLeave

```jsx
const usePreventLeave = () => {
  const eventlistener = (event) => {
    event.preventDefault();
    event.returnValue = "";
  };
  const enablePrevent = () =>
    window.addEventListener("beforeunload", eventlistener);
  const disablePrevent = () =>
    window.removeEventListener("beforeunload", eventlistener);
  return { enablePrevent, disablePrevent };
};

const App = () => {
  const { enablePrevent, disablePrevent } = usePreventLeave();

  return (
    <div>
      <h1>Hi</h1>
      <button onClick={enablePrevent}>Protect</button>
      <button onClick={disablePrevent}>Unprotect</button>
    </div>
  );
};
export default App;
```

- useBeforeLeave

```jsx
import { useEffect } from "react";

const useBeforeLeave = (onBefore) => {
  if (typeof onBefore !== "function") {
    return;
  }
  const handle = (event) => {
    const { clientY } = event;
    if (clientY < 0) {
      onBefore();
    }
  };
  useEffect(() => {
    document.addEventListener("mouseleave", handle);
    return () => document.removeEventListener("mouseleave", handle);
  }, []);
};

const App = () => {
  const begging = () => console.log("Pls don't leave");
  useBeforeLeave(begging);
  return (
    <div>
      <h1>Hi</h1>
    </div>
  );
};
export default App;
```

- useFadeIn

```jsx
import { useEffect, useRef } from "react";

const useFadeIn = (duration = 1, delay = 0) => {
  if (typeof duration !== "number" || typeof delay !== "number") {
    return;
  }
  const element = useRef();
  useEffect(() => {
    if (element.current) {
      const { current } = element;
      current.style.transition = `opacity ${duration}s ease-in-out ${delay}s`;
      current.style.opacity = 1;
    }
  });

  return { ref: element, style: { opacity: 0 } };
};

const App = () => {
  const fadeInH1 = useFadeIn(1, 2);

  return (
    <div>
      <h1 {...fadeInH1}>Hi</h1>
    </div>
  );
};
export default App;
```

- useNetwork

```jsx
import { useEffect, useState } from "react";

const useNetwork = (onChange) => {
  const [status, setStatus] = useState(navigator.onLine);
  const handleChange = () => {
    if (typeof onChange === "function") {
      onChange(navigator.onLine);
    }
    setStatus(navigator.onLine);
  };
  useEffect(() => {
    window.addEventListener("online", handleChange);
    window.addEventListener("offline", handleChange);
    return () => {
      window.removeEventListener("online", handleChange);
      window.removeEventListener("offline", handleChange);
    };
  }, []);
  return status;
};

const App = () => {
  const handleNetworkChange = (online) => {
    console.log(online ? "Online" : "Offline");
  };
  const onLine = useNetwork(handleNetworkChange);
  return (
    <div>
      <h1>{onLine ? "Online" : "Offline"}</h1>
    </div>
  );
};
export default App;
```

- useScroll

```jsx
import { useEffect, useState } from "react";

const useScroll = () => {
  const [state, setState] = useState({
    x: 0,
    y: 0
  });
  const onScroll = () => {
    setState({
      x: window.scrollX,
      y: window.scrollY
    });
  };
  useEffect(() => {
    window.addEventListener("scroll", onScroll);
    return () => {
      window.removeEventListener("scroll", onScroll);
    };
  }, []);
  return state;
};

const App = () => {
  const { y } = useScroll();
  return (
    <div style={{ height: "1000vh" }}>
      <h1 style={{ position: "fixed", color: y > 100 ? "red" : "blue" }}>Hi</h1>
    </div>
  );
};
export default App;
```

- useFullscreen
- useNotifiaction
- useAxios
# react-router-dom 정리

오늘은 웹 앱에서 리액트 라우터를 쓸 때 사용하는 react-router-dom에 대해 정리해보려한다. 이 글은 다음의 순서로 구성되어있다.

1. 브라우저 히스토리 API 
2. React Router의 주요 컴포넌트 세 가지: routers, route matchers, navigation.
3. React Router에서 제공하는 Hooks

리액트가 권장하는 Single Page Application (SPA)에서는 필요시에는 Data를 서버에 요청하지만 다른 나머지 정보들은 클라이언트 단에서 페이지 자체**라우팅**으로 해결한다. 즉, SPA를 구성하려면 클라이언트에서 서버로 페이지 전환 요청 없이 **페이지 전환**과 **뒤로가기**가 가능해야 한다. 

이 개념을 적용하기 위해 간단하게 JavaScript의 브라우저 히스토리 API에 대해 알아보자.

## 브라우저 히스토리 API

---

- DOM의 `Window` 객체의 `[History](https://developer.mozilla.org/ko/docs/Web/API/Window/history)` 객체는 브라우저의 세션 기록(현재 페이지를 불러온 탭 혹은 프레임이 방문했던 페이지)을 조작할 때 사용한다.
- Browser History API는 HTML5 history API를 지원하는 웹 브라우저에서 쓰인다.

아래는 브라우저 히스토리 API를 사용하여 SPA를 구성한 코드 예시이다. 

```jsx
import React, { Component } from 'react';
import './App.css';

class App extends Component {
	state = {
		pageName: ' ', // 현재 페이지를 상태 값으로 관리
	};

	componentDidMount(){
		window.onpopstate = (event) => {
			this.onChangePage(event.state);
		};
	};

	onChangePage = (pageName) => {
		this.setState({ pageName });
	};

	onFirstBtnClick = () => {
		const pageName = 'firstPage';
		window.history.pushState(pageName, '', '/firstPage');
		this.onChangePage(pageName);
	};

	onSecondBtnClick = () => {
		const pageName = 'secondPage';
		window.history.pushState(pageName, '', '/secondPage');
		this.onChangePage(pageName);
	};

	render(){
		const { pageName } = this.state;
		return (
			<div>
				<button className='firstBtn' onClick={this.onFirstBtnClick}>First</button>
				<button className='secondBtn' onClick={this.onSecondBtnClick}>Second</button>
				{!pageName && <Home />}
				{pageName === 'firstPage' && <FirstPage />}
				{pageName === 'secondPage' && <SecondPage />}
			</div>
		);
		);
	};
}

function FirstPage(){
	return <h2>First Page</h2>;
}

function SecondPage(){
	return <h2>Second Page</h2>;
}

export default App;
```

히스토리 API를 사용할 때 번거로움을 없애고자 브라우저 히스토리 API를 내부적으로 이용하는 `react-router-dom`을 사용한다. 

## [React Router의 핵심 컴포넌트 세 가지](https://reactrouter.com/web/guides/primary-components)

---

### 1. Routers: <BrowserRouter>, <HashRouter>

웹 앱에서 `react-router-dom`은 `BrowserRouter`와 `HashRouter` 두 가지를 제공한다.

`<BrowserRouter>`와 `<HashRouter>` 의 차이는 URL을 저장하는 방식과 웹서버와 커뮤니케이션하는 방식에서 발생한다. 

- `<BrowserRouter>`
    - 일반적인 URL path를 사용한다.
    - 클라이언트 측의 React Router가 관리하는 URL을 통해 웹서버가 같은 페이지를 탐색한다.
    - history API를 활용해 UI를 업데이트 하기 때문에, IE 9 이하 버전에서는 사용 불가하다.
    - 동적인 페이지에 적합하다.
    - 위의 특징으로 인해 서버에 추가적인 세팅이 필요하다. 페이지의 유무를 서버에 알려줘야하며 서버 세팅 시 검색엔진에 신경써야 한다.
    - 배포가 복잡하다 (github pages에서 설정하기 복잡하다).
- `<HashRouter>`
    - URL에 hash(#)를 활용한 라우터로, 주소에 #가 붙는다.
    - 정적인 페이지에 적합하다.
    - 검색 엔진으로 읽지 못한다. #값을 서버가 읽지 못해 서버가 페이지의 유무를 알지 못하기 때문이다. 때문에 **HashRouter는 잘 사용하지 않는다**.
    - #값은 서버로 보내지지 않으며, 때문에 별도의 웹 서버가 필요 없다.
    - 배포가 간편하다 (github pages에서 설정하기 간편하다).

### 2. Route Matchers: <Switch>, <Route>

- `<Route>` 컴포넌트는 공식 문서에서 **가장 중요한 Low Level 컴포넌트**라고 표현하고 있다. `<Route>`는 해당 경로가 현재 경로와 일치할 때 UI의 일부를 render한다.
    - 경로가 일치한지 체크할 때, 전체 URL을 매치하지 않고, **처음** 부분은 매치한다. 그러므로 `<Route path='/'>`는 **항상** 매칭된다.
    - exact를 사용하면 URL이 정확하게 매치되었을 때만 Route 태그를 보여준다.
- `<Switch>` 컴포넌트는 여러 라우팅 경로(path)가 존재할 때, 현재 경로와 일치하는 경로만 표시한다. break가 모두 적용되어있는 Switch case와 동작 방식이 같다.
    - 탐색 완료하면, 해당 `<Route>`로 렌더링하고 나머지는 무시한다. 때문에 더 구체적인 경로(e.g., `/contact/:id`)를 덜 구체적인 경로(e.g., `/contact`)보다 뒤쪽에 위치하면 안된다. 즉, **depth가 가장 깊은 URL부터 먼저 보여지게 해야한다.**
    - 해당하는 `<Route>`가 없을 시에는, null로 렌더링한다.
    - `react-router-dom` 버전 5.1 이후로, `<Switch>` 바깥에서 `<Route>` 엘리먼트를 렌더링할 수 있다. 이 때 공식문서에서는 [useRouteMatch](https://reactrouter.com/web/api/Hooks/useroutematch) 훅을 사용하는 것을 권장하고있다.

```jsx
<Router>
	<Switch>
		<Route path='/about'>
			<About />
		</Route>
		<Route path='/contact/:id'>
			<Contact />
		</Route>
		<Route path='/contact'>
			<AllContacts />
		</Route>
		<Route exact path='/'>
			<Home />
		</Route>
	</Switch>
</Router>
```

### 3. Navigation (or Route Changers): <Link>

React Router는 어플리케이션 내에서 링크를 생성할 수 있는 `<Link>` 컴포넌트를 제공한다. `<Link>`가 렌더되면, HTML의 `<a>`태그처럼 작동한다. `<a>`태그와 다르게 서버로의 요청 없이 클라이언트 측에서 렌더링한다.

```jsx
<Link to='/'>Home</Link>
```

아래는 `react-router-dom`을 사용해 SPA를 구성한 예시이다. 

```jsx
class App extends Component {
	render(){
		return (
			<BrowserRouter>
				<ul>
					<li><Link to='/'><button>home</button></Link></li>
					<li><Link to='/firstPage'><button>firstPage</button></Link></li>
					<li><Link to='/secondPage'><button>secondPage</button></Link></li>
				</ul>
				<Switch>
					<Route exact path='/'><Home /></Route>
					<Route path='/firstPage'><FirstPage /></Route>
					<Route path='/secondPage'><SecondPage /></Route>
				</Switch>
			</BrowserRouter>
		);
	}
}
export default App;
```

## [React Router에서 제공하는 Hooks](https://reactrouter.com/web/api/Hooks)

---

- 반드시 React 16.8 버전, react-router-dom 5.1 버전 이상에서 사용해야한다.

### useHistory

history 인스턴스에 접근할 수 있게 해준다. 

```jsx
import { useHistory } from 'react-router-dom';

function HomeButton(){
	const history = useHistory();

	function handleClick(event){
		const data = event.target.value;
		history.push('/', {
			message: "Go Home",
			data,
		});
	}

	return (
		<button onClick={handleClick}>Go Home</button>
	);
}
```

### useLocation

사용자가 현재 머물러있는 페이지에 대한 정보를 알려주는 훅으로, defaultProps 중 하나인 `location` 객체를 반환한다. URL이 바뀔 때마다 새로운 `location`을 반환하는 `useState`라고 볼 수 있다. 

```jsx
import React, { useEffect } from 'react';'
import {
  BrowserRouter as Router,
  Switch,
  useLocation
} from 'react-router-dom';

function App(){
	const { pathname, search } = useLocation();
	// URL이 http://localhost:3000/firstPage?keyword=react 일 경우
	console.log(pathname); // 쿼티스트링을 제외한 /firstPage 출력
	console.log(search); // 쿼티스트링 ?keyword=react 출력

	useEffect(() => {
		ga.send(['pageview', location.pathname]);
	}, [location]);

  return (
		<Router>
			<Switch>...</Switch>
		</Router>
	);
}
export default App;
```

### useParams

URL parameters를 key-value의 형태로 얻을 수 있는 훅이다. `useParams` 를 사용하기 위해선 동적 라우팅 설정을 해주어야 한다. 

아래 코드는 콜론(`:`)을 이용하여 동적라우팅 설정을 해주었다. 

```jsx
import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './Home';

function App(){
	return (
		<BrowserRouter>
			<Switch>
				<Route exact path='/firstPage/:id' component={ Home } />
			</Switch>
		</BrowserRouter>
	);
}
export default App;
```

예를 들어 Home 컴포넌트에서 id 값을 읽어오려면, 기존에는 현재 `<Route>`의  `[match.params.id](http://match.params.id)`로 접근해야 했다. 아래 코드와 같이 `useParams` 를 이용하면 더 간단하게 접근 가능하다. 때문에 `useParams` 훅은 글 상세조회, 유저 상세조회 등의 API를 이용할 때 활용하기 쉽다. 

```jsx
import React from 'react';
import { useParams } from 'react-router-dom';

const Home = () => {
	const { id } = useParams();
	
	return (
		<></>
	);
};
export default Home;
```

다만, Context API를 사용하기 때문에 `<Route>` 의 하위에서만 값을 받을 수 있다. 

### useRouteMatch

URL Pattern을 체크하는 훅으로, URL Pattern Match 처리를 할 때 사용하면 좋다. 

인자로 `<Route>` 컴포넌트의 프로퍼티(`path`, `strict`, `sensitive`, `exact`)를 받을 수 있으며, `path` 프로퍼티와 현재 페이지의 URL이 일치할 경우 해당 `path` 의 `match` 객체를 반환한다. 일치하지 않을 경우엔 `null` 을 반환한다.

아무 인자도 넘겨주지 않는다면 `withRouter` HoC처럼 제일 가까운 부모 `<Route>`컴포넌트의 `match`값을 반환한다. 

`useParams` 와 달리 Context에 얽매이지 않고 광범위하게 사용 가능하다.  

```jsx
import { useRouteMatch } from 'react-router-dom';
function App(){
	const match = useRouteMatch({
		path: '/firstPage/:1',
		strict: true,
		sensitive: true,
	});
	return <div>{match ? <FirstPage match={match} /> : <NotFound />}</div>;
}
```

## 참고자료

[https://developer.mozilla.org/ko/docs/Web/API/History_API](https://developer.mozilla.org/ko/docs/Web/API/History_API)

[https://wonit.tistory.com/232?category=793048](https://wonit.tistory.com/232?category=793048)

[https://stackoverflow.com/questions/51974369/what-is-the-difference-between-hashrouter-and-browserrouter-in-react](https://stackoverflow.com/questions/51974369/what-is-the-difference-between-hashrouter-and-browserrouter-in-react)

[https://reactrouter.com/web/guides/primary-components](https://reactrouter.com/web/guides/primary-components)
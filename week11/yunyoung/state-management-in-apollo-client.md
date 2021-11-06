리액트에는 다양한 상태 관리 솔루션이 있습니다. ContextAPI, Redux, MobX, 그리고 Apollo Client 등.. 모두 로컬에서 전역 상태관리를 하기 위해 사용할 수 있습니다.  

이 포스트에서는 그 중 Apollo Client를 이용한 상태 관리에 대해 자세하게 다루어보도록 하겠습니다. 



**Note:** 이 포스트에서 다루는 Apollo Client는 **Apollo Client 3**를 말합니다.



# State management

먼저 상태 관리 라이브러리를 왜 사용해야 할까요? 

* **다중 계층 컴포넌트에서 데이터와 메소드 접근의 복잡성을 해결하기 위해**: 기능 단위의 컴포넌트로 구성된 SPA Framework에세는 부모-자식 관계로 Scope가 이루어져 있습니다. 그 때문에 각 컴포넌트 간 state와 method 접근이 복잡해질 수 있습니다. 



상태 관리 라이브러리는 저장소(storage)를 관리하고, 상태(state)를 업데이트하고, 이를 UI에 반영합니다 (reactivity).

## 1. Storage

모든 어플리케이션은 일부 데이터를 유지할 필요가 있습니다. 이 데이터는 클라이언트 단에서 구성한 **local state**일 수도 있고, 백엔드 서비스의 **remote state**의 부분일 수 있습니다. 

local state와 remote state 데이터가 혼합된 데이터를 관리하는 것은 쉬운 일이 아닙니다. 특히, 어플리케이션의 상태를 업데이트할 때, 훨씬 더 복잡해질 수 있습니다. 

## 2. Update State

[Command-Query-Separation](https://khalilstemmler.com/articles/oop-design-principles/command-query-separation/) 디자인 원칙에서는 operations를 두 가지 종류로 나누고 있습니다: `commands` 그리고 `queries`.

> a *method* is either a `command` that performs an action OR a `query` that returns data to the caller, but never both. 

GraphQL에서는 `mutations`와 `queries`가 각각 대응됩니다.

클라이언트 앱에서 operation이 호출된 후, 그에 따라 local state를 업데이트할 필요가 있습니다.

## 3. Reactivity

저장소 안의 데이터가 바뀌면, 관련된 UI가 바뀐 데이터를 보일 수 있도록 알려야 합니다. 



|              | Redux              | Mobx            | ContextAPI          | Apollo Client               |
| ------------ | ------------------ | --------------- | ------------------- | --------------------------- |
| Storage      | Plain JS Object    | Plain JS Object | Plain JS Object     | Normalized cache            |
| Update State | Actions + Reducers | Actions         | useReducer (or not) | Cache APIs                  |
| Reactivity   | Connect            | Decorators      | useContext          | (Auto) Broadcast to Queries |



# State Management in Apollo Client

다음은 Apollo Client의 work flow와 간단한 예시입니다. 

### 1. Cache configuration

```jsx
import { ApolloClient, InMemoryCache } from '@apollo/client';

const cache = new InMemoryCache();
const client = new ApolloClient({
  uri: 'https://localhost:4000/graphql',
  cache
});
```

### 2. Feching data (using the `useQuery` hook)

`useQuery` 훅은

- 요청을 보내고,
- 비동기 상태를 업데이트하며 (loading, data, error)
- 응답을 정규화하고 캐싱한 후,
- 같은 데이터 요청이 후에 또 들어왔을 경우를 대비해 캐시에 로컬 복사본을 저장합니다.

```jsx
import React from 'react';
import { gql, useQuery } from '@apollo/client';

export const GET_ALL_TODOS = gql`
	query GetAllTodos {
		todos {
			id
			text
			completed
		}
`;

export default function TodosList(){
	const { loading, data, error } = useQuery( GET_ALL_TODOS );
	
	...
}
```

### 3. Changing data (using the `useMutation` hook)

```jsx
import React from 'react';
import { gql, useQuery } from '@apollo/client';

export const GET_ALL_TODOS = gql`
	query GetAllTodos {
		todos {
			id
			text
			completed
		}
`;

export default function TodosList(){
	const { loading, data, error } = useQuery( GET_ALL_TODOS );
	
	...
}
```



위의 예제에서도 알 수 있듯 Apollo Client에서 상태관리의 핵심은 캐시(`InMemoryCache`)입니다. 

## Cache in Apollo Client 3

Apollo Client는 GraphQL queries로 가져온 데이터를 local, normalized, in-memory cache에 저장합니다. 이는 이미 캐싱된 데이터에 대한 요청에 대해 별도의 네트워크 요청 없이도 즉시 응답 가능하도록 합니다. 



먼저 **데이터를 어떻게 저장**할까요?

Apollo Client의 `InMemoryCache`는 *hierarchical*한 쿼리 응답 개체를 정규화(normalize)하여 내부 데이터 저장소에 저장합니다. 그 과정은 다음과 같습니다.

1. 응답 객체에 포함된 모든 식별 가능한 객체에 대해 고유한 **cache ID**(e.g., `__typename` + `_id`) 를 생성합니다.

> cache ID 형식을 커스터마이징할 수 있습니다(https://www.apollographql.com/docs/react/caching/cache-configuration/#customizing-cache-ids).

1. 객체가 포함된 필드는 **레퍼런스**로 대체합니다 (**cache ID** 생성이 실패한 경우 이 단계는 생략됩니다).
2. normalize한 후, ID 별로 플랫 룩업 테이블(flat lookup table)에 저장합니다.
3. 후에 들어오는 객체가 기존 객체와 동일한 ID일 경우, 해당 객체의 필드를 병합합니다.



저장된 Apollo Client의 캐시는 다음과 같습니다.

```graphql
{
	"Todo:1": { __typename: "Todo", id: 1, text: "First Todo", ...},
	"Todo:2": { __typename: "Todo", id: 2, text: "Second Todo", ...},
	...
	"ROOT_QUERY": { __typename: "Query", todos: {...} ...},
	...
}
```



### Customizing the behavior of cached fields

- (스키마에 정의되지 않은) local-only 필드를 위한 **field policies**

local-only 필드는 `@client`로 지정할 수 있습니다.

```graphql
query GetTodo($todoId: ID!){
	todo(id: $todoId){
		id
		text
		completed
		isLiked @client # This is a local-only field
	}
}
```

이를 위한 field policies를 정의해보면 다음과 같습니다.

```jsx
const cache = new InMemoryCache({
	typePolicies: { // Type policy map
		Todo: {
			fields: { // Field policy map for the Todo type
				isLiked: { // Field policy for the isLiked field
					read(_, { variables }){ // The read function for the isLiked field
						return localStorage.getItem('LIKED').includes(
							variables.todoId
						);
					};
				}
			}
		}
	}
});
```

위의 예시에서는 `isLiked` 필드를 위한 `read` function을 정의하고 있습니다. 클라이언트가 쿼리를 호출하면 캐시는 `read` 함수를 호출하여, 필드의 캐시값 대신 리턴 값을 반환합니다.

read 함수의 두번째 인자에서 접근 가능한 프로퍼티와 함수는 [링크](https://www.apollographql.com/docs/react/caching/cache-field-behavior/#fieldpolicy-api-reference)를 참조하시길 바랍니다.



- **reactive variables**

  Apollo client에서 local state는 캐시 외에도 reactive variables를 이용해 저장할 수 있습니다.

   - reactive variables는 어플리케이션 어디에서든 GraphQL operation 없이 읽고 수정할 수 있습니다.
  - 데이터 정규화를 할 필요 없이 원하는 형태로 데이터를 저장할 수 있습니다.
  - 필드 값이 reactive variable을 따른다면, reactive variable 값이 바뀔 따마다 자동으로 필드는 업데이트됩니다.

reactive variables를 사용하는 방법은 간단합니다. makeVar 함수로 초기화한 후, `useReactiveVar` 훅을 이용해 값을 읽을 수 있습니다.

```jsx
// apollo.js
import { makeVar } from '@apollo/client'
import AsyncStorage from '@react-native-async-storage/async-storage';6

export const isLoggedInVar = makeVar(false); 
export const tokenVar = makeVar("");
const TOKEN = 'token';

export const logUserIn = async (token) => {
	await AsyncStorage.setItem(TOKEN, token);
	isLoggedInVar(true);
	tokenVar(token);
}

export const logUserOut = async (token) => {
	await AsyncStorage.setItem(TOKEN, token);
	isLoggedInVar(false);
	tokenVar(null);
}
```

```jsx
// App.js
import { isLoggedInVar } from './apollo';
import { useReactiveVar } from '@apollo/client';

const App = () => {
	const isLoggedIn = useReactiveVar(isLoggedInVar);
	if(isLoggedIn){
		...
	}
};
```

값을 업데이트하는 방법은 다음과 같습니다.

```jsx
import { isLoggedInVar } from './apollo';

... 
isLoggedInVar(true);
...
```



다음 포스트에서는 cache normalization에 대해 자세하게 알아보도록 하겠습니다. 



# 참고자료

https://www.apollographql.com/blog/apollo-client/caching/dispatch-this-using-apollo-client-3-as-a-state-management-solution/

https://www.apollographql.com/blog/community/frontend/first-impressions-with-apollo-client-3/

https://www.apollographql.com/docs/react/local-state/local-state-management/
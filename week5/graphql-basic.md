# The Basic of Graphql with Apollo Client

### Aplollo Client

> Apollo Client is a comprehensive state management library for JavaScript that enables you to manage both local and remote data with GraphQL. Use it to fetch, cache, and modify application data, all while automatically updating your UI.

### Set-up

```js
npm install @apollo/client graphql
```

## index.js

- Initialize ApolloClient, passing its constructor a configuration object with **uri** and **cache** fields
- **uri** specifies the URL of our GraphQL server.
- **cache** is an instance of **InMemoryCache**, which Apollo Client uses to cache query results after fetching them

```js
import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
  gql,
} from '@apollo/client';

const client = new ApolloClient({
  uri: 'https://48p1r2roz4.sse.codesandbox.io',
  cache: new InMemoryCache(),
});
```

- Call **client.query()** with the query string

```js
client
  .query({
    query: gql`
      query GetRates {
        rates(currency: "USD") {
          currency
        }
      }
    `,
  })
  .then((result) => console.log(result));

ReactDOM.render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById('root')
);
```

## App.js

- Whenever this component renders, the **useQuery** hook automatically executes our query and returns a result object containing **loading, error, and data** properties

```js
import { useQuery, gql } from '@apollo/client';

const EXCHANGE_RATES = gql`
  query GetExchangeRates {
    rates(currency: "USD") {
      currency
      rate
    }
  }
`;

function ExchangeRates() {
  const { loading, error, data } = useQuery(EXCHANGE_RATES);

  if (loading) return <p>Loading...</p>;
  if (error) return <p>Error :(</p>;

  return data.rates.map(({ currency, rate }) => (
    <div key={currency}>
      <p>
        {currency}: {rate}
      </p>
    </div>
  ));
}

function App() {
  return (
    <div>
      <h2>Apollo app</h2>
      <ExchangeRates />
    </div>
  );
}

export default App;
```

Reference : https://www.apollographql.com/docs/react/

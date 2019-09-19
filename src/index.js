import React from "react";
import { render } from "react-dom";
import { ApolloClient } from "apollo-client";
import { ApolloProvider } from "@apollo/react-hooks";
import { InMemoryCache } from "apollo-cache-inmemory";
import { ApolloLink } from "apollo-link";

import { link } from "./graphql/link";
import App from "./App";

import "./index.css";

const timeStartLink = new ApolloLink((operation, forward) => {
  console.log("timeStartLink running");
  operation.setContext({ start: new Date() });
  return forward(operation);
});

const logTimeLink = new ApolloLink((operation, forward) => {
  return forward(operation).map(data => {
    const time = new Date() - operation.getContext().start;
    console.log(
      `logTimeLink running: operation ${operation.operationName} took ${time} to complete`
    );
    return data;
  });
});

const client = new ApolloClient({
  cache: new InMemoryCache(),
  link: link
  // link: timeStartLink.concat(logTimeLink).concat(link)
});

// this should proporgate the link changes?
client.link = timeStartLink.concat(logTimeLink).concat(link);

render(
  <ApolloProvider client={client}>
    <App />
  </ApolloProvider>,
  document.getElementById("root")
);

import React from 'react';
import logo from './logo.svg';
import './App.css';

import {Auth, API, graphqlOperation } from 'aws-amplify';
import awsconfig from './aws-exports';
import { withAuthenticator } from 'aws-amplify-react';
import * as queries from './graphql/queries'
import * as mutations from './graphql/mutations'

Auth.configure(awsconfig);
API.configure(awsconfig);

function updateTodo(todo, newDescription) {
  todo['description'] = newDescription;
  API.graphql(graphqlOperation(mutations.updateTodo, {input: todo}))
}

function deleteTodo(todo) {
  API.graphql(graphqlOperation(mutations.deleteTodo, {input: {'id':todo['id']}}))
}

function App() {
  const userTodos = API.graphql(graphqlOperation(queries.listTodos, {filter:{'name':{'eq':'hecobrith'}}}));
  console.log(userTodos)
  // list all items of todo
  const allTodos = API.graphql(graphqlOperation(queries.listTodos));
  console.log(allTodos)
  // get one todo query 
  const getOneTodo = API.graphql(graphqlOperation(queries.getTodo, {id:"db6e0954-4728-4b64-9bec-dfe0e81ba422"})).then(function(todo){
    //updateTodo(todo['data']['getTodo'], "new Desc")
    //deleteTodo(todo['data']['getTodo']);
  })
  console.log(getOneTodo)

  Auth.currentAuthenticatedUser({
    bypassCache: false
  }).then( (user) => {
    console.log("User" + JSON.stringify(user));
    //const todo = {name: user['username'], description:"new todo" };
    //const newTodo = API.graphql(graphqlOperation(mutations.createTodo, {input: todo}))
  }).catch(error => console.error(error))

  return (
    <div className="App">
      <header className="App-header">
        <img src={logo} className="App-logo" alt="logo" />
        <p>
          hello world
        </p>
        <a
          className="App-link"
          href="https://reactjs.org"
          target="_blank"
          rel="noopener noreferrer"
        >
          Learn React
        </a>
      </header>
    </div>
  );
}

// The magic here is the Auth section making it easyer to sign in and sing out
export default withAuthenticator(App, { includeGreetings:true });

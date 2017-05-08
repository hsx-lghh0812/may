import React from 'react';
import ReactDOM from 'react-dom';

import { createStore, combineReducers, applyMiddleware } from 'redux'
import { Provider } from 'react-redux'

import createHistory from 'history/createBrowserHistory'
import { Route } from 'react-router'

import { ConnectedRouter, routerReducer, routerMiddleware, push } from 'react-router-redux'

import reducers from './reducers'

import App from './App';
import index from "./webapp/index/index"
import login from "./webapp/login/login"
import './index.css';

//Create a history of your choosing (we're using a browser history in this case)
const history = createHistory()

// Build the middleware for intercepting and dispatching navigation actions
const middleware = routerMiddleware(history)

// Add the reducer to your store on the `router` key
// Also apply our middleware for navigating
const store = createStore(
  combineReducers({
    ...reducers,
    router: routerReducer
  }),
  applyMiddleware(middleware)
)
//另一种写法：
//import reducer from './reducers'
//const store = createStore(reducer)
//然后再reducers中先写index.js:
//const rootReducer = combineReducers({
//  todos
//})
//export default rootReducer

// Now you can dispatch navigation actions from anywhere!
// store.dispatch(push('/foo'))
ReactDOM.render(
  <Provider store={store}>
    { /* ConnectedRouter will use the store from Provider automatically */ }
    <ConnectedRouter history={history}>
      <div>
        <Route exact path="/" component={App}/>
           <Route path="/index" component={index}/>
           <Route path="/login" component={login}/>
      </div>
    </ConnectedRouter>
  </Provider>,
  document.getElementById('root')
)
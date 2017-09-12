import React from 'react';
import ReactDOM from 'react-dom';
import { createStore, applyMiddleware } from 'redux';
import { Provider } from 'react-redux';
import thunk from 'redux-thunk';
import { AppContainer } from 'react-hot-loader';

import App from './components/App/App';

import reducer from './reducers/reducer';

const store = createStore(
  reducer,
  window.__REDUX_DEVTOOLS_EXTENSION__ && window.__REDUX_DEVTOOLS_EXTENSION__(),
  applyMiddleware(thunk)
);

const render = Component => (
  ReactDOM.render(
    <Provider store={store}>
      <AppContainer>
        <Component />
      </AppContainer>
    </Provider>,
    document.getElementById('app')
  )
);

render(App);

if (module.hot) {
  module.hot.accept('./components/App/App', () => {
    render(App);
  });
}

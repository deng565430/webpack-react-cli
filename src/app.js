import React from 'react';
import ReactDOM from 'react-dom';
import { AppContainer } from 'react-hot-loader'; // eslint-disable-line

import App from './components/App';

const root = document.getElementById('root');

const render = (Component) => {
  ReactDOM.hydrate(
    <AppContainer>
      <Component />
    </AppContainer>,
    root,
  )
}
render(App)

// 判断热更新
if (module.hot) {
  module.hot.accept('./components/App', () => {
    const NextApp = require('./components/App').default // eslint-disable-line
    render(NextApp)
  })
}


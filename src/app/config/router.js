import React from 'react'
import { Route, Redirect } from 'react-router-dom'

import TopicList from '../views/topic-list/index'
import TopicDetail from '../views/topic-detail/index'

/* const PrivateRoute = ({ isLogin, component: Component, ...rest}) => (
  <Route
    {...rest}
    render={
      (props) => (
        isLogin ?
          <component {...props} /> :
          <Redirect
            to={{
              pathname: '/user/login',
              search: `?from=${rest.path}`
            }}
          />
      )
    }
  />
) */

export default () => [
  // 默认走的路由 Redirect
  <Route path="/" render={() => <Redirect to="/list" />} exact key="home" />,
  <Route path="/list" component={TopicList} key="list" />,
  <Route path="/detail" component={TopicDetail} key="detail" />,
]

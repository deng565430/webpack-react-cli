import React from 'react';
import { Button } from 'antd-mobile';
import './app.css';

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: 2,
    }
  }
  render() {
    return <Button>{this.state.data}</Button>
  }
}

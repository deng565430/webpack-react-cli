import React from 'react';
import { Button } from 'antd-mobile';
import './app.css';

const imgUrl = require('./test.jpg');

export default class App extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      data: 2,
    }
  }
  render() {
    return (
      <div>
        <Button>{this.state.data}</Button>
        <img src={imgUrl} alt="" />
        <div className="img">
          222
        </div>
      </div>
    )
  }
}

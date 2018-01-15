import React from 'react'
import { observer, inject } from 'mobx-react'
import PropTypes from 'prop-types'
import { AppState } from '../../store/app.state'

@inject('appState') @observer
export default class ToplicList extends React.Component {
  static propTypes = {
    appState: PropTypes.instanceOf(AppState).isRequired,
  }
  constructor() {
    super()
    this.changeName = this.changeName.bind(this)
  }

  componentDidMount() {
    // do somethins
  }
  asyncBootstrap() {
    return new Promise((resolve) => {
      setTimeout(() => {
        this.props.appState.count = 3
        resolve(true)
      }, 1000);
    })
  }

  changeName(e) {
    this.props.appState.changeName(e.target.value)
  }
  render() {
    return (
      <div>
        <input type="text" onChange={this.changeName} />
        <span>{this.props.appState.msg}</span>
        <div>asddf</div>
      </div>
    )
  }
}


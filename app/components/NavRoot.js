import React, { Component } from 'react'
import Members from './Members'
import Home from './Home'
import MemberManage from './MemberManage'
import Report from './Report'
import {
  BackAndroid,
  NavigationExperimental
} from 'react-native'

const {
  CardStack: NavigationCardStack
} = NavigationExperimental

class NavRoot extends Component {
  constructor (props) {
    super(props)
    this._renderScene = this._renderScene.bind(this)
    this._handleBackAction = this._handleBackAction.bind(this)
  }

  componentDidMount () {
    BackAndroid.addEventListener('hardwareBackPress', this._handleBackAction)
  }
  componentWillUnmount () {
    BackAndroid.removeEventListener('hardwareBackPress', this._handleBackAction)
  }
  _renderScene (props) {
     const { route } = props.scene
     //console.log('navigation: ', this.props.navigation);
    //console.log('login: ', this.props.loginRout);
    if (route.key === 'members') {
      return <Members _handleNavigate={this._handleNavigate.bind(this)} />
    }

    if (route.key === 'home') {
      return <Home _handleNavigate={this._handleNavigate.bind(this)} />
    }

    if (route.key === 'memberManage') {
      return <MemberManage _handleBackAction={this._handleBackAction.bind(this)} _handleNavigate={this._handleNavigate.bind(this)} />
    }

    if (route.key === 'report') {
      return <Report _handleBackAction={this._handleBackAction.bind(this)} _handleNavigate={this._handleNavigate.bind(this)} />
    }
  }

  _handleBackAction () {
    if (this.props.navigation.index === 0) {
      return false
    }
    this.props.popRoute()
    return true
  }

  _handleNavigate (action) {
    switch (action && action.type) {
      case 'push':
        this.props.pushRoute(action.route)
        return true
      case 'back':
      case 'pop':
        return this._handleBackAction()
      default:
        return false
    }
  }

  render () {
    return (
      <NavigationCardStack
        navigationState={this.props.navigation}
        userState={this.props.isUser}
        loginFunc={this.props.loginRout}
        onNavigate={this._handleNavigate.bind(this)}
        renderScene={this._renderScene} />
    )
  }
}

export default NavRoot

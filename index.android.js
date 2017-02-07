/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {AppRegistry, Text } from 'react-native';
import { Provider } from 'react-redux';
import { createStore, applyMiddleware } from 'redux';
import reducers from './app/reducers';
import NavigationRootContainer from './app/containers/navRootContainer';

const store = createStore(reducers, {}, applyMiddleware());

 const Rmeal = () => (
   <Provider store = {store}>
     <NavigationRootContainer />
   </Provider>
)

AppRegistry.registerComponent('Rmeal', () => Rmeal);

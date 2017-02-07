//import { PUSH_ROUTE, POP_ROUTE } from '../constants/ActionTypes'
import { NavigationExperimental } from 'react-native'
import Realm from 'realm'
const {
 StateUtils: NavigationStateUtils
} = NavigationExperimental

// if(this.props.userState == 1){
//   var starter = 'root'
// }
// else{
//   var starter = 'setup'
// }

let realm = new Realm({
 schema: [{name: 'Names', primaryKey: 'id', properties:
   {id:'int', name: 'string'}
 }]
});

let allMembers = realm.objects('Names');
if(allMembers.length > 0){
  var firstScreen = 'home';
}else{
  var firstScreen = 'members';
}


const initialState = {
  index: 0,
  key: firstScreen,
  routes: [
    {
      key: firstScreen,
      title: 'Welcome Setup'
    }
  ]
}


function navigationState (state = initialState, action) {
  switch (action.type) {
    case 'PUSH_ROUTE':
      console.log('state: ', state)
      console.log('action: ', action)
      if (state.routes[state.index].key === (action.route && action.route.key)) return state
      return NavigationStateUtils.push(state, action.route)

    case 'POP_ROUTE':
      if (state.index === 0 || state.routes.length === 1) return state
      return NavigationStateUtils.pop(state)

    default:
      return state
  }
}

// You can also manually create your reducer::
// export default (state = initialState, action) => {
//   const {
//     index,
//     routes
//   } = state
//   console.log('action: ', action)
//   switch (action.type) {
//     case PUSH_ROUTE:
//       return {
//         ...state,
//         routes: [
//           ...routes,
//           action.route
//         ],
//         index: index + 1
//       }
//     case POP_ROUTE:
//       return index > 0 ? {
//         ...state,
//         routes: routes.slice(0, routes.length - 1),
//         index: index - 1
//       } : state
//     default:
//       return state
//   }
// }

export default navigationState

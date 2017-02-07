import { MEAL_RATE_UPDATED } from '../constants/ActionTypes'
export default (state={}, action) => {
  switch (action.type) {
    case MEAL_RATE_UPDATED:
       return {...state, mealrate: action.payload};
    default:
    return state;
  }
};

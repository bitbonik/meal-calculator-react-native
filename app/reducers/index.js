import { combineReducers } from 'redux';
import MealRate from './MealRate';
import navReducer from './navReducer';

export default combineReducers({
  mealrate: MealRate, navReducer:navReducer,
});

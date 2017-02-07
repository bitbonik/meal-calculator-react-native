import { POP_ROUTE, PUSH_ROUTE, MEAL_RATE_UPDATED, TDATA } from '../constants/ActionTypes'

export function updateMealRate(meal){
  return {
    type: MEAL_RATE_UPDATED,
    payload: meal
  }
}

export function push (route) {
  return {
    type: PUSH_ROUTE,
    route
  }
}

export function pop () {
  return {
    type: POP_ROUTE
  }
}

export function updateTdata (v) {
  return {
    type: TDATA,
    payload: v
  }
}

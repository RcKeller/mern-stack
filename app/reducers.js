import { combineReducers } from 'redux'
import { routerReducer as routing } from 'react-router-redux'
import { reducer as form } from 'redux-form'
import { entitiesReducer as entities, queriesReducer as queries } from 'redux-query'
import {responsiveStateReducer as screen} from 'redux-responsive'

import user from './views/Template/Login/ducks'

const rootReducer = combineReducers({
  // react-router-redux
  routing,
  //  redux-form
  form,
  //  redux-query
  entities,
  queries,
  //  redux-responsive (media query data in store)
  screen,
  // Isomorphic reducers (authN/Z)
  user
  // Client-side reducers
})

export default rootReducer

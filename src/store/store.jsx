import { applyMiddleware, combineReducers, compose,createStore,} from 'redux';
import PostsReducer from './reducers/PostsReducer';
import thunk from 'redux-thunk';
import { AuthReducer } from './reducers/AuthReducer';
//import rootReducers from './reducers/Index';
import todoReducers from './reducers/Reducers';
import { reducer as reduxFormReducer } from 'redux-form';


//members
import MemberReducer from './reducers/MemberReducer';

import {
    getAllCardReducer,
    getCardDetailsReducer,
  
    getAllProfileReducer,
    getProfileDetailsReducer,
  
    addProfileReducer,
    activeProfileReducer,
    saveProfileReducer
  } from "./reducers/cardReducers";

const middleware = applyMiddleware(thunk);

const composeEnhancers =
    window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const reducers = combineReducers({
    posts: PostsReducer,
    members:MemberReducer,
    //cards:{
        getAllCard:getAllCardReducer,
        getCardDetails:getCardDetailsReducer,
      
        getAllProfile:getAllProfileReducer,
        getProfileDetails:getProfileDetailsReducer,
      
        addProfile:addProfileReducer,
        activeProfile:activeProfileReducer,
        saveProfile:saveProfileReducer,    
    //},
    auth: AuthReducer,
		todoReducers,
	form: reduxFormReducer,	
	
});

//const store = createStore(rootReducers);

export const store = createStore(reducers,  composeEnhancers(middleware));

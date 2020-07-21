import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CONTACT,
  UPDATE_CONTACT,
  FILTER_CONTACT
 } from '../types';

 export default (state, action) => {
   switch(action.type) {
     case ADD_CONTACT:
       return {
         ...state,
         contacts: [...state.contacts, action.payload]
       };
      default:
        return state;
   }
 };
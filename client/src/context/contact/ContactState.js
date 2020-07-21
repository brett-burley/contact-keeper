import React, { useReducer } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ContactContext from './contactContext';
import ContactReducer from './contactReducer';
import {
  ADD_CONTACT,
  DELETE_CONTACT,
  SET_CURRENT,
  CLEAR_CONTACT,
  UPDATE_CONTACT,
  FILTER_CONTACT
} from '../types';

const ContactState = props => {
  const initState = {
    contacts: [
      {
        id: 1,
        name: "Ashley Applegate",
        email: "AA@gmail.com",
        phone: "111-111-1111",
        type: "personal"
      },
      {
        id: 2,
        name: "Brad Butler",
        email: "BB@gmail.com",
        phone: "222-222-2222",
        type: "personal"
      },
      {
        id: 3,
        name: "Cathy Cunningham",
        email: "CC@gmail.com",
        phone: "333-333-3333",
        type: "professional"
      }
    ]
  };

  const [state, dispatch] = useReducer(ContactReducer, initState);

  // Add Contacts
  const addContact = contact => {
    contact.id = uuidv4();
    dispatch({ type: ADD_CONTACT, payload: contact });
  }
  // Delete Contacts

  // Set Current Contact

  // Clear Current Contact

  // Update Contact

  // Filter Contact

  // Clear Contact

  return (
    <ContactContext.Provider value={{ 
      contacts: state.contacts,
      addContact
    }}>
      { props.children }
    </ContactContext.Provider>
  );
};

export default ContactState;
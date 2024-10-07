import React, {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';

import './contact.css'

// Import search bar component
import SearchBar from './components/search-bar/search-bar.jsx';
import AddContact from './components/add-contact/add-contact.jsx';
import CurrentContact from './components/current-contact/current-contact.jsx';

// Displays all contacts in the specified list and allows for the creation/editing of contacts
function Contact() {
  // Enable navigation hook
  let navigate = useNavigate();

  // Gather contact lists from local storage or set as an empty array
  let contactLists = JSON.parse(localStorage.getItem('contactLists')) || [];

  // Get name of list from URL parameter
  let {listName} = useParams();

  // Set the display name of the list from listName
  const [displayName, setDisplayName] = useState(listName);

  // Creates new contact form */
  function displayAddContact() {
    return <AddContact toggleAddContact={toggleAddContact} displayName={displayName}></AddContact>;
  }

  // Displays or hides new contact form */
  function toggleAddContact() {
    const newContact = document.querySelector('.add-contact');
    newContact.style.display = newContact.style.display === 'flex' ? 'none' : 'flex';
  }

  // Displays the information of the selected contact
  function displayCurrentContact() {
    return <CurrentContact></CurrentContact>
  }

  // Enables/disables editing for page header
  function toggleEdit() {
    const header = document.querySelector('.contact-header');

    if (header.contentEditable === 'true') {
      header.style.outline = 'none';
      header.contentEditable = false;
      header.disabled = true;
    } else {
      header.style.outline = '1px solid white';
      header.contentEditable = true;
      header.disabled = false;
      header.focus();
      header.setSelectionRange(100, 100);
    }
  }

  useEffect(() => {
    // If a contact list doesn't exist, make a POST request to the server to create one and update local storage
    // Else if URL doesn't have a param, use first contact lists in array
    // Else if URL param does not exist in contact lists, then navigate to error page
    if (contactLists.length == 0) {
      fetch('http://localhost:4001/createList/Contacts', {
        method: 'POST'
      });
      
      localStorage.setItem('contactLists', JSON.stringify([{name: 'Contacts', count: 0}]));
      setDisplayName('Contacts');
    } else if (displayName === undefined) {
      setDisplayName(contactLists[0].name);
    } else if (!contactLists.some(e => e.name === displayName)) {
      navigate('/error');
    }
  }, []);

  return(
    <>
      <div className='contact-wrapper'>
        {/* Display add contact form (hidden by default) */}
        {displayAddContact()}

        {/* Display current contact element (hidden by default) */}
        {displayCurrentContact()}

        {/* Header buttons */}
        <div className='contact-header-buttons'>
          <Link className='list-link'
                to='/lists'>
            Lists
          </Link>
          <img className='add-contact-img' onClick={toggleAddContact} src="add.png" alt="" />
        </div>

        {/* Header */}
        <div className='contact-header-div'>
          <img className='edit-button' onClick={toggleEdit} src="edit.png" alt="" />
          <input className='contact-header' defaultValue={displayName} type="text" />
        </div>

        {/* Search bar component */}
        <SearchBar></SearchBar>

        {/* Contact entries */}
        <div className='contacts'>
          <span className='alphabet-header'>A</span>
          <span className='contact-entry'>Mike Acosta</span>
          <span className='contact-entry'>Adam Alagil</span>
          <span className='contact-entry'>Alexander</span>
          <span className='contact-entry'>Tia Ana</span>
        </div>
      </div>
    </>
  )
}

export default Contact;
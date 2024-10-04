import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import './contact-lists.css';

// Displays and allows the user to navigate to contact lists that
// they have created and allows them to create/remove lists
function ContactList() {
  // Get contact lists from local storage or set to empty array
  const [contactLists, setContactLists] = useState(
    JSON.parse(localStorage.getItem('contactLists')) ? JSON.parse(localStorage.getItem('contactLists')) : []
  );

  // Sends a POST request to the server to create a new list in the database
  // and updates contact lists (including local storage reference)
  const createList = async (name) => {
    fetch(`http://localhost:4001/createList/${name}`, {
      method: 'POST'
    });
    
    const newContactLists = [...contactLists, {name: name, count: 0}];
    setContactLists(newContactLists);
    localStorage.setItem('contactLists', JSON.stringify(newContactLists));
  }

  // Enable/disables editing of list entries
  function toggleEdits() {
    const removeButtons = document.getElementsByClassName('remove-button');

    for (let i = 0; i < removeButtons.length; i++) {
      removeButtons[0].contentEditable = true;
      removeButtons[i].style.display = window.getComputedStyle(removeButtons[i]).display === 'none' ? 'flex' : 'none';
    }
  }
 
  // Deletes selected list entry
  function deleteEntry(name, index) {
    if (confirm(`Are you sure you want to delete ${name}?`) == true) {
      const newContactLists = contactLists.filter((_, i) => index != i);
      setContactLists(newContactLists); 
    }
  }

  // Display lists created by the user
  function displayLists() {
    return(
      <>
      {contactLists.map((list, index) => 
        <div className='entry-container' key={`${list}-${index}`}>
          <Link className='entry-link' to={`/${list.name}`}>
            <img className='entry-icon' src="audience.png" alt="" />
            <span className='entry-name'>{list.name}</span>
            <span className='entry-count'>{list.count}</span>
          </Link>
          <img className='remove-button' onClick={() => deleteEntry(list.name, index)} src="remove.png" alt=""/>
        </div>
      )}
      </>
    );
  }

  // If there are no lists, then create a default one
  useEffect(() => {
    if (contactLists.length == 0) {
      createList('Contacts');
    }
  }, []);


  return(
    <>
      <div className='lists-wrapper'>
        {/* Header buttons */}
        <div className='lists-header-buttons'>
          <span onClick={toggleEdits}>Edit</span>
          <span>Add List</span>
        </div>

        {/* Header */}
        <h1 className='lists-header'>Lists</h1>

        {/* List entries */}
        {displayLists()}
      </div>
    </>
  );
}

export default ContactList;
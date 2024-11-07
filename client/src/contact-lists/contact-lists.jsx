import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import './contact-lists.css';

// Displays and allows the user to navigate to contact lists that
// they have created and allows them to create/remove lists
function ContactList() {
  // Stores all contact lists as an array
  const [contactLists, setContactLists] = useState([]);

  // Sends a POST request to the server to create a new table in the database that will
  // store all contact lists and their contact counts
  const initListTable = async () => {
    fetch('http://localhost:4001/initListTable', {
      method: 'POST'
    });
  }

  const getLists = async () => {
    const response = await fetch('http://localhost:4001/getLists');
    const data = await response.json();

    if (data == '') {
      initListTable();
      createList('Contacts');
    } else {
      console.log(data);
      setContactLists(data);
    }
  }
  
  // Sends a POST request to the server to create a new list in
  // the database and updates contact lists
  const createList = async (name) => {
    fetch(`http://localhost:4001/createList/${name}`, {
      method: 'POST'
    });
    
    const newContactLists = [...contactLists, {ListName: name, ContactCount: 0}];
    setContactLists(newContactLists);
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
          <Link className='entry-link' to={`/${list.ListName}`}>
            <img className='entry-icon' src="audience.png" alt="" />
            <span className='entry-name'>{list.ListName}</span>
            <span className='entry-count'>{list.ContactCount}</span>
          </Link>
          <img className='remove-button' onClick={() => deleteEntry(list.name, index)} src="remove.png" alt=""/>
        </div>
      )}
      </>
    );
  }

  // If there are no lists, then create a default one
  useEffect(() => {
    getLists();
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
        {contactLists.length > 0 && displayLists()}
      </div>
    </>
  );
}

export default ContactList;
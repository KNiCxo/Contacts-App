import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import './contact-lists.css';

function ContactList() {
  const [contactLists, setContactLists] = useState(
    JSON.parse(localStorage.getItem('contactLists')) ? JSON.parse(localStorage.getItem('contactLists')) : []
  );

  const createList = async (name) => {
    fetch(`http://localhost:4001/createList/${name}`, {
      headers: {
        'Content-type': 'application/json'
      },
      method: 'POST'
    });
    const newContactLists = [...contactLists, {name: name, count: 0}];
    setContactLists(newContactLists);
    localStorage.setItem('contactLists', JSON.stringify(newContactLists));
  }

  function enableEdits() {
    const removeButtons = document.getElementsByClassName('remove-button');

    for (let i = 0; i < removeButtons.length; i++) {
      removeButtons[0].contentEditable = true;
      removeButtons[i].style.display = window.getComputedStyle(removeButtons[i]).display === 'none' ? 'flex' : 'none';
    }
  }
 
  function deleteEntry(name, index) {
    if (confirm(`Are you sure you want to delete ${name}?`) == true) {
      const newContactLists = contactLists.filter((_, i) => index != i);
      setContactLists(newContactLists); 
    }
  }

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

  useEffect(() => {
    console.log(contactLists);
    if (contactLists.length == 0) {
      createList('Contacts');
    }
  }, []);


  return(
    <>
      <div className='lists-wrapper'>
        <div className='lists-header-buttons'>
          <span onClick={enableEdits}>Edit</span>
          <span>Add List</span>
        </div>

        <h1 className='lists-header'>Lists</h1>
        {displayLists()}
      </div>
    </>
  );
}

export default ContactList;
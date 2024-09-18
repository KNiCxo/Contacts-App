import React, {useState, useEffect} from 'react';
import {Link} from 'react-router-dom';

import './contact-lists.css';

function ContactList() {
  const [contactLists, setContactLists] = useState(
    JSON.parse(localStorage.getItem('contactLists')) ? JSON.parse(localStorage.getItem('contactLists')) : []
  );

  const createList = async (name) => {
    fetch(`http://localhost:4001/createList/${name}`);
    const newContactLists = [...contactLists, {name: name, count: 0}];
    setContactLists(newContactLists);
    localStorage.setItem('contactLists', JSON.stringify(newContactLists));
  }

  function enableEdits() {
    const removeButtons = document.getElementsByClassName('remove-button');
    for (let i = 0; i < removeButtons.length; i++) {
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
        <Link className='entry-container' key={`${list}-${index}`} to={`/${list.name}`}>
          <div className='entry'>
            <img className='entry-icon' src="audience.png" alt="" />
            <span className='entry-name'>{list.name}</span>
            <span className='entry-count'>{list.count}</span>
          </div>
          <img className='remove-button' onClick={() => deleteEntry(list.name, index)} src="remove.png" alt=""/>
        </Link>
      )}
      </>
    );
  }

  useEffect(() => {
    console.log(contactLists);
    if (contactLists.length == 0) {
      createList('Friends');
    }
  }, []);


  return(
    <>
      <div className='lists-wrapper'>
        <div className='lists-header-buttons'>
          <span onClick={enableEdits}>Edit</span>
          <span>Add List</span>
        </div>

        <h1 className='list-header'>Lists</h1>
        {displayLists()}
        <Link className='entry-container' to={`/Yuh`}>
          <div className='entry'>
            <img className='entry-icon' src="audience.png" alt="" />
            <span className='entry-name'>Yuh</span>
            <span className='entry-count'>20</span>
          </div>
          <img className='remove-button' src="remove.png" alt=""/>
        </Link>
      </div>
    </>
  );
}

export default ContactList;
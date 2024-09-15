import React, {useState, useEffect} from 'react';

import './contact-lists.css';

function ContactList() {
  const [contactLists, setContactLists] = useState(
    JSON.parse(localStorage.getItem('contactLists')) ? JSON.parse(localStorage.getItem('contactLists')) : []
  );

  const createDefault = async () => {
    fetch('http://localhost:4001/createDefault');
    const newContactLists = [...contactLists, 'Friends'];
    setContactLists(newContactLists);
    localStorage.setItem('contactLists', JSON.stringify(newContactLists));
  }

  useEffect(() => {
    console.log(contactLists);
    if (contactLists.length == 0) {
      createDefault();
    }
  }, []);

  return(
    <>
      <div className='list-wrapper'>
        <div className='list-header-buttons'>
          <span>Edit</span>
          <span>Add List</span>
        </div>

        <h1 className='list-header'>Lists</h1>

        <div className='entries-container'>
          <div className='list-entry'>
            <img className='list-icon' src="audience.png" alt="" />
            <span>Friends</span>
            <span className='contact-count'>39</span>
          </div>
        </div>
      </div>
    </>
  );
}

export default ContactList;
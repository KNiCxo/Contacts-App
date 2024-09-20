import React, {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';

import './contact.css'

import SearchBar from '../search-bar/search-bar.jsx';

function Contact() {
  let navigate = useNavigate();

  let contactLists = JSON.parse(localStorage.getItem('contactLists')) || [];
  let {listName} = useParams();
  let [displayName, setDisplayName] = useState(listName);

  const testInsert = async () => {
    fetch('http://localhost:4001/insert', {
      headers: {
        'Content-type': 'application/json'
      },
      method: 'POST'
    })
    .then(res => res.json())
    .then(data => console.log(data));
  }

  function enableEdit() {
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
    if (contactLists.length == 0) {
      fetch('http://localhost:4001/createList/Contacts', {
        headers: {
          'Content-type': 'application/json'
        },
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
        <div className='contact-header-buttons'>
          <Link className='list-link'
                to='/lists'>
            Lists
          </Link>
          <img className='add-contact' onClick={testInsert} src="add.png" alt="" />
        </div>

        <div className='contact-header-div'>
          <img className='edit-button' onClick={enableEdit} src="edit.png" alt="" />
          <input className='contact-header' defaultValue={displayName} type="text" />
        </div>

        <SearchBar></SearchBar>

        <div className='contacts'>
          <span className='alphabet-category'>A</span>
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
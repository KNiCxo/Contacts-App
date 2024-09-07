import {Link} from 'react-router-dom';

import './contact.css'

import SearchBar from '../search-bar/search-bar.jsx';

function Contact() {
  return(
    <>
      <div className='contact-wrapper'>
        <div className='contact-header-buttons'>
          <Link className='list-link'
                to='/lists'>
            Lists
          </Link>
          <img className='add-contact' src="add.png" alt="" />
        </div>

        <h1 className='contact-header'>Contacts</h1>

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
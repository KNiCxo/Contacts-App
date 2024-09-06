import {Link} from 'react-router-dom';

import './contact.css'

function Contact() {
  return(
    <>
      <div className='header-buttons'>
        <Link className='list-link'
              to='/lists'>
          Lists
        </Link>
        <img className='add-contact' src="add.png" alt="" />
      </div>

      <header>
        <h1>Contacts</h1>
      </header>
    </>
  )
}

export default Contact;
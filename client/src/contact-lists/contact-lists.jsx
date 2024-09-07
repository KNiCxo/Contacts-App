import './contact-lists.css';

function ContactList() {
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
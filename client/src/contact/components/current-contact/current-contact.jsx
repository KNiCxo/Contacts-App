import React, {useEffect} from 'react';

import './current-contact.css';

// Displays the current contact form and all of its functionality
function CurrentContact(props) {
  // Enables the add contact form's edit variation
  function toggleEditContact() {
    props.setEditingContact(true);
    props.toggleCurrentContact();
    props.toggleAddContact();
  }

  // Deletes contacts and hides current contact form
  const deleteContact = async () => {
    if (window.confirm("Confirm deletion?")) {
      await fetch(`http://localhost:4001/deleteContact/${props.displayName}/${props.contact.ContactId}`, {
        headers: {
          'Content-type': 'application/json'
        },
        method: 'DELETE',
        body: JSON.stringify({ListCount: props.listCount})
      });

      props.toggleCurrentContact();
    }
  }

  // Rerender component if states change
  useEffect(() => {

  }, [props.contact, props.updatedPicture, props.contactNumbers, props.contactEmails]);

  return(
    <>
      <div className='current-contact'>
        {/* Container header */}
        <div className='current-contact-header'>
          <span className='current-back' onClick={() => props.toggleCurrentContact()}>Back</span>
          <span className='current-edit' onClick={() => toggleEditContact()}>Edit</span>
        </div>

        {/* Contact picture */}
        <div className='current-contact-pfp'>
          <img src={props.updatedPicture ? props.updatedPicture : `/uploads/${props.contact.AviPath}`} id='profile-picture' alt="" />
        </div>

        {/* Name & company container */}
        <div className='current-name-company-div'>
          <span className='current-name'>
          {(props.contact.FirstName && props.contact.LastName) ? 
           `${props.contact.FirstName} ${props.contact.LastName}` :
           (props.contact.LastName) ?
           `${props.contact.LastName}` : 
           (props.contact.FirstName) ? 
           `${props.contact.FirstName}` :
           `${props.contact.Company}`}
          </span>
          <span className='current-company'>
            {(!props.contact.FirstName && !props.contact.LastName) ? '' : props.contact.Company}
          </span>
        </div>

        {/* Phone number */}
        {props.contactNumbers.map((number) => {
          return(
            <div className='current-info-div' key={number.NumberId}>
              <div className='current-info-contents'>
                <span className='current-info-label'>{number.Type}</span>
                <span className='current-info'>{number.Number}</span>
              </div>
            </div>
          );
        })}

        {/* Email address */}
        {props.contactEmails.map((email) => {
          return(
            <div className='current-info-div'>
              <div className='current-info-contents'>
                <span className='current-info-label'>email</span>
                <span className='current-info'>{email.Email}</span>
              </div>
          </div>
          );
        })}

        {/* Home address */}
        {props.contact.Address ? 
          <div className='current-info-div'>
            <div className='current-info-contents'>
              <span className='current-info-label'>address</span>
              <span className='current-info'>{(props.contact.Address) ? props.contact.Address : ''}</span>
            </div>
          </div> : ''}

        {/* Birthday */}
        {props.contact.Birthday ? 
          <div className='current-info-div'>
            <div className='current-info-contents'>
              <span className='current-info-label'>birthday</span>
              <input className='current-birthday' type="date" defaultValue={props.contact.Birthday}/>
            </div>
          </div> : ''}

        {/* Notes container */}
        <div className='current-info-div'>
          <div className='current-info-contents'>
            <span className='current-info-label'>Notes</span>
            <span className='current-note'>{props.contact.Note}</span>
          </div>
        </div> 

        {/* Button to delete contact */}
        <div className='current-delete-div'>
          <button className='delete-contact' onClick={deleteContact}>Delete Contact</button>
        </div>
      </div>
    </>
  );
}

export default CurrentContact;
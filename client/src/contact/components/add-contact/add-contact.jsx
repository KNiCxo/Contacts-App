import React, {useState} from 'react';

import './add-contact.css';

// Displays the add contact form and all of its functionality
function AddContact(props) {
  // Create empty arrays for the new contact phone/email slots
  const [phoneSlots, setPhoneSlots] = useState(props.editingContact ? props.contactNumbers : []);
  const [emailSlots, setEmailSlots] = useState(props.editingContact ? props.contactEmails : []);

  // Clicks on the real but hidden file button to allow user to upload a contact picture
  function activateFileButton() {
    const realFileButton  = document.querySelector('.real-file-button');
    realFileButton.click();
  }

  // Displays contact picture in the new/edit contact form
  function displayPicture() {
    const profilePicture = document.getElementById('profile-picture');
    const realFileButton  = document.querySelector('.real-file-button');

    profilePicture.src = URL.createObjectURL(realFileButton.files[0]);

    // Used to display the new profile image if the user updated it
    if (props.editingContact) {
      props.setUpdatedPicture(URL.createObjectURL(realFileButton.files[0]));
    }
  }

  // Adds an additional element to the phoneSlots array
  function addPhoneSlots() {
    setPhoneSlots(prevSlots => [...prevSlots, {Type: 'mobile', Number: ''}]);
  }
  
  // Removes one element from phoneSlots array
  function removePhoneSlots(index) {
    // Get all phone elements and store as HTML objects
    const phoneElements = document.getElementsByClassName('phone-slot');

    // Temporarily holds new array after slot is removed
    let tempArr = [];

    // Loop through elements and gather the phone type and number and push into the temp array
    Array.from(phoneElements).forEach(slot => {
      tempArr.push({
        Type: slot.children[1].value,
        Number: slot.children[3].value
      });
    });
    
    // Update phone slots
    setPhoneSlots(tempArr.filter((_, i) => i != index));
  }
  
  // Adds an additional element to the emailSlots array
  function addEmailSlots() {
    setEmailSlots(prevSlots => [...prevSlots, {Email: ''}]);
  }

  // Removes one element from emailSlots array
  function removeEmailSlots(index) {
    // Get all email elements and store as HTML objects
    const emailElements = document.getElementsByClassName('email-slot');

    // Temporarily holds new array after slot is removed
    let tempArr = [];

    // Loop through elements and gather the emails and push into the temp array
    Array.from(emailElements).forEach(slot => {
      tempArr.push({Email: slot.children[1].value});
    });

    // Update email slots
    setEmailSlots(tempArr.filter((_, i) => i != index));
  }

  // Makes POST request to server that uploads contact pictures
  const uploadPicture = async ()=> {
    // Get real file input element
    const fileInput = document.querySelector('.real-file-button');

    // Create form data and add file
    const data = new FormData();
    data.append('file', fileInput.files[0]);

    // Make POST request only if a file was selected
    if (fileInput.files[0] != undefined) {
      const res = await fetch('http://localhost:4001/uploadPicture', {
        method: 'POST',
        body: data
      });
      
      // Return file name for database entry
      const json = await res.json();
      return json.filename;
    }
    
    // Return file of existing picture if contact is being edited
    // Else return the default picture name
    return props.editingContact ? props.contact.AviPath : 'profile-picture.png';
  }

  // Gathers all information from the new/edit contact form and sends a POST/PUT request to the server
  const addContact = async () => {
    const fileName = await uploadPicture();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const company = document.getElementById('company').value;

    // If the first name, last name, and company fields are empty, ignore add request
    // Else, add or update contact
    if (firstName == '' && lastName == '' && company == '') {
      return;
    } else {
      const birthday = document.getElementById('birthday').value;
      const address = document.getElementById('address').value;
      let phoneNumbers = [];
      let emails = [];
      const note = document.getElementById('note').value;

      // Get all phone elements and email elements and store as HTML objects
      const phoneElements = document.getElementsByClassName('phone-slot');
      const emailElements = document.getElementsByClassName('email-slot');

      // Loop through elements and gather the phone type and number and push into the phoneNumbers array
      Array.from(phoneElements).forEach(slot => {
        // Add number if not blank
        if (slot.children[3].value != '') {
          phoneNumbers.push({
            Type: slot.children[1].value,
            Number: slot.children[3].value
          });
        }
      });

      // Loop through elements and add emails to array
      Array.from(emailElements).forEach(slot => {
        // Add email if not blank
        if (slot.children[1].value != '') {
          emails.push({Email: slot.children[1].value});
        }
      });

      // If editingContact flag is true, then update contact
      // Else add contact
      if (props.editingContact) {
        // Combine all info into an object
        const contactInfo = {
          ListName: props.displayName,
          ContactId: props.contact.ContactId,
          AviPath: fileName,
          OldAviPath: props.contact.AviPath,
          FirstName: firstName,
          LastName: lastName,
          Company: company,
          Birthday: birthday,
          Address: address,
          PhoneNumbers: phoneNumbers,
          Emails: emails,
          Note: note
        }

        await fetch(`http://localhost:4001/updateContact/`, {
          headers: {
            'Content-type': 'application/json'
          },
          method: 'PUT',
          body: JSON.stringify(contactInfo)
        });

        // Hide add contact form and show current contact form after clicking done
        props.toggleAddContact();
        props.toggleCurrentContact(contactInfo);
      } else {
        // Combine all info into an object
        const contactInfo = {
          ListName: props.displayName,
          AviPath: fileName,
          FirstName: firstName,
          LastName: lastName,
          Company: company,
          Birthday: birthday,
          Address: address,
          PhoneNumbers: phoneNumbers,
          Emails: emails,
          Note: note, 
          ListCount: props.listCount
        }
        
        await fetch('http://localhost:4001/addContact', {
          headers: {
            'Content-type': 'application/json'
          },
          method: 'POST',
          body: JSON.stringify(contactInfo)
        });

        // Hide add contact form after clicking done
        props.toggleAddContact();
      }
    }
  }

  return(
    <>
      {/* HTML for add contact form */}
      <div className='add-contact'>
        {/* Form header */}
        <div className='add-contact-header'>
          <span className='add-contact-cancel' onClick={() => props.toggleAddContact()}>Cancel</span>
          <span className='add-contact-title'>{props.editingContact ? 'Edit Contact': 'New Contact'}</span>
          <span className='add-contact-done' onClick={addContact}>Done</span>
        </div>

        {/* Contact picture section */}
        <div className='add-contact-pfp'>
          <img id='profile-picture' 
               src={props.editingContact ? `/uploads/${props.contact.AviPath}` : 'profile-picture.png'}/>

          <input className='real-file-button' 
                  onChange={displayPicture} 
                  type="file" 
                  accept='image/jpeg, image/jpg, image/png'/>
          <span onClick={activateFileButton}>Add Photo</span>
        </div>

        {/* Input section for name and company */}
        <div className='name-company-div'>
          {/* First name */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' 
                   id='first-name' 
                   type="text"
                   defaultValue={props.editingContact ? props.contact.FirstName : ''}
                   placeholder='First name' 
                   maxLength="100"/>
          </div>

          {/* Last name */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' 
                   id='last-name' 
                   type="text"
                   defaultValue={props.editingContact ? props.contact.LastName : ''}
                   placeholder='Last name' 
                   maxLength="100"/>
          </div>

          {/* Company */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' 
                   id='company' 
                   type="text" 
                   defaultValue={props.editingContact ? props.contact.Company : ''}
                   placeholder='Company' 
                   maxLength="100"/>
          </div>
        </div>

        {/* Input section for birthday and home address */}
        <div className='birthday-address-div'>
          {/* Birthday */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' 
                   id='birthday' 
                   type="date"
                   defaultValue={props.editingContact ? props.contact.Birthday : ''}/>
          </div>

          {/* Home address */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' 
                   id='address' 
                   type="text" 
                   defaultValue={props.editingContact ? props.contact.Address : ''}
                   placeholder='Address' 
                   maxLength="100"/>
          </div>
        </div>

        {/* Iterate through phoneSlots array to display all phone input fields */}
        {phoneSlots.map((slot, index) => {
          return(
            <>
              {/* HTML for phone slot */}
              <div className='add-contact-input-div phone-slot' key={`${slot.Type}-${slot.Number}`}>
                <img src="remove.png" className='remove-address' onClick={() => removePhoneSlots(index)} alt="" />

                <select className='address-select' 
                        defaultValue={slot.Type}
                        name="phone-select">
                  <option value="mobile">mobile</option>
                  <option value="home">home</option>
                  <option value="work">work</option>
                </select>

                <span className='select-arrow'>{`>`}</span>
                <input className='add-contact-input' 
                       id='phone' 
                       type="text" 
                       defaultValue={slot.Number}
                       placeholder='Phone' 
                       maxLength="100"/>
              </div>
            </>
          );
        })}

        {/* Label that lets the user create new phone slots */}
        <div className='address-div'>
          <img src="add-2.png" className='add-address' onClick={addPhoneSlots} alt="" />
          <span className='add-contact-label'>add phone</span>
        </div>

        {/* Iterate through emailSlots array to display all email input fields */}
        {emailSlots.map((slot, index) => {
          return(
            // HTML for email slot
            <div className='add-contact-input-div email-slot' key={`${slot.Email}-${index}`}>
              <img src="remove.png" className='remove-address' onClick={() => removeEmailSlots(index)} alt="" />
              <input className='add-contact-input' 
                     id='email' 
                     type="text"
                     defaultValue={slot.Email}
                     placeholder='Email' 
                     maxLength="100"/>
            </div>
          );
        })}
        
        {/* Label that lets the user create new email slots */}
        <div className='address-div'>
          <img src="add-2.png" className='add-address' onClick={addEmailSlots} alt="" />
          <span className='add-contact-label'> add email</span>
        </div>

        {/* Input section for notes */}
        <div className='notes-div'>
          <span>Notes</span>
          <textarea name="" 
                    id="note" 
                    defaultValue={props.editingContact ? props.contact.Note : ''}
                    cols="30" 
                    rows="10" 
                    maxLength="1000" ></textarea>
        </div>
      </div>
    </>
  )
}

export default AddContact;
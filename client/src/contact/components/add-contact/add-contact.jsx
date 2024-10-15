import React, {useState} from 'react';

import './add-contact.css';

function AddContact(props) {
  // Create empty arrays for the new contact phone/email slots
  const [phoneSlots, setPhoneSlots] = useState([]);
  const [emailSlots, setEmailSlots] = useState([]);

  // Clicks on the real but hidden file button to allow user to upload a contact picture
  function activateFileButton() {
    const realFileButton  = document.querySelector('.real-file-button');
    realFileButton.click();
  }

  // Displays contact picture in the new contact form
  function displayPicture() {
    const profilePicture = document.getElementById('profile-picture');
    const realFileButton  = document.querySelector('.real-file-button');

    profilePicture.src = URL.createObjectURL(realFileButton.files[0]);
  }

  // Adds an additional element to the phoneSlots array
  function addPhoneSlots() {
    setPhoneSlots(prevSlots => [...prevSlots, {}]);
  }
  
  // Removes one element from phoneSlots array
  function removePhoneSlots(index) {
    setPhoneSlots(prevSlots => prevSlots.filter((_, i) => i != index));
  }
  
  // Adds an additional element to the emailSlots array
  function addEmailSlots() {
    setEmailSlots(prevSlots => [...prevSlots, {}]);
  }

  // Removes one element from emailSlots array
  function removeEmailSlots(index) {
    setEmailSlots(prevSlots => prevSlots.filter((_, i) => i != index));
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
    
    // Return name of default picture if no file was uploaded
    return 'profile-picture.png';
  }

  // Gathers all information from the new contact form and sends a POST request to the server
  const addContact = async () => {
    const fileName = await uploadPicture();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const company = document.getElementById('company').value;

    // If the first name, last name, and company fields are empty, ignore add request
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
        phoneNumbers.push({
          type: slot.children[1].value,
          number: slot.children[3].value
        });
      });

      // Loop through elements and add emails to array
      Array.from(emailElements).forEach(slot => {
        emails.push(slot.children[1].value)
      });

      // Combine all info into an object
      const contactInfo = {
        listName: props.displayName,
        fileName: fileName,
        firstName: firstName,
        lastName: lastName,
        company: company,
        birthday: birthday,
        address: address,
        phoneNumbers: phoneNumbers,
        emails: emails,
        note: note
      }
    
      // Make POST request
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

  return(
    <>
      {/* HTML for add contact form */}
      <div className='add-contact'>
        {/* Form header */}
        <div className='add-contact-header'>
          <span className='add-contact-cancel' onClick={props.toggleAddContact}>Cancel</span>
          <span className='add-contact-title'>New Contact</span>
          <span className='add-contact-done' onClick={addContact}>Done</span>
        </div>

        {/* Contact picture section */}
        <div className='add-contact-pfp'>
          <img id='profile-picture' src="profile-picture.png" alt="" />
          <input className='real-file-button' 
                  onChange={displayPicture} 
                  type="file" 
                  accept='image/jpeg, image/jpg, image/png'
          />
          <span onClick={activateFileButton}>Add Photo</span>
        </div>

        {/* Input section for name and company */}
        <div className='name-company-div'>
          {/* First name */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' id='first-name' type="text" placeholder='First name' maxLength="100"/>
          </div>

          {/* Last name */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' id='last-name' type="text" placeholder='Last name' maxLength="100"/>
          </div>

          {/* Company */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' id='company' type="text" placeholder='Company' maxLength="100"/>
          </div>
        </div>

        {/* Input section for birthday and home address */}
        <div className='birthday-address-div'>
          {/* Birthday */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' id='birthday' type="date" />
          </div>

          {/* Home address */}
          <div className='add-contact-input-div'>
            <input className='add-contact-input' id='address' type="text" placeholder='Address' maxLength="100"/>
          </div>
        </div>

        {/* Iterate through phoneSlots array to display all phone input fields */}
        {phoneSlots.map((_, index) => {
          return(
            <>
              {/* HTML for phone slot */}
              <div className='add-contact-input-div phone-slot' key={index}>
                <img src="remove.png" className='remove-address' onClick={() => removePhoneSlots(index)} alt="" />

                <select className='address-select' name="phone-select">
                  <option value="mobile">mobile</option>
                  <option value="home">home</option>
                  <option value="work">work</option>
                </select>

                <span className='select-arrow'>{`>`}</span>
                <input className='add-contact-input' id='phone' type="text" placeholder='Phone' maxLength="100"/>
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
        {emailSlots.map((_, index) => {
          return(
            // HTML for email slot
            <div className='add-contact-input-div email-slot' key={index}>
              <img src="remove.png" className='remove-address' onClick={() => removeEmailSlots(index)} alt="" />
              <input className='add-contact-input' id='email' type="text" placeholder='Email' maxLength="100"/>
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
          <textarea name="" id="note" cols="30" rows="10" maxLength="1000"></textarea>
        </div>
      </div>
    </>
  )
}

export default AddContact;
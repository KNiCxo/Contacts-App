import React, {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';

import './contact.css'

// Import search bar component
import SearchBar from '../search-bar/search-bar.jsx';

// Displays all contacts in the specified list and allows for the creation/editing of contacts
function Contact() {
  // Enable navigation hook
  let navigate = useNavigate();

  // Gather contact lists from local storage or set as an empty array
  let contactLists = JSON.parse(localStorage.getItem('contactLists')) || [];

  // Get name of list from URL parameter
  let {listName} = useParams();

  // Set the display name of the list from listName
  const [displayName, setDisplayName] = useState(listName);

  // Create empty arrays for the new contact phone/email slots
  const [phoneSlots, setPhoneSlots] = useState([]);
  const [emailSlots, setEmailSlots] = useState([]);

  // Creates new contact form */
  function displayAddContact(edit) {
    if (edit == true) {

    }

    return(
      <>
        {/* HTML for add contact form */}
        <div className='add-contact'>
          {/* Form header */}
          <div className='add-contact-header'>
            <span className='add-contact-cancel' onClick={toggleNewContact}>Cancel</span>
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
              <input className='add-contact-input' id='first-name' type="text" placeholder='First name' maxlength="100"/>
            </div>

            {/* Last name */}
            <div className='add-contact-input-div'>
              <input className='add-contact-input' id='last-name' type="text" placeholder='Last name' maxlength="100"/>
            </div>

            {/* Company */}
            <div className='add-contact-input-div'>
              <input className='add-contact-input' id='company' type="text" placeholder='Company' maxlength="100"/>
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
              <input className='add-contact-input' id='address' type="text" placeholder='Address' maxlength="100"/>
            </div>
          </div>

          {/* Iterate through phoneSlots array to display all phone input fields */}
          {phoneSlots.map((_, index) => {
            return(
              <>
                {/* HTML for phone slot */}
                <div className='add-contact-input-div phone-slot'key={index}>
                  <img src="remove.png" className='remove-address' onClick={() => removePhoneSlots(index)} alt="" />

                  <select className='address-select' name="phone-select">
                    <option value="mobile">mobile</option>
                    <option value="home">home</option>
                    <option value="work">work</option>
                  </select>

                  <span className='select-arrow'>{`>`}</span>
                  <input className='add-contact-input' id='phone' type="text" placeholder='Phone' maxlength="100"/>
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
                <input className='add-contact-input' id='email' type="text" placeholder='Email' maxlength="100"/>
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
            <textarea name="" id="note" cols="30" rows="10" maxlength="1000"></textarea>
          </div>
        </div>
      </>
    );
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

  // Displays or hides new contact form */
  function toggleNewContact() {
    const newContact = document.querySelector('.add-contact');
    newContact.style.display = newContact.style.display === 'flex' ? 'none' : 'flex';
  }

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

  // Gathers all information from the new contact form and sends a POST request to the server
  const addContact = async () => {
    //const fileName = await uploadPicture();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const company = document.getElementById('company').value;
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
      listName: displayName,
      fileName: 'test.jpg',
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
    fetch('http://localhost:4001/addContact', {
      headers: {
        'Content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(contactInfo)
    });
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

  // Displays the information of the selected contact
  function displayCurrentContact() {
    return(
      <>
        <div className='current-contact'>
          {/* Container header */}
          <div className='current-contact-header'>
            <span className='current-back'>Back</span>
            <span className='current-edit'>Edit</span>
          </div>

          {/* Contact picture */}
          <div className='current-contact-pfp'>
            <img src="profile-picture.png" alt="" />
          </div>

          {/* Name & company container */}
          <div className='current-name-company-div'>
            <span className='current-name'>Adam Alagil</span>
            <span className='current-company'>Fortnite</span>
          </div>

          {/* Phone number */}
          <div className='current-info-div'>
            <div className='current-info-contents'>
              <span className='current-info-label'>home</span>
              <span className='current-info'>{`1 (905) 341-1470`}</span>
            </div>
          </div>

          {/* Email address */}
          <div className='current-info-div'>
            <div className='current-info-contents'>
              <span className='current-info-label'>email</span>
              <span className='current-info'>adamalagil99@gmail.com</span>
            </div>
          </div>

          {/* Home address */}
          <div className='current-info-div'>
            <div className='current-info-contents'>
              <span className='current-info-label'>address</span>
              <span className='current-info'>2023 Test Street Chula Vista, CA 91910</span>
            </div>
          </div>

          {/* Birthday */}
          <div className='current-info-div'>
            <div className='current-info-contents'>
              <span className='current-info-label'>birthday</span>
              <input className='current-birthday' type="date" value='2002-11-03'/>
            </div>
          </div>

          {/* Notes container */}
          <div className='current-info-div'>
            <div className='current-info-contents'>
              <span className='current-info-label'>Notes</span>
              <span className='current-note'>this is a test note</span>
            </div>
          </div>

          {/* Button to delete contact */}
          <button className='delete-contact'>Delete Contact</button>
        </div>
      </>
    );
  }

  // Enables/disables editing for page header
  function toggleEdit() {
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
    // If a contact list doesn't exist, make a POST request to the server to create one and update local storage
    // Else if URL doesn't have a param, use first contact lists in array
    // Else if URL param does not exist in contact lists, then navigate to error page
    if (contactLists.length == 0) {
      fetch('http://localhost:4001/createList/Contacts', {
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
        {/* Display add contact form (hidden by default) */}
        {displayAddContact(false)}

        {/* Display current contact element (hidden by default) */}
        {displayCurrentContact()}

        {/* Header buttons */}
        <div className='contact-header-buttons'>
          <Link className='list-link'
                to='/lists'>
            Lists
          </Link>
          <img className='add-contact-img' onClick={toggleNewContact} src="add.png" alt="" />
        </div>

        {/* Header */}
        <div className='contact-header-div'>
          <img className='edit-button' onClick={toggleEdit} src="edit.png" alt="" />
          <input className='contact-header' defaultValue={displayName} type="text" />
        </div>

        {/* Search bar component */}
        <SearchBar></SearchBar>

        {/* Contact entries */}
        <div className='contacts'>
          <span className='alphabet-header'>A</span>
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
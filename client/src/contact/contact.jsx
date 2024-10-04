import React, {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';

import './contact.css'

import SearchBar from '../search-bar/search-bar.jsx';

function Contact() {
  let navigate = useNavigate();

  let contactLists = JSON.parse(localStorage.getItem('contactLists')) || [];
  let {listName} = useParams();
  const [displayName, setDisplayName] = useState(listName);

  const [phoneSlots, setPhoneSlots] = useState([]);
  const [emailSlots, setEmailSlots] = useState([]);

  function displayNewContact() {
    return(
      <>
        <div className='new-contact'>
          <div className='new-contact-header'>
            <span className='new-contact-cancel' onClick={toggleNewContact}>Cancel</span>
            <span className='new-contact-title'>New Contact</span>
            <span className='new-contact-done' onClick={addContact}>Done</span>
          </div>

          <div className='new-contact-pfp'>
            <img id='profile-picture' src="profile-picture.png" alt="" />
            <input className='real-file-button' 
                   onChange={displayPicture} 
                   type="file" 
                   accept='image/jpeg, image/jpg, image/png'
            />
            <span onClick={activateFileButton}>Add Photo</span>
          </div>

          <div className='name-company-div'>
            <div className='new-contact-input-div'>
              <input className='new-contact-input' id='first-name' type="text" placeholder='First name' maxlength="100"/>
            </div>

            <div className='new-contact-input-div'>
              <input className='new-contact-input' id='last-name' type="text" placeholder='Last name' maxlength="100"/>
            </div>

            <div className='new-contact-input-div'>
              <input className='new-contact-input' id='company' type="text" placeholder='Company' maxlength="100"/>
            </div>
          </div>

          <div className='birthday-address-div'>
            <div className='new-contact-input-div'>
              <input className='new-contact-input' id='birthday' type="date" />
            </div>

            <div className='new-contact-input-div'>
              <input className='new-contact-input' id='address' type="text" placeholder='Address' maxlength="100"/>
            </div>
          </div>

          {phoneSlots.map((_, index) => {
            return(
              <>
                <div className='new-contact-input-div phone-slot'key={index}>
                  <img src="remove.png" className='remove-address' onClick={() => removePhoneSlots(index)} alt="" />

                  <select className='address-select' name="phone-select">
                    <option value="mobile">mobile</option>
                    <option value="home">home</option>
                    <option value="work">work</option>
                  </select>

                  <span className='select-arrow'>{`>`}</span>
                  <input className='new-contact-input' id='phone' type="text" placeholder='Phone' maxlength="100"/>
                </div>
              </>
            );
          })}

          <div className='address-div'>
            <img src="add-2.png" className='add-address' onClick={addPhoneSlots} alt="" />
            <span className='new-contact-label'> add phone</span>
          </div>

          {emailSlots.map((_, index) => {
            return(
              <div className='new-contact-input-div email-slot' key={index}>
                <img src="remove.png" className='remove-address' onClick={() => removeEmailSlots(index)} alt="" />
                <input className='new-contact-input' id='email' type="text" placeholder='Email' maxlength="100"/>
              </div>
            );
          })}
          
          <div className='address-div'>
            <img src="add-2.png" className='add-address' onClick={addEmailSlots} alt="" />
            <span className='new-contact-label'> add email</span>
          </div>

          <div className='notes-div'>
            <span>Notes</span>
            <textarea name="" id="note" cols="30" rows="10" maxlength="1000"></textarea>
          </div>
        </div>
      </>
    );
  }

  function addPhoneSlots() {
    setPhoneSlots(prevSlots => [...prevSlots, {}]);
  }

  function removePhoneSlots(index) {
    setPhoneSlots(prevSlots => prevSlots.filter((_, i) => i != index));
  }

  function addEmailSlots() {
    setEmailSlots(prevSlots => [...prevSlots, {}]);
  }

  function removeEmailSlots(index) {
    setEmailSlots(prevSlots => prevSlots.filter((_, i) => i != index));
  }

  function toggleNewContact() {
    const newContact = document.querySelector('.new-contact');
    newContact.style.display = newContact.style.display === 'flex' ? 'none' : 'flex';
  }

  function activateFileButton() {
    const realFileButton  = document.querySelector('.real-file-button');
    realFileButton.click();
  }

  function displayPicture() {
    const profilePicture = document.getElementById('profile-picture');
    const realFileButton  = document.querySelector('.real-file-button');

    profilePicture.src = URL.createObjectURL(realFileButton.files[0]);
  }

  const addContact = async () => {
    //const fileName = await uploadPicture();
    const firstName = document.getElementById('first-name').value;
    const lastName = document.getElementById('last-name').value;
    const company = document.getElementById('company').value;
    const birthday = document.getElementById('birthday').value;
    const address = document.getElementById('address').value;

    let phoneNumbers = [];
    const phoneElements = document.getElementsByClassName('phone-slot');

    Array.from(phoneElements).forEach(slot => {
      phoneNumbers.push({
        type: slot.children[1].value,
        number: slot.children[3].value
      });
    });

    let emails = [];
    const emailElements = document.getElementsByClassName('email-slot');

    Array.from(emailElements).forEach(slot => {
      emails.push(slot.children[1].value)
    });

    const note = document.getElementById('note').value;

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
    
    fetch('http://localhost:4001/addContact', {
      headers: {
        'Content-type': 'application/json'
      },
      method: 'POST',
      body: JSON.stringify(contactInfo)
    });
  }

  const uploadPicture = async ()=> {
    const fileInput = document.querySelector('.real-file-button');
    const data = new FormData();
    data.append('file', fileInput.files[0]);

    if (fileInput.files[0] != undefined) {
      const res = await fetch('http://localhost:4001/uploadPicture', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      return json.filename;
    }
    
    return 'profile-picture.png';
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
        {displayNewContact()}

        <div className='contact-header-buttons'>
          <Link className='list-link'
                to='/lists'>
            Lists
          </Link>
          <img className='add-contact' onClick={toggleNewContact} src="add.png" alt="" />
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
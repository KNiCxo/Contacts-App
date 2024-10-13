import React, {useState, useEffect} from 'react';
import {useParams, Link, useNavigate} from 'react-router-dom';

import './contact.css'

// Import search bar component
import SearchBar from './components/search-bar/search-bar.jsx';
import AddContact from './components/add-contact/add-contact.jsx';
import CurrentContact from './components/current-contact/current-contact.jsx';

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

  // Store contacts data from database
  const [contacts, setContacts] = useState(null);
  const [contactNumbers, setContactNumbers] = useState(null);
  const [contactEmails, setContactEmails] = useState(null);

  // API call to server to get contacts data from database
  const getContacts = async () => {
    const response = await fetch(`http://localhost:4001/getContacts/${displayName}`);
    const data = await response.json();

    sortContacts(data);
  }

  // Sorts contacts into alphabeticall order
  function sortContacts(contacts) {
    contacts.sort((a, b) => {
      let nameA;
      let nameB;
      
      // Choose name to sort by in the order of: "Last Name", "First Name", "Company"
      if (a.LastName == '') {
        if (a.FirstName == '') {
          nameA = a.Company;
        } else {
          nameA = a.FirstName;
        }
      } else {
        nameA = a.LastName;
      }


      if (b.LastName == '') {
        if (b.FirstName == '') {
          nameB = b.Company;
        } else {
          nameB = b.FirstName;
        }
      } else {
        nameB = b.LastName;
      }
    
      // Test if either name has a digit as the first letter
      const hasDigitA = /^\d/.test(nameA.charAt(0));
      const hasDigitB = /^\d/.test(nameB.charAt(0));

      // Test if either name contains only symbols
      const hasSymbolA  = ((/[^a-zA-Z]/.test(nameA) && !/[a-zA-Z]/.test(nameA)));
      const hasSymbolB = ((/[^a-zA-Z]/.test(nameB) && !/[a-zA-Z]/.test(nameB))); 

      // If both have digits as the first letter then compare normally
      if (hasDigitA && hasDigitB) {
        // If nameA < nameB then place nameA before nameB
        // Else place nameB before nameA
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      }

      // If nameA is has a digit as the first letter then place after nameB and vice versa
      if (hasDigitA && hasSymbolB) return 1;
      if (hasDigitB && hasSymbolA) return -1;
      
      // If both have only symbols then compare normally
      if (hasSymbolA && hasSymbolB) {
        // If nameA < nameB then place nameA before nameB
        // Else place nameB before nameA
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      }

      // If nameA is only symbols then place after nameB and vice versa
      if (hasSymbolA) return 1;
      if (hasSymbolB) return -1;

      // If nameA < nameB then place nameA before nameB
      // Else place nameB before nameA
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    // Update contacts array
    setContacts(contacts);
  }

  // Displays contacts, grouped and seperated by a letter header
  function displayContacts() {
    // Create object to put all contacts into groups
    let groupedContacts = {};

    // Iterate through contacts array to sort them into groups
    contacts.forEach((contact, index) => {
      // Choose letter to sort by in the order of: "Last Name", "First Name", "Company"
      let firstLetter;

      if (contact.LastName == '') {
        if (contact.FirstName == '') {
          firstLetter = contact.Company.charAt(0).toUpperCase();
        } else {
          firstLetter = contact.FirstName.charAt(0).toUpperCase();
        }
      } else {
        firstLetter = contact.LastName.charAt(0).toUpperCase();
      }
      
      // If first letter is a symbol or a digit, then add contact to the "#" group
      // Else, add contact to its respective group
      if ((/[^a-zA-Z]/.test(firstLetter) && !/[a-zA-Z]/.test(firstLetter)) || /^\d$/.test(firstLetter)) {
        // If "#" group does not exist, then create it
        if (!('#' in groupedContacts)) {
          groupedContacts['#'] = [];
        }
        groupedContacts['#'].push(contact)
      } else {
        // If a group for the contact does not exist, then create it
        if (!(firstLetter in groupedContacts)) {
          groupedContacts[firstLetter] = [];
        }
        groupedContacts[firstLetter].push(contact);
      }
    });
    
    // Loops through each letter group and displays the proper HTML
    return(
      <>
        {Object.keys(groupedContacts).map((letter) => {
          return(
            <>
              <div className='alphabet-group' key={letter}>
                <span className='alphabet-header' key={letter}>{letter}</span>
                {groupedContacts[letter].map((entry) => {
                  return <span className='contact-entry' key={entry.ContactId}>
                          {(entry.FirstName || entry.LastName)
                          ? `${entry.FirstName} ${entry.LastName}`
                          : entry.Company}
                         </span>
                })}
              </div>
            </>
          );
        })}
      </>
    );
  }

  // Creates new contact form */
  function displayAddContact() {
    return <AddContact toggleAddContact={toggleAddContact} displayName={displayName}></AddContact>;
  }

  // Displays or hides add contact form */
  function toggleAddContact() {
    // Disable contacts list to prevent seeing part of the list when looking at add contact form
    const contacts = document.querySelector('.contacts');
    const addContact = document.querySelector('.add-contact');

    contacts.style.display = contacts.style.display === 'none' ? 'flex' : 'none';
    addContact.style.display = addContact.style.display === 'flex' ? 'none' : 'flex';
  }

  // Displays the information of the selected contact
  function displayCurrentContact() {
    return <CurrentContact></CurrentContact>
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

    // Get contats from database through the server
    if (displayName) {
      getContacts();
    }
  }, [displayName]);

  return(
    <>
      <div className='contact-wrapper'>
        {/* Display add contact form (hidden by default) */}
        {displayAddContact()}

        {/* Display current contact element (hidden by default) */}
        {displayCurrentContact()}

        {/* Header buttons */}
        <div className='contact-header-buttons'>
          <Link className='list-link'
                to='/lists'>
            Lists
          </Link>
          <img className='add-contact-img' onClick={toggleAddContact} src="add.png" alt="" />
        </div>

        {/* Header */}
        <div className='contact-header-div'>
          <img className='edit-button' onClick={toggleEdit} src="edit.png" alt="" />
          <input className='contact-header' type="text" defaultValue={displayName}/>
        </div>

        {/* Search bar component */}
        <SearchBar></SearchBar>

        {/* Contact entries */}
        <div className='contacts'>
          {contacts && displayContacts()}
        </div>
      </div>
    </>
  )
}

export default Contact;
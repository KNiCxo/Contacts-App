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

  // Get name of list from URL parameter
  let {listName} = useParams();

  // Set the display name of the list from listName
  const [displayName, setDisplayName] = useState(listName);

  // Checks whether the add contacts form is displayed or not
  const [addContactDisplayed, setAddContactDisplayed] = useState(false);

  // Checks whether the current contacts form is displayed or not
  const [contactDisplayed, setContactDisplayed] = useState(false);

  // Checks whether contact is being edited or not
  const [editingContact, setEditingContact] = useState(false);

  // Immutable contacts list used to remember the original, non-filtered version
  const [contacts, setContacts] = useState(null);

  // Contacts array that can change during app usage
  const [mutableContacts, setMutableContacts] = useState(null);

  // Store data for current contact
  const [contact, setContact] = useState(null);
  const [updatedPicture, setUpdatedPicture] = useState(null);
  const [contactNumbers, setContactNumbers] = useState([]);
  const [contactEmails, setContactEmails] = useState([]);

  const getLists = async () => {
    const response = await fetch('http://localhost:4001/getLists');
    const data = await response.json();

    // If a contact list doesn't exist, make a POST request to the server to create one and update contactLists
    // Else, set displayName or redirect to error page
    if (data == '') {
      fetch('http://localhost:4001/initListTable', {
        method: 'POST'
      });

      fetch(`http://localhost:4001/createList/Contacts`, {
        method: 'POST'
      });

      setDisplayName('Contacts');
    } else {
      // If URL doesn't have a param, use first contact lists in array
      // Else if URL doesn't have a param, use first contact list in array
      // Else set displayName equal to URL param
      if (displayName === undefined && data.length > 0) {
        setDisplayName(data[0].ListName);
      } else if (!data.some(e => e.ListName === displayName)) {
        navigate('/error');
      } else {
        setDisplayName(listName);
      }
    } 
  }
  
  // API call to server to get contacts data from database
  const getContacts = async () => {
    const response = await fetch(`http://localhost:4001/getContacts/${displayName}`);
    const data = await response.json();
    sortContacts(data);
  }

  // Sorts contacts into alphabeticall order
  function sortContacts(list) { 
    list.sort((a, b) => {
      let nameA;
      let nameB;
      
      // If statement handles cases where the last names match and are not empty, therefore
      // must be sorted based on first names or company name

      // Else if statement handles cases where the first names match, are not empty, and
      // there are no last names, therefore must be sorted based on company name

      // Else statement handles the rest of the cases
      if ((a.LastName.toLowerCase() === b.LastName.toLowerCase()) && (a.LastName != '' && b.LastName != '')) {
        // If the first names match and are not empty, then set nameA and nameB to the company names
        // Else, set nameA and nameB to the first names
        if (a.FirstName.toLowerCase() === b.FirstName.toLowerCase() && (a.FirstName != '' && b.FirstName != '')) {
          nameA = a.Company.toLowerCase();
          nameB = b.Company.toLowerCase();
        } else {
          nameA = a.FirstName.toLowerCase();
          nameB = b.FirstName.toLowerCase();
        }
      } else if (a.FirstName.toLowerCase() === b.FirstName.toLowerCase() && 
                (a.FirstName != '' && b.FirstName != '') &&
                (a.LastName == '' && b.LastName == '')) {
          nameA = a.Company.toLowerCase();
          nameB = b.Company.toLowerCase();   
      } else {
        // Sets the nameA and nameB variables to either the last name, first name, or company
        // based on that priority order
        if (a.LastName === '') {
          if (a.FirstName === '') {
            nameA = a.Company.toLowerCase();
          } else {
            nameA = a.FirstName.toLowerCase();
          }
        } else {
          nameA = a.LastName.toLowerCase();
        }
  
        if (b.LastName === '') {
          if (b.FirstName === '') {
            nameB = b.Company.toLowerCase();
          } else {
            nameB = b.FirstName.toLowerCase();
          }
        } else {
          nameB = b.LastName.toLowerCase();
        }
      }
    
      // Test if either name has a digit as the first character
      const hasDigitA = /^\d/.test(nameA.charAt(0));
      const hasDigitB = /^\d/.test(nameB.charAt(0));

      // Test if either name has a symbol as the first character
      const hasSymbolA  = ((/[^a-zA-Z]/.test(nameA.charAt(0))));
      const hasSymbolB = ((/[^a-zA-Z]/.test(nameB.charAt(0)))); 

      // If both have digits as the first character then compare normally
      if (hasDigitA && hasDigitB) {
        // If nameA < nameB then place nameA before nameB
        // Else place nameB before nameA
        if (nameA < nameB) return -1;
        if (nameA > nameB) return 1;
        return 0;
      }

      // If nameA is has a digit as the first character and nameB has a symbol
      // as the first character then place after nameB and vice versa
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

      // If nameA has a symbol as the first character then place after nameB and vice versa
      if (hasSymbolA) return 1;
      if (hasSymbolB) return -1;

      // If nameA < nameB then place nameA before nameB
      // Else place nameB before nameA
      if (nameA < nameB) return -1;
      if (nameA > nameB) return 1;
      return 0;
    });

    // Update contacts array
    setMutableContacts(list);
    setContacts(list);
  }

  // Filters contacts when search bar is used
  function filterContacts() {
    // Get value of search bar input field
    const searchInput = document.querySelector('.search-field').value.toLowerCase();

    const filteredContacts = contacts.filter((contact) => {
      // Uses these paramters for filtering
      let firstName = contact.FirstName.toLowerCase();
      let lastName = contact.LastName.toLowerCase();
      let company = contact.Company.toLowerCase();

      // Keep contact if input value exists in the first name or last name
      // or if first name and last name is empty but the input value exists in the company name
      return firstName.indexOf(searchInput) > -1 || 
             lastName.indexOf(searchInput) > -1 || 
             (firstName == '' && lastName == '' && company.indexOf(searchInput) > -1);
    });

    // Update contacts
    setMutableContacts(filteredContacts);
  }

  // Displays contacts, grouped and seperated by a letter header
  function displayContacts() {
    // Create object to put all contacts into groups
    let groupedContacts = {};

    // Iterate through contacts array to sort them into groups
    mutableContacts.forEach((contact, _) => {
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
            <div className='alphabet-group' key={letter}>
              <span className='alphabet-header' key={letter}>{letter}</span>
              {groupedContacts[letter].map((entry) => {
                return <span className='contact-entry' 
                              key={entry.ContactId} 
                              onClick={() => toggleCurrentContact(entry)}>
                          {(entry.FirstName && entry.LastName) ? 
                          `${entry.FirstName} ${entry.LastName}` :
                          (entry.LastName) ?
                          `${entry.LastName}` : 
                          (entry.FirstName) ? 
                          `${entry.FirstName}` :
                          `${entry.Company}`}
                        </span>
              })}
            </div>
          );
        })}
      </>
    );
  }

  // Displays or hides add contact form
  function toggleAddContact() {
    // Disable contacts list to prevent seeing part of the list when looking at add contact form
    const contacts = document.querySelector('.contacts');

    if (!addContactDisplayed) {
      contacts.style.display = 'none';
      setAddContactDisplayed(true);
    } else {
      contacts.style.display = 'flex';

      if (editingContact == true) {
        setEditingContact(false);
        setContactDisplayed(true);
      }

      setAddContactDisplayed(false);
    }
  }

  // Displays or hides the current contact form 
  const toggleCurrentContact = async (entry) => {
    // Disable contacts list to prevent seeing part of the list when looking at add contact form
    const contacts = document.querySelector('.contacts');
    const topSection = document.querySelector('.contact-top');
    
    // If there is a valid entry parameter in the function call, then gather contact info
    // Else clear updated picture variable to not conflict with other add contact uses
    if (entry != undefined) {
      // Gather phone number data
      const numberResponse = await fetch(`http://localhost:4001/getContactNumbers/${displayName}/${entry.ContactId}`);
      const numberData = await numberResponse.json();

      // Gather email data
      const emailResponse = await fetch(`http://localhost:4001/getContactEmails/${displayName}/${entry.ContactId}`);
      const emailData = await emailResponse.json();

      // Store entry data
      setContact(entry);
      setContactNumbers(numberData);
      setContactEmails(emailData);
    } else {
      setUpdatedPicture(null);
    }

    // Displays/hides other HTML components on page and displays/hides current contact form
    if (!contactDisplayed) {
      contacts.style.display = 'none';
      topSection.style.display = 'none';
      setContactDisplayed(true);
    } else {
      contacts.style.display = 'flex';
      topSection.style.display = 'block';
      setContactDisplayed(false);
    }
  }

  // Enables/disables editing for page header
  const toggleHeaderEdit = async () => {
    const header = document.querySelector('.contact-header');
    if (header.contentEditable === 'true') {
      header.style.outline = 'none';
      header.contentEditable = false;
      header.disabled = true;
    
      await fetch(`http://localhost:4001/updateListName`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',  // Add Content-Type header
        },
        body: JSON.stringify({
          NewName: header.value,
          OldName: displayName
        })
      });
    } else {
      header.style.outline = '1px solid white';
      header.contentEditable = true;
      header.disabled = false;
      header.focus();
      header.setSelectionRange(100, 100);
    }
  }

  useEffect(() => {
    // Get contact lists and set display name or redirect to error page
    getLists();
  }, []);

  useEffect(() => {
    // Get contacts from database through the server
    if (displayName) {
      getContacts();
    }
  }, [displayName, addContactDisplayed, contactDisplayed]);

  return(
    <>
      <div className='contact-wrapper'>
        {/* Display add contact form (hidden by default) */}
        {addContactDisplayed && 
        <AddContact toggleAddContact={toggleAddContact} 
                    toggleCurrentContact={toggleCurrentContact}
                    editingContact={editingContact}
                    setUpdatedPicture={setUpdatedPicture}
                    displayName={displayName}
                    contact={contact}
                    contactNumbers={contactNumbers}
                    contactEmails={contactEmails}
                    listCount={contacts.length}>
        </AddContact>}

        {/* Display current contact element (hidden by default) */}
        {contactDisplayed && 
        <CurrentContact toggleCurrentContact={toggleCurrentContact}
                        toggleAddContact={toggleAddContact}
                        setEditingContact={setEditingContact}
                        displayName={displayName}
                        contact={contact}
                        updatedPicture={updatedPicture}
                        contactNumbers={contactNumbers}
                        contactEmails={contactEmails}
                        listCount={contacts.length}>
        </CurrentContact>}
        
        <div className='contact-top'>
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
            <img className='edit-button' onClick={toggleHeaderEdit} src="edit.png" alt="" />
            <input className='contact-header' type="text" defaultValue={displayName}/>
          </div>

          {/* Search bar component */}
          <SearchBar filterContacts={filterContacts}></SearchBar>
        </div>

        {/* Contact entries */}
        <div className='contacts'>
          {mutableContacts && displayContacts()}
        </div>
      </div>
    </>
  )
}

export default Contact;
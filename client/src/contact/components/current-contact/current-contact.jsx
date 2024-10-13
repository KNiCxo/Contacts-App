import './current-contact.css';

function CurrentContact() {
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
            <input className='current-birthday' type="date" defaultValue='2002-11-03'/>
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

export default CurrentContact;
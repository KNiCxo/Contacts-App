import {Link} from 'react-router-dom';

import './error.css';

function Error() {
  return(
    <>
      <div className='error-div'>
        <h1 className='error-label'>ERROR:</h1>
        <h2 className='error-message'>List could not be found</h2>
        <Link className='home-link' to='/'>Go to Home</Link>
      </div>
    </>
  )
}

export default Error;
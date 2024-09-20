import {Link} from 'react-router-dom';

function Error() {
  return(
    <>
      <h1>List could not be found</h1>
      <Link to='/'>Go to Home</Link>
    </>
  )
}

export default Error;
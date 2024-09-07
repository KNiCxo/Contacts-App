import './search-bar.css';

function SearchBar() {
  return(
    <>
      <div className='search-container'>
        <img className='search-icon' src="search.png" alt="" />
        <input className='search-field' placeholder='Search' type="text" />
      </div>
    </>
  )
}

export default SearchBar;
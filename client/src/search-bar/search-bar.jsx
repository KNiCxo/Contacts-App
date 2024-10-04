import './search-bar.css';

// Allows the for the filtering of the contact entries
function SearchBar() {
  return(
    <>
      {/* Search bar HTML */}
      <div className='search-container'>
        <img className='search-icon' src="search.png" alt="" />
        <input className='search-field' placeholder='Search' type="text" />
      </div>
    </>
  )
}

export default SearchBar;
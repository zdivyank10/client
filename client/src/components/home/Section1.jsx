import React, { useState, useEffect } from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import './home.css';
import { useAuth } from '../../store/auth';

function Section1() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [searchError, setSearchError] = useState(false); // State variable for search error
  const { searchQuery } = useParams();
  const {API_BASE_URL} = useAuth();

  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchQuery,searchResults]);

  const handleSearch = async (searchQuery) => {
    try {
      setLoading(true);
      setSearchError(false); // Reset search error state

      if (!searchQuery.trim()) {
        setSearchError(true); // Set search error if query is empty
        return;
      }

      const response = await fetch(`${API_BASE_URL}api/blog/search?query=${encodeURIComponent(searchQuery)}`, {
        method: 'POST'
      });
      if (response.ok) {
        const searchData = await response.json();
        setSearchResults(searchData);
        if (searchData.length === 0) {
          setSearchError(true); // Set search error if no results found
        }
      } else {
        console.error('Failed to fetch search results:', response.statusText);
      }
      console.log('search data:', searchResults);
    } catch (error) {
      console.error('Error searching blogs:', error);
      setSearchError(true); // Set search error if there's an error
    } finally {
      setLoading(false);
    }
  };

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  return (
    <div className="home_container">
      <div className="home_left">
        <h1 data-aos="fade-right" className='home_left_h1'>Welcome to Ink Garden</h1>
        <p data-aos="fade-right" className='home_left_p'>
          In our digital haven, every thought, idea, and emotion finds expression.
          Welcome to Ink Garden, where the power of words blossoms into captivating narratives.
        </p>
        <div className="search_container">
          <MdOutlineSearch className='searchicon' />
          <input
            data-aos="fade-right"
            type="text"
            className='left_search'
            placeholder='Search blog'
            value={query}
            onChange={handleInputChange}
            required
          />
          <button onClick={() => handleSearch(query)} className="search_btn btn btn-dark">
            Search
          </button>
        </div>
        {loading && <p>Loading...</p>}
        <div>
          
        {searchError && <p className='ms-5'>No blogs found related to '{query}'</p>} 
          {searchResults.filter(result => result.permission === 'true')
          .map(result => (
            <Link to={`/blog/${result._id}`} key={result.id} className="search_result">
              <img src={`${API_BASE_URL}uploads/${result.cover_img}`} alt={result.title} className="search_result_image" height={100} />
              <div className="searchinfo m-3">
                <h3 className='text-dark'>{result.author_id?.username}</h3>
                <h5 className='text-dark'>{result.title}</h5>
                <div className="tags">
                  {result.tags.map((tag, tagIndex) => (
                    <span key={tagIndex} className="text-dark tag">
                      {tag}
                    </span>
                  ))}
                </div>
        <hr />
              </div>
            </Link>
          ))}
        </div>
      </div>
      <div data-aos="fade-left" className="home_right">
        <img
          src="https://images.pexels.com/photos/267569/pexels-photo-267569.jpeg?auto=compress&cs=tinysrgb&w=1260&h=750&dpr=1"
          alt="image for homepage"
          className='home_img'
        />
      </div>
    </div>
  );
}

export default Section1;

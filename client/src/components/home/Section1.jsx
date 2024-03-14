import React, { useState, useEffect } from 'react';
import { MdOutlineSearch } from 'react-icons/md';
import { Link, useParams } from 'react-router-dom';
import './home.css';

function Section1() {
  const [query, setQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const { searchQuery } = useParams();

  useEffect(() => {
    if (searchQuery) {
      setQuery(searchQuery);
      handleSearch(searchQuery);
    }
  }, [searchQuery]);

  const handleSearch = async (searchQuery) => {
    try {
      setLoading(true);
      const response = await fetch(`http://localhost:8000/api/blog/search?query=${encodeURIComponent(searchQuery)}`, {
        method: 'POST'
      });
      if (response.ok) {
        const searchData = await response.json();
        setSearchResults(searchData);

      } else {
        console.error('Failed to fetch search results:', response.statusText);
      }
      console.log('search data:', searchResults);
    } catch (error) {
      console.error('Error searching blogs:', error);
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
          />
          <button onClick={() => handleSearch(query)} className="search_btn btn btn-dark">
            Search
          </button>

          <div className=''>
          {searchResults.map(result => (
            <div key={result._id}>
              <Link to={`/blog/${result._id}`} className="search_result">
                <img src={`http://localhost:8000/uploads/${result.cover_img}`} alt={result.title} className="search_result_image" height={80} />
                <div className="searchinfo m-3">
                  <h3 className='text-dark'>{result.title}</h3>
                  <div className="tags">
                    {result.tags.map((tag, tagIndex) => (
                      <span key={tagIndex} className="text-dark tag">
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </Link>
              <hr />
            </div>
          ))}
        </div>
        </div>
        {loading && <p>Loading...</p>}
      

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

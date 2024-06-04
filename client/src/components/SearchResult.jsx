// searchresult.js

import React, { useEffect, useState } from 'react';
import axios from 'axios'; // Import Axios for making HTTP requests

const SearchResult = ({ location }) => {
  const [searchResults, setSearchResults] = useState([]);
  const searchTerm = new URLSearchParams(location.search).get('q');

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`/api/search?q=${searchTerm}`);
        setSearchResults(response.data);
      } catch (error) {
        console.error('Error fetching search results:', error);
      }
    };

    fetchData();
  }, [searchTerm]);

  return (
    <div>
      <h1>Search Results for: {searchTerm}</h1>
      <ul>
        {searchResults.map((result, index) => (
          <li key={index}>{result.title}</li>
        ))}
      </ul>
    </div>
  );
};

export default SearchResult;

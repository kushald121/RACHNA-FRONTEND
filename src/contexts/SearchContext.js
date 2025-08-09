import React, { createContext, useContext, useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';

const SearchContext = createContext();

export const useSearch = () => {
  const context = useContext(SearchContext);
  if (!context) {
    throw new Error('useSearch must be used within a SearchProvider');
  }
  return context;
};

export const SearchProvider = ({ children }) => {
  const [searchQuery, setSearchQuery] = useState('');
  const location = useLocation();
  const navigate = useNavigate();

  // Extract search query from URL on component mount
  useEffect(() => {
    const urlParams = new URLSearchParams(location.search);
    const query = urlParams.get('search') || '';
    setSearchQuery(query);
  }, [location.search]);

  const updateSearchQuery = (query) => {
    setSearchQuery(query);
    
    // Update URL with search parameter
    const urlParams = new URLSearchParams(location.search);
    if (query.trim()) {
      urlParams.set('search', query.trim());
    } else {
      urlParams.delete('search');
    }
    
    const newSearch = urlParams.toString();
    const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    
    navigate(newPath, { replace: true });
  };

  const clearSearch = () => {
    setSearchQuery('');
    const urlParams = new URLSearchParams(location.search);
    urlParams.delete('search');
    const newSearch = urlParams.toString();
    const newPath = `${location.pathname}${newSearch ? `?${newSearch}` : ''}`;
    navigate(newPath, { replace: true });
  };

  const value = {
    searchQuery,
    updateSearchQuery,
    clearSearch,
  };

  return (
    <SearchContext.Provider value={value}>
      {children}
    </SearchContext.Provider>
  );
}; 
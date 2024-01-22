import React, { useState, useEffect } from 'react';
import InputComponent from '../InputComponent/InputComponent';
import SuggestionsComponent from '../SuggestionsComponent/SuggestionsComponent';
import useDebounce from '../../hooks/useDebounce';
import styles from './Autocomplete.module.css';

interface User {
  name: string;
}

function Autocomplete() {
  const [query, setQuery] = useState<string>('');
  const [suggestions, setSuggestions] = useState<User[]>([]);
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);

  // Use debounce for the input change
  const debouncedQuery = useDebounce(query, 300);

  // Fetch data based on the debounced query
  useEffect(() => {
    if (!debouncedQuery) {
      // If input is empty, clear suggestions
      setSuggestions([]);
      setError(null);
      return;
    }

    setLoading(true); // Set loading to true when fetching data

    // Fetch data from the JSONPlaceholder API (users endpoint)
    fetch(`https://jsonplaceholder.typicode.com/users`)
      .then((response) => {
        if (!response.ok) {
          throw new Error('Network response was not ok');
        }
        return response.json();
      })
      .then((data: User[]) => {
        // Filter users based on the name
        const matchingUsers: User[] = data.filter((user) =>
          user.name.toLowerCase().includes(debouncedQuery.toLowerCase())
        );

        setSuggestions(matchingUsers);
        setError(null); // Clear any previous errors
      })
      .catch((error) => {
        console.error('Error fetching data from JSONPlaceholder API:', error);
        setError('Error fetching data. Please try again.'); // Set error message
      })
      .finally(() => {
        setLoading(false); // Set loading to false after fetching data, whether successful or not
      });
  }, [debouncedQuery]);

  // Handle input change
  const handleInputChange = (value: string) => {
    setQuery(value);
    setError(null);
  };

  // Handle clear action
  const handleClear = () => {
    setQuery('');
    setSuggestions([]); // Clear suggestions when the input is cleared
    setError(null); // Clear any previous errors
  };

  // Handle suggestion selection
  const handleSuggestionSelect = (name: string) => {
    setQuery(name);
  };

  return (
    <div className={styles.autocompleteContainer}>
      <h1 className={styles.title}>Search users</h1>
      <InputComponent
        value={query}
        onChange={handleInputChange}
        onClear={handleClear}
      />
      {loading && <div className={styles.loader} />}
      {error && <div className={styles.message}>Error: {error}</div>}
      {query && suggestions && !loading && !error && (
        <SuggestionsComponent
          suggestions={suggestions}
          query={query}
          onSelect={handleSuggestionSelect}
        />
      )}
    </div>
  );
}

export default Autocomplete;

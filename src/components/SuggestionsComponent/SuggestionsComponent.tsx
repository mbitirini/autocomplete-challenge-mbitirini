import React from 'react';
import styles from './SuggestionsComponent.module.css';

interface SuggestionsComponentProps {
  suggestions: { name: string }[];
  query: string;
  onSelect: (name: string) => void;
}

// Highlights the matching part of the suggestion based on the input value.
const highlightMatch = (
  suggestion: string,
  inputValue: string
): React.ReactNode => {
  const regex = new RegExp(`(${inputValue})`, 'ig');
  return suggestion
    .split(regex)
    .map((part, index) => (
      <React.Fragment key={index}>
        {regex.test(part) ? <strong>{part}</strong> : part}
      </React.Fragment>
    ));
};

const SuggestionsComponent: React.FC<SuggestionsComponentProps> = ({
  suggestions,
  query,
  onSelect,
}: SuggestionsComponentProps) => {
  return (
    <div className={styles.dropdownContainer}>
      {query && suggestions.length > 0 && (
        <div className={styles.dropdownList}>
          {suggestions.map((suggestion, index) => (
            <div
              key={index}
              className={styles.dropdownItem}
              onClick={() => onSelect(suggestion.name)}
            >
              {highlightMatch(suggestion.name, query)}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default SuggestionsComponent;

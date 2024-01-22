import React from 'react';
import styles from './InputComponent.module.css';

interface InputComponentProps {
  value: string;
  onChange: (value: string) => void;
  onClear: () => void;
}

function InputComponent({ value, onChange, onClear }: InputComponentProps) {
  return (
    <div className={styles.inputContainer}>
      <input
        type='text'
        onChange={(e) => onChange(e.target.value)}
        placeholder='Type to search...'
        className={styles.inputField}
        value={value}
        maxLength={25}
      />

      <div className={styles.rightContent}>
        {value ? (
          <button className={styles.clearButton} onClick={onClear}>
            X
          </button>
        ) : (
          <span className={styles.searchIcon}>&#128269;</span>
        )}
      </div>
    </div>
  );
}

export default InputComponent;

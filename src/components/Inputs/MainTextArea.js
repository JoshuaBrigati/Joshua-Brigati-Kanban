import React, { useState } from 'react';


export const MainTextArea = ({
  inputType,
  inputLabel,
  className,
  isRequired,
  onChange,
  errorType,
  errorTextOveride,
  onBlur,
  inputValue
}) => {
  const getErrorText = () => {
    if (errorType === 'required') {
      return `${inputLabel} is required.`;
    }
  };

  return (
    <div
      className={`main-textarea ${className}`}
    >
      <label className='main-textarea-label'>{inputLabel}</label>
      <textarea
        type={inputType}
        required={isRequired}
        onChange={(e) => onChange(e)}
        onBlur={onBlur ? (e) => onBlur(e) : () => {}}
        className={`${errorType === 'required' ? 'error' : ''}`}
        value={inputValue}
      >
      </textarea>
      <div className={'error-text'}>{errorTextOveride ? errorTextOveride : getErrorText()}</div>
    </div>
  );
};

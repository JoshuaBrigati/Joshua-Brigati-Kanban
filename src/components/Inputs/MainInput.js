import React from 'react';


export const MainInput = ({
  inputValue,
  inputType,
  inputLabel,
  className,
  isRequired,
  onChange,
  errorType,
  errorTextOveride,
  onBlur,
  autoFocus
}) => {
  const getErrorText = () => {
    if (errorType === 'required') {
      return `${inputLabel} is required.`;
    } else if (errorType === 'pattern' && inputType === 'email') {
      return `Please provide a valid ${inputType}.`;
    }
  };

  return (
    <div
      className={`main-input ${className}
        ${errorType === 'pattern' && inputType === 'email' ? 'special' : ''}
        ${errorTextOveride ? 'special' : ''}`}
    >
      <label>{inputLabel}</label>
      <input
        type={inputType}
        required={isRequired}
        value={inputValue}
        onChange={(e) => onChange(e)}
        onBlur={onBlur ? (e) => onBlur(e) : () => {}}
        autoFocus={autoFocus}
      />
      <div className={'error-text'}>{errorTextOveride ? errorTextOveride : getErrorText()}</div>
    </div>
  );
};

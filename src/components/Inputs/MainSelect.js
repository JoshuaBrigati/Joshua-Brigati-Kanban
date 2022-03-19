export const MainSelect = ({
  inputValue,
  inputType,
  inputLabel,
  className,
  isRequired,
  onChange,
  errorType,
  errorTextOveride,
  onBlur,
  options,
  hidePlaceholderOption,
}) => {
  const getErrorText = () => {
    if (errorType === 'required') {
      return `${inputLabel} is required.`;
    }
  };

  return (
    <div
      className={`main-select ${className}`}
    >
      <label className='main-select-label'>{inputLabel}</label>
      <select
        type={inputType}
        required={isRequired}
        onChange={(e) => onChange(e)}
        onBlur={onBlur ? (e) => onBlur(e) : () => {}}
        className={`${errorType === 'required' ? 'error' : ''}`}
        defaultValue={inputValue}
      >
        {!hidePlaceholderOption && <option value="">Select an option</option>}
        {options.map((column, index) => <option value={column.id} key={index}>{column.name.toUpperCase()}</option>)}
      </select>
      <div className={'error-text'}>{errorTextOveride ? errorTextOveride : getErrorText()}</div>
    </div>
  );
};

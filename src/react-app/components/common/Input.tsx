import { CSSProperties, ChangeEvent, memo, useCallback } from 'react';

interface InputProps {
  label?: string;
  type?: 'text' | 'email' | 'tel' | 'password' | 'number' | 'url';
  value: string;
  onChange: (value: string) => void;
  error?: string;
  placeholder?: string;
  required?: boolean;
  disabled?: boolean;
  className?: string;
  name?: string;
}

const Input = memo<InputProps>(function Input({
  label,
  type = 'text',
  value,
  onChange,
  error,
  placeholder,
  required = false,
  disabled = false,
  className = '',
  name,
}) {
  const handleChange = useCallback((e: ChangeEvent<HTMLInputElement>) => {
    onChange(e.target.value);
  }, [onChange]);

  return (
    <div className={`input-wrapper ${className}`} style={wrapperStyle}>
      {label && (
        <label style={labelStyle}>
          {label}
          {required && <span style={requiredStyle}>*</span>}
        </label>
      )}
      <input
        type={type}
        value={value}
        onChange={handleChange}
        placeholder={placeholder}
        required={required}
        disabled={disabled}
        name={name}
        style={{
          ...inputStyle,
          ...(error ? errorInputStyle : {}),
          ...(disabled ? disabledInputStyle : {}),
        }}
        onFocus={(e) => {
          if (!error && !disabled) {
            e.currentTarget.style.borderColor = '#2563eb';
            e.currentTarget.style.outline = '2px solid rgba(37, 99, 235, 0.1)';
          }
        }}
        onBlur={(e) => {
          if (!error) {
            e.currentTarget.style.borderColor = '#e2e8f0';
            e.currentTarget.style.outline = 'none';
          }
        }}
        aria-invalid={!!error}
        aria-describedby={error ? `${name}-error` : undefined}
      />
      {error && <span id={`${name}-error`} style={errorTextStyle}>{error}</span>}
    </div>
  );
});

Input.displayName = 'Input';

export default Input;

const wrapperStyle: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '0.375rem',
  width: '100%',
};

const labelStyle: CSSProperties = {
  fontSize: '0.875rem',
  fontWeight: 500,
  color: '#1e293b',
  marginBottom: '0.25rem',
};

const requiredStyle: CSSProperties = {
  color: '#ef4444',
  marginLeft: '0.25rem',
};

const inputStyle: CSSProperties = {
  padding: '0.625rem 0.75rem',
  fontSize: '0.875rem',
  borderRadius: '0.375rem',
  border: '1px solid #e2e8f0',
  backgroundColor: '#ffffff',
  color: '#1e293b',
  transition: 'all 0.2s',
  width: '100%',
  outline: 'none',
};

const errorInputStyle: CSSProperties = {
  borderColor: '#ef4444',
  outline: '2px solid rgba(239, 68, 68, 0.1)',
};

const disabledInputStyle: CSSProperties = {
  backgroundColor: '#f1f5f9',
  cursor: 'not-allowed',
  opacity: 0.6,
};

const errorTextStyle: CSSProperties = {
  fontSize: '0.75rem',
  color: '#ef4444',
  marginTop: '0.25rem',
};
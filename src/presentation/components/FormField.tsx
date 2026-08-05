import type { InputHTMLAttributes } from "react";

type FormFieldProps = InputHTMLAttributes<HTMLInputElement> & {
  id: string;
  label: string;
  error?: string;
};

const FormField = ({ id, label, error, className, ...inputProps }: FormFieldProps) => (
  <div className="tirr__form-field">
    <label htmlFor={id}>{label}</label>
    <input
      id={id}
      className={`form-control ${className ?? ""}`}
      aria-invalid={Boolean(error)}
      aria-describedby={error ? `${id}-error` : undefined}
      {...inputProps}
    />
    {error && <small id={`${id}-error`} role="alert">{error}</small>}
  </div>
);

export default FormField;

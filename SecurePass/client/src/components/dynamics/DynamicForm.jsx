import React, { useState, useMemo } from "react";
import "./DynamicForm.css";

const DynamicForm = ({
  fields = [],
  initialValues = {},
  submitLabel = "Submit",
  onSubmit = () => {},
  columns = 2,
  onCancel,                // <-- new (handled inside the form)
  cancelLabel = "Cancel",  // <-- optional label
  resetOnCancel = false,   // <-- optional: reset state on cancel
  className = "",
}) => {
  const initial = useMemo(() => {
    const seed = {};
    fields.forEach((f) => {
      seed[f.name] = initialValues[f.name] ?? "";
    });
    return seed;
  }, [fields, initialValues]);

  const [values, setValues] = useState(initial);

  const handleChange = (e, field) => {
    const val =
      field.type === "number"
        ? e.target.value === ""
          ? ""
          : Number(e.target.value)
        : e.target.value;
    setValues((v) => ({ ...v, [field.name]: val }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    const valuesArray = fields.map((f) => values[f.name]);
    onSubmit(valuesArray, values);
  };

  const handleCancel = () => {
    if (resetOnCancel) setValues(initial);
    if (onCancel) onCancel();
  };

  return (
    <form
      onSubmit={handleSubmit}
      className={`dynamic-form ${className}`}
      style={{ gridTemplateColumns: `repeat(${columns}, 1fr)` }}
    >
      {fields.map((field) => (
        <div className="form-group" key={field.name}>
          <label htmlFor={field.name}>
            {field.label}
            {field.required && <span className="required">*</span>}
          </label>

          {field.type === "textarea" ? (
            <textarea
              id={field.name}
              name={field.name}
              value={values[field.name]}
              placeholder={field.placeholder ?? field.label}
              required={!!field.required}
              onChange={(e) => handleChange(e, field)}
            />
          ) : (
            <input
              type={field.type || "text"}
              id={field.name}
              name={field.name}
              value={values[field.name]}
              placeholder={field.placeholder ?? field.label}
              required={!!field.required}
              onChange={(e) => handleChange(e, field)}
            />
          )}

          {field.help && <small className="help-text">{field.help}</small>}
        </div>
      ))}

      <div className="form-actions">
        {onCancel && (
          <button
            type="button"
            className="btn btn-secondary"
            onClick={handleCancel}
          >
            {cancelLabel}
          </button>
        )}
        <button type="submit" className="btn btn-primary">
          {submitLabel}
        </button>
      </div>
    </form>
  );
};

export default DynamicForm;

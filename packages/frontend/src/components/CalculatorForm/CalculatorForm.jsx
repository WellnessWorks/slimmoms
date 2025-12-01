import React, { useState } from "react";
import styles from "./CalculatorForm.module.css";

const initialState = {
  height: "",
  age: "",
  currentWeight: "",
  desiredWeight: "",
  bloodType: "1",
};

const CalculatorForm = ({ onSubmit }) => {
  const [values, setValues] = useState(initialState);
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;
    setValues((prev) => ({ ...prev, [name]: value }));
  };

  const validate = () => {
    const newErrors = {};

    if (!values.height || Number(values.height) <= 0) {
      newErrors.height = "Height is required";
    }
    if (!values.age || Number(values.age) <= 0) {
      newErrors.age = "Age is required";
    }
    if (!values.currentWeight || Number(values.currentWeight) <= 0) {
      newErrors.currentWeight = "Current weight is required";
    }
    if (!values.desiredWeight || Number(values.desiredWeight) <= 0) {
      newErrors.desiredWeight = "Desired weight is required";
    }
    if (!values.bloodType) {
      newErrors.bloodType = "Blood type is required";
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!validate()) return;

    onSubmit({
      height: Number(values.height),
      age: Number(values.age),
      currentWeight: Number(values.currentWeight),
      desiredWeight: Number(values.desiredWeight),
      bloodType: Number(values.bloodType),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* 1. satır: Height & Desired weight */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>
            Height *
            <input
              type="number"
              name="height"
              value={values.height}
              onChange={handleChange}
              className={styles.input}
              placeholder="cm"
            />
          </label>
          {errors.height && (
            <span className={styles.error}>{errors.height}</span>
          )}
        </div>

        <div className={styles.field}>
          <label className={styles.label}>
            Desired weight *
            <input
              type="number"
              name="desiredWeight"
              value={values.desiredWeight}
              onChange={handleChange}
              className={styles.input}
              placeholder="kg"
            />
          </label>
          {errors.desiredWeight && (
            <span className={styles.error}>{errors.desiredWeight}</span>
          )}
        </div>
      </div>

      {/* 2. satır: Age & Blood type */}
      <div className={styles.row}>
        <div className={styles.field}>
          <label className={styles.label}>
            Age *
            <input
              type="number"
              name="age"
              value={values.age}
              onChange={handleChange}
              className={styles.input}
            />
          </label>
          {errors.age && <span className={styles.error}>{errors.age}</span>}
        </div>

        <div className={styles.field}>
          <span className={styles.label}>Blood type *</span>
          <div className={styles.radioGroup}>
            {[1, 2, 3, 4].map((num) => (
              <label key={num} className={styles.radioLabel}>
                <input
                  type="radio"
                  name="bloodType"
                  value={num}
                  checked={values.bloodType === String(num)}
                  onChange={handleChange}
                />
                <span>{num}</span>
              </label>
            ))}
          </div>
          {errors.bloodType && (
            <span className={styles.error}>{errors.bloodType}</span>
          )}
        </div>
      </div>

      {/* 3. satır: Current weight */}
      <div className={styles.row}>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.label}>
            Current weight *
            <input
              type="number"
              name="currentWeight"
              value={values.currentWeight}
              onChange={handleChange}
              className={styles.input}
              placeholder="kg"
            />
          </label>
          {errors.currentWeight && (
            <span className={styles.error}>{errors.currentWeight}</span>
          )}
        </div>
      </div>

      {/* Buton */}
      <button type="submit" className={styles.button}>
        Start losing weight
      </button>
    </form>
  );
};

export default CalculatorForm;

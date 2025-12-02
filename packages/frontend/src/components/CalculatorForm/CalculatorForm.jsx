import React, { useState } from "react";
import styles from "./CalculatorForm.module.css";

const initialState = {
  height: "",
  age: "",
  currentWeight: "",
  desiredWeight: "",
  bloodType: "",
  activityLevel: "",
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
    if (!values.activityLevel) {
      newErrors.activityLevel = "Activity level is required";
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
      activityLevel: Number(values.activityLevel),
    });
  };

  return (
    <form className={styles.form} onSubmit={handleSubmit}>
      {/* Height + Desired weight */}
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
              placeholder="Enter your height (cm)"
            />
          </label>
          {errors.height && <span className={styles.error}>{errors.height}</span>}
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
              placeholder="Target weight (kg)"
            />
          </label>
          {errors.desiredWeight && (
            <span className={styles.error}>{errors.desiredWeight}</span>
          )}
        </div>
      </div>

      {/* Age + Blood type */}
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
              placeholder="How old are you?"
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

      {/* Current weight */}
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
              placeholder="Your current weight (kg)"
            />
          </label>
          {errors.currentWeight && (
            <span className={styles.error}>{errors.currentWeight}</span>
          )}
        </div>
      </div>

      {/* Activity level */}
      <div className={styles.row}>
        <div className={`${styles.field} ${styles.fullWidth}`}>
          <label className={styles.label}>
            Activity level *
            <select
              name="activityLevel"
              value={values.activityLevel}
              onChange={handleChange}
              className={styles.input}
            >
              <option value="" disabled>
                Select activity level
              </option>
              <option value="1.2">Minimum (Sedentary)</option>
              <option value="1.375">Low (Light exercise 1-3 times/week)</option>
              <option value="1.55">Medium (Moderate exercise 3-5 times/week)</option>
              <option value="1.725">High (Hard exercise 6-7 times/week)</option>
              <option value="1.9">Maximum (Daily intense exercise or job)</option>
            </select>
          </label>
          {errors.activityLevel && (
            <span className={styles.error}>{errors.activityLevel}</span>
          )}
        </div>
      </div>

      <button type="submit" className={styles.button}>
        Start losing weight
      </button>
    </form>
  );
};

export default CalculatorForm;

import React, { useState } from "react";
import css from "./DailyCaloriesForm.module.css";

const BLOOD_GROUPS = [
  { label: "0", value: "1" },
  { label: "AB", value: "2" },
  { label: "A", value: "3" },
  { label: "B", value: "4" },
];

const ACTIVITY_LEVELS = [
  { label: "Minimum (Sedentary)", value: "1.2" },
  { label: "Low (Light exercise 1-3 times/week)", value: "1.375" },
  { label: "Medium (Moderate exercise 3-5 times/week)", value: "1.55" },
  { label: "High (Hard exercise 6-7 times/week)", value: "1.725" },
  { label: "Maximum (Daily intense exercise or job)", value: "1.9" },
];

const validateForm = (data) => {
  const errors = {};
  const parsedData = {};

  for (const key in data) {
    if (key !== "bloodType" && key !== "activityLevel") {
      parsedData[key] = parseInt(data[key], 10);
    } else {
      parsedData[key] = data[key];
    }
  } // zorunlu alanlar

  if (!parsedData.height || isNaN(parsedData.height)) {
    errors.height = "Height is required.";
  } else if (parsedData.height < 100 || parsedData.height > 250) {
    errors.height = "Height must be between 100 and 250 cm.";
  }

  if (!parsedData.age || isNaN(parsedData.age)) {
    errors.age = "Age is required.";
  } else if (parsedData.age < 18 || parsedData.age > 100) {
    errors.age = "Age must be between 18 and 100.";
  }

  if (!parsedData.currentWeight || isNaN(parsedData.currentWeight)) {
    errors.currentWeight = "Current weight is required.";
  } else if (parsedData.currentWeight < 20 || parsedData.currentWeight > 500) {
    errors.currentWeight = "Current weight must be between 20 and 500 kg.";
  }

  if (!parsedData.desiredWeight || isNaN(parsedData.desiredWeight)) {
    errors.desiredWeight = "Desired weight is required.";
  } else if (parsedData.desiredWeight < 20 || parsedData.desiredWeight > 500) {
    errors.desiredWeight = "Desired weight must be between 20 and 500 kg.";
  }

  if (
    !parsedData.bloodType ||
    !["1", "2", "3", "4"].includes(parsedData.bloodType)
  ) {
    errors.bloodType = "Blood type is required.";
  }

  if (
    !data.activityLevel ||
    !ACTIVITY_LEVELS.some((level) => level.value === data.activityLevel)
  ) {
    errors.activityLevel = "Activity level is required.";
  }

  return { errors, isValid: Object.keys(errors).length === 0 };
};

const DailyCaloriesForm = ({ onFormSubmit, isLoading }) => {
  const [formData, setFormData] = useState({
    height: "",
    age: "",
    currentWeight: "",
    desiredWeight: "",
    bloodType: BLOOD_GROUPS[0].value,
    activityLevel: ACTIVITY_LEVELS[2].value,
  });
  const [errors, setErrors] = useState({});

  const handleChange = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));

    if (errors[name]) {
      setErrors((prevErrors) => {
        const newErrors = { ...prevErrors };
        delete newErrors[name];
        return newErrors;
      });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    const { errors: validationErrors, isValid } = validateForm(formData);

    if (!isValid) {
      setErrors(validationErrors);
      console.error("Form doğrulama hatası:", validationErrors);
      return;
    }

    onFormSubmit(formData);

    setFormData({
      height: "",
      age: "",
      currentWeight: "",
      desiredWeight: "",
      bloodType: BLOOD_GROUPS[0].value,
      activityLevel: ACTIVITY_LEVELS[2].value,
    });
    setErrors({});
  };

  return (
    <div className={css.formContainer}>
      <h1 className="page-title">
        Calculate your daily calorie intake right now
      </h1>
      <form className={css.form} onSubmit={handleSubmit}>
        {/* 1. Height */}
        <div className={css.inputGroup}>
          <input
            className={`${css.inputField} ${
              errors.height ? css.inputError : ""
            }`}
            type="number"
            name="height"
            placeholder="Height *"
            value={formData.height}
            onChange={handleChange}
          />
          {errors.height && (
            <span className={css.errorMessage}>{errors.height}</span>
          )}
        </div>
        {/* 2. Age */}
        <div className={css.inputGroup}>
          <input
            className={`${css.inputField} ${errors.age ? css.inputError : ""}`}
            type="number"
            name="age"
            placeholder="Age *"
            value={formData.age}
            onChange={handleChange}
          />
          {errors.age && <span className={css.errorMessage}>{errors.age}</span>}
        </div>
        {/* 3. Current Weight */}
        <div className={css.inputGroup}>
          <input
            className={`${css.inputField} ${
              errors.currentWeight ? css.inputError : ""
            }`}
            type="number"
            name="currentWeight"
            placeholder="Current Weight *"
            value={formData.currentWeight}
            onChange={handleChange}
          />
          {errors.currentWeight && (
            <span className={css.errorMessage}>{errors.currentWeight}</span>
          )}
        </div>
        {/* 4. Desired Weight */}
        <div className={css.inputGroup}>
          <input
            className={`${css.inputField} ${
              errors.desiredWeight ? css.inputError : ""
            }`}
            type="number"
            name="desiredWeight"
            placeholder="Desired Weight *"
            value={formData.desiredWeight}
            onChange={handleChange}
          />
          {errors.desiredWeight && (
            <span className={css.errorMessage}>{errors.desiredWeight}</span>
          )}
        </div>
        {/* 5. Blood Type */}
        <div
          className={`${css.radioGroup} ${
            errors.bloodType ? css.groupError : ""
          }`}
        >
          <span className={css.radioLabel}>Blood Type *</span>
          <div className={css.radioOptions}>
            {BLOOD_GROUPS.map(
              (
                type
              ) => (
                <label key={type.value} className={css.radioOption}>
                  <input
                    type="radio"
                    name="bloodType"
                    value={type.value}
                    checked={formData.bloodType === type.value}
                    onChange={handleChange}
                  />
                  <span className={css.customRadio}></span>
                  {type.label}
                </label>
              )
            )}
          </div>
          {errors.bloodType && (
            <span className={`${css.errorMessage} ${css.radioError}`}>
              {errors.bloodType}
            </span>
          )}
        </div>
        {/* 6. Activity Level */}
        <div
          className={`${css.radioGroup} ${css.activityGroup} ${
            errors.activityLevel ? css.groupError : ""
          }`}
        >
          <span className={css.radioLabel}>Activity Level *</span>
          <div className={css.radioOptions}>
            {ACTIVITY_LEVELS.map(
              (
                level
              ) => (
                <label key={level.value} className={css.radioOption}>
                  <input
                    type="radio"
                    name="activityLevel"
                    value={level.value}
                    checked={formData.activityLevel === level.value}
                    onChange={handleChange}
                  />
                  <span className={css.customRadio}></span>
                  {level.label}
                </label>
              )
            )}
          </div>
          {errors.activityLevel && (
            <span className={`${css.errorMessage} ${css.radioError}`}>
              {errors.activityLevel}
            </span>
          )}
        </div>
        <div className={css.buttonWrapper}>
          <button
            type="submit"
            className={`calculation-btn ${css.submitBtn}`}
            disabled={isLoading}
          >
            {isLoading ? "Calculating..." : "Start losing weight"}
          </button>
        </div>
      </form>
    </div>
  );
};

export default DailyCaloriesForm;

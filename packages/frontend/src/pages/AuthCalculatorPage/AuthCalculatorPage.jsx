import React, { useState } from "react";
import { Navigate } from "react-router-dom";
import CalculatorForm from "../../components/CalculatorForm/CalculatorForm";
import SummaryCard from "../../components/SummaryCards/SummaryCard"; // COMPONENT
import styles from "./AuthCalculatorPage.module.css";

const CalculatorPage = () => {

  // HOOKS en üstte
  const [dailyRate, setDailyRate] = useState(null);

  // LOGIN KONTROLÜ GERİ EKLENDİ 🔒
  const token = localStorage.getItem("token");
 // if (!token) {
  //  return <Navigate to="/login" replace />;
 // }

  const handleCalculate = async ({
    height,
    age,
    currentWeight,
    desiredWeight,
    bloodType,
  }) => {
    // Önce frontend hesaplama
    const calories =
      10 * currentWeight +
      6.25 * height -
      5 * age -
      161 -
      10 * (currentWeight - desiredWeight);

    const rounded = Math.round(calories);
    setDailyRate(rounded);

    console.log("Front-end calculated:", rounded, "Blood type:", bloodType);

    try {
      const response = await fetch(
        "http://localhost:4000/api/v1/calories/private-intake",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`, // TOKEN BURADA 🔒
          },
          body: JSON.stringify({
            weight: currentWeight,
            height,
            age,
            gender: "female",
            activityLevel: 1.5,
            targetWeight: desiredWeight,
            bloodGroup: bloodType,
          }),
        }
      );

      const data = await response.json();
      console.log("CALORIES RESPONSE:", data);

      if (response.ok && typeof data.dailyCalorieGoal === "number") {
        setDailyRate(data.dailyCalorieGoal); // backend sonucu göster
      }
    } catch (error) {
      console.error("CALORIES POST ERROR:", error);
    }
  };

  const today = new Date().toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        <div className={styles.left}>
          <h1 className={styles.title}>
            Calculate your daily calorie <br /> intake right now
          </h1>

          <CalculatorForm onSubmit={handleCalculate} />
        </div>

        <div className={styles.right}>
          {/* SUMMARY COMPONENT */}
          <SummaryCard date={today} dailyRate={dailyRate} consumed={0} />

        </div>
      </div>
    </section>
  );
};

export default CalculatorPage;

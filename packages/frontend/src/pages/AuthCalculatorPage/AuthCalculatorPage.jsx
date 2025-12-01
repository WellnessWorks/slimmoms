import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import CalculatorForm from "../../components/CalculatorForm/CalculatorForm";
import SummaryCard from "../../components/SummaryCards/SummaryCard";
import { userTransactionApi } from "../../api/userTransactionApi";
import styles from "./AuthCalculatorPage.module.css";

const AuthCalculatorPage = () => {
  const [dailyRate, setDailyRate] = useState(null);
  const [error, setError] = useState(null);
  const token = localStorage.getItem("token");

  // SAYFA AÇILINCA kullanıcı verisini çek
  useEffect(() => {
    if (!token) return; // sadece yönlendirme için

    const fetchCalorieProfile = async () => {
      try {
        const { data } = await userTransactionApi.get("/api/v1/calories/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        if (typeof data.dailyRate === "number") {
          setDailyRate(data.dailyRate);
        }
      } catch (err) {
        console.error("CALORIE PROFILE ERROR:", err);
      }
    };

    fetchCalorieProfile();
  }, [token]);

  const handleCalculate = async ({
    height,
    age,
    currentWeight,
    desiredWeight,
    bloodType,
    activityLevel,
  }) => {
    setError(null);
    setDailyRate(null);

    try {
      const payload = {
        weight: Number(currentWeight),
        height: Number(height),
        age: Number(age),
        gender: "female",
        activityLevel: Number(activityLevel),
        targetWeight: Number(desiredWeight),
        bloodGroup: Number(bloodType),
      };

      const { data } = await userTransactionApi.post(
        "/api/v1/calories/private-intake",
        payload,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      if (typeof data.dailyRate === "number") {
        setDailyRate(data.dailyRate);
      } else if (typeof data.dailyCalorieGoal === "number") {
        setDailyRate(data.dailyCalorieGoal);
      } else {
        setError("Server did not return a valid daily calorie value.");
      }
    } catch (err) {
      setError(
        err.response?.data?.message ||
          "Something went wrong while calculating calories."
      );
    }
  };

  // ❗ TOKEN YOKSA burada yönlendirme
  if (!token) return <Navigate to="/login" replace />;

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
          {error && <p className={styles.error}>{error}</p>}
        </div>

        <div className={styles.right}>
          <SummaryCard date={today} dailyRate={dailyRate} consumed={0} />
        </div>
      </div>
    </section>
  );
};

export default AuthCalculatorPage;

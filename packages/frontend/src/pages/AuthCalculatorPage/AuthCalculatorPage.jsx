// src/pages/AuthCalculatorPage/AuthCalculatorPage.jsx
import React, { useState, useEffect } from "react";
import { Navigate } from "react-router-dom";
import CalculatorForm from "../../components/CalculatorForm/CalculatorForm";
import SummaryCard from "../../components/SummaryCards/SummaryCard";
import Loader from "../../components/Loader/Loader"; // 🔥 Universal Loader
import { userTransactionApi } from "../../api/userTransactionApi";
import styles from "./AuthCalculatorPage.module.css";

const AuthCalculatorPage = () => {
  const [dailyRate, setDailyRate] = useState(null);
  const [forbiddenFoods, setForbiddenFoods] = useState([]);
  const [consumedKcal, setConsumedKcal] = useState(0);
  const [error, setError] = useState(null);

  const [isPageLoading, setIsPageLoading] = useState(true); // 🔥 FULL LOADER

  const token = localStorage.getItem("token");

  // ---------- SAYFA İÇİN GEREKLİ TÜM VERİLER ----------
  useEffect(() => {
    if (!token) return;

    const loadEverything = async () => {
      try {
        // 1) PROFIL
        const { data } = await userTransactionApi.get("/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = data.user || data;

        if (typeof user.dailyCalorieGoal === "number") {
          setDailyRate(user.dailyCalorieGoal);
        } else if (typeof user.dailyRate === "number") {
          setDailyRate(user.dailyRate);
        }

        // 2) FORBIDDEN FOODS
        if (user.bloodGroup) {
          const res = await userTransactionApi.get(
            `/api/v1/products/forbidden?bloodGroup=${user.bloodGroup}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (Array.isArray(res.data.forbiddenFoods)) {
            setForbiddenFoods(res.data.forbiddenFoods);
          }
        }

        // 3) BUGÜNÜN GÜN ÖZETİ (Diary ile aynı)
        const today = new Date();
        const Y = today.getFullYear();
        const M = String(today.getMonth() + 1).padStart(2, "0");
        const D = String(today.getDate()).padStart(2, "0");
        const ISO = `${Y}-${M}-${D}`;

        const dayInfo = await userTransactionApi.get(
          `/api/v1/day/info?date=${ISO}`,
          { headers: { Authorization: `Bearer ${token}` } }
        );

        if (typeof dayInfo.data.consumedCalories === "number") {
          setConsumedKcal(dayInfo.data.consumedCalories);
        }

        if (typeof dayInfo.data.dailyGoal === "number") {
          setDailyRate(dayInfo.data.dailyGoal);
        }
      } catch (err) {
        console.error("AUTH PAGE LOAD ERROR:", err);
      } finally {
        setIsPageLoading(false); // 🔥 SAYFA HAZIR → loader kapanır
      }
    };

    loadEverything();
  }, [token]);

  // login değilse
  if (!token) return <Navigate to="/login" replace />;

  // 🔥 TAM EKRAN LOADER
  if (isPageLoading) {
    return <Loader full size={60} />;
  }

  const todayLabel = new Date().toLocaleDateString("tr-TR", {
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });

  // ---------- FORM HESABI ----------
  const handleCalculate = async ({
    height,
    age,
    currentWeight,
    desiredWeight,
    bloodType,
    activityLevel,
  }) => {
    setError(null);

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
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (typeof data.dailyRate === "number") {
        setDailyRate(data.dailyRate);
      } else if (typeof data.dailyCalorieGoal === "number") {
        setDailyRate(data.dailyCalorieGoal);
      } else {
        setError("Server did not return a valid daily calorie value.");
      }

      if (Array.isArray(data.forbiddenFoods)) {
        setForbiddenFoods(data.forbiddenFoods);
      }
    } catch (err) {
      console.error("PRIVATE-INTAKE ERROR:", err);
      setError(
        err.response?.data?.message ||
          "Something went wrong while calculating calories."
      );
    }
  };

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
          <div className={styles.summaryBox}>
            <SummaryCard
              date={todayLabel}
              dailyRate={dailyRate}
              consumed={consumedKcal}
              forbiddenFoods={forbiddenFoods}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthCalculatorPage;

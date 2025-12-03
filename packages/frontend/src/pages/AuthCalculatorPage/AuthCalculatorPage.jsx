// src/pages/AuthCalculatorPage/AuthCalculatorPage.jsx
import React, { useState, useEffect, useMemo } from "react";
import { Navigate } from "react-router-dom";
import CalculatorForm from "../../components/CalculatorForm/CalculatorForm";
import SummaryCard from "../../components/SummaryCards/SummaryCard";
import { userTransactionApi } from "../../api/userTransactionApi";
import styles from "./AuthCalculatorPage.module.css";

const AuthCalculatorPage = () => {
  const [dailyRate, setDailyRate] = useState(null);
  const [forbiddenFoods, setForbiddenFoods] = useState([]);
  const [error, setError] = useState(null);

  const token = localStorage.getItem("token");

  // ---------- 1) PROFİL + FORBIDDEN (sayfaya girince) ----------
  useEffect(() => {
    if (!token) return;

    const fetchInitialData = async () => {
      try {
        const { data } = await userTransactionApi.get("/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = data.user || data;

        // dailyCalorieGoal / dailyRate
        if (typeof user.dailyCalorieGoal === "number") {
          setDailyRate(user.dailyCalorieGoal);
        } else if (typeof user.dailyRate === "number") {
          setDailyRate(user.dailyRate);
        }

        // kan grubu → yasak yiyecekler
        if (user.bloodGroup) {
          const res = await userTransactionApi.get(
            `/api/v1/products/forbidden?bloodGroup=${user.bloodGroup}`,
            {
              headers: { Authorization: `Bearer ${token}` },
            }
          );

          if (Array.isArray(res.data.forbiddenFoods)) {
            setForbiddenFoods(res.data.forbiddenFoods);
          }
        }
      } catch (err) {
        console.error("INIT LOAD ERROR (/users/me or /products/forbidden):", err);
      }
    };

    fetchInitialData();
  }, [token]);

  // ---------- 2) FORM SUBMIT → private-intake ----------
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
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      // daily rate
      if (typeof data.dailyRate === "number") {
        setDailyRate(data.dailyRate);
      } else if (typeof data.dailyCalorieGoal === "number") {
        setDailyRate(data.dailyCalorieGoal);
      } else {
        setError("Server did not return a valid daily calorie value.");
      }

      // yasak yiyecekler
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

  // ---------- 3) SUMMARYCARD İÇİN GÖRSEL DEĞERLER ----------
  // Bu sayfada henüz hiçbir şey yenmediği için:
  const consumed = 0;

  const percentOfNormal = useMemo(() => {
    if (!dailyRate || dailyRate <= 0) return 0;
    return Math.round((consumed / dailyRate) * 100);
  }, [dailyRate, consumed]);

  // login değilse
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
          <div className={styles.summaryBox}>
            <SummaryCard
              date={today}
              dailyRate={dailyRate}
              consumed={consumed}
              forbiddenFoods={forbiddenFoods}
              percentOfNormal={percentOfNormal}
            />
          </div>
        </div>
      </div>
    </section>
  );
};

export default AuthCalculatorPage;

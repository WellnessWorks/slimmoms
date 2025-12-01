import React from "react";
import styles from "./SummaryCard.module.css";

const SummaryCard = ({ date, dailyRate, consumed = 0 }) => {
  const formatKcal = (value) =>
    value != null && !Number.isNaN(value) ? `${value} kcal` : "000 kcal";

  return (
    <div className={styles.card}>
      {/* SOL KOLON – Summary */}
      <div className={styles.summaryCol}>
        <h2 className={styles.title}>Summary for {date}</h2>

        <ul className={styles.list}>
          <li className={styles.item}>
            <span>Left</span>
            <span>{formatKcal(dailyRate - consumed)}</span>
          </li>
          <li className={styles.item}>
            <span>Consumed</span>
            <span>{formatKcal(consumed)}</span>
          </li>
          <li className={styles.item}>
            <span>Daily rate</span>
            <span>{formatKcal(dailyRate)}</span>
          </li>
          <li className={styles.item}>
            <span>% of normal</span>
            <span>0%</span>
          </li>
        </ul>
      </div>

      {/* SAĞ KOLON – Food */}
      <div className={styles.foodCol}>
        <h3 className={styles.foodTitle}>Food not recommended</h3>
        <p className={styles.foodText}>Your diet will be displayed here</p>
      </div>
    </div>
  );
};

export default SummaryCard;

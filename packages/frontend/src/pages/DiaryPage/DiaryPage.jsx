// src/pages/DiaryPage/DiaryPage.jsx
import React, { useEffect, useState, useMemo } from "react";
import { Navigate } from "react-router-dom";
import { userTransactionApi } from "../../api/userTransactionApi";
import SummaryCard from "../../components/SummaryCards/SummaryCard";
import styles from "./DiaryPage.module.css";

const DiaryPage = () => {
  const token = localStorage.getItem("token");

  // ---------- STATE ----------
  const [date, setDate] = useState(() => {
    const d = new Date();
    const year = d.getFullYear();
    const month = String(d.getMonth() + 1).padStart(2, "0");
    const day = String(d.getDate()).padStart(2, "0");
    return `${year}-${month}-${day}`; // YYYY-MM-DD
  });

  const [dailyRate, setDailyRate] = useState(null);
  const [forbiddenFoods, setForbiddenFoods] = useState([]);
  const [userBloodGroup, setUserBloodGroup] = useState(null);

  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [grams, setGrams] = useState("");

  const [eatenProducts, setEatenProducts] = useState([]);
  const [consumedKcal, setConsumedKcal] = useState(0);

  const [error, setError] = useState(null);
  const [isLoadingDay, setIsLoadingDay] = useState(false);
  const [isAdding, setIsAdding] = useState(false);

  // mobil mi?
  const [isMobile, setIsMobile] = useState(
    typeof window !== "undefined" ? window.innerWidth <= 704 : false
  );
  // mobilde “Add ekranı” açık mı?
  const [isMobileAddMode, setIsMobileAddMode] = useState(false);

  // ---------- WINDOW RESIZE ----------
  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 769

      );
    };
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  // ---------- PROFİL + FORBIDDEN (sayfaya girince) ----------
  useEffect(() => {
    if (!token) return; // token yoksa istek atma

    const loadProfile = async () => {
      try {
        const { data } = await userTransactionApi.get("/api/v1/users/me", {
          headers: { Authorization: `Bearer ${token}` },
        });

        const user = data.user || data;

        if (typeof user.dailyCalorieGoal === "number") {
          setDailyRate(user.dailyCalorieGoal);
        } else if (typeof user.dailyRate === "number") {
          setDailyRate(user.dailyRate);
        }

        if (user.bloodGroup) {
          setUserBloodGroup(user.bloodGroup);

          const res = await userTransactionApi.get(
            `/api/v1/products/forbidden?bloodGroup=${user.bloodGroup}`,
            { headers: { Authorization: `Bearer ${token}` } }
          );

          if (Array.isArray(res.data.forbiddenFoods)) {
            setForbiddenFoods(res.data.forbiddenFoods);
          }
        }
      } catch (err) {
        console.error("PROFILE INIT ERROR:", err);
      }
    };

    loadProfile();
  }, [token]);

  // ---------- BELİRLİ TARİHİN GÜN ÖZETİ ----------
  useEffect(() => {
    if (!token) return;

    const fetchDayInfo = async () => {
      setIsLoadingDay(true);
      setError(null);

      try {
        const { data } = await userTransactionApi.get(
          `/api/v1/day/info?date=${date}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );

        const eaten = data.products || [];
        setEatenProducts(
          eaten.map((p) => ({
            id: p.id || p._id,
            title: p.title,
            weight: p.weight,
            calories: p.calories,
          }))
        );

        if (typeof data.consumedCalories === "number") {
          setConsumedKcal(data.consumedCalories);
        } else {
          setConsumedKcal(0);
        }

        if (typeof data.dailyGoal === "number") {
          setDailyRate(data.dailyGoal);
        }
      } catch (err) {
        console.error("DAY INFO ERROR:", err);
        setError(
          err.response?.data?.message ||
            "Could not load daily information for this date."
        );
        setEatenProducts([]);
        setConsumedKcal(0);
      } finally {
        setIsLoadingDay(false);
      }
    };

    fetchDayInfo();
  }, [date, token]);

  // ---------- ÜRÜN ARAMA (products/search) ----------
  useEffect(() => {
    if (!token) return;

    // Input boşsa listeyi temizle
    if (!searchQuery.trim()) {
      setSearchResults([]);
      return;
    }

    // Kullanıcı listeden ürün seçtiyse ve input seçilen ürünün
    // başlığını gösteriyorsa yeniden arama yapma → dropdown kapalı kalsın
    if (selectedProduct && searchQuery === selectedProduct.title) {
      return;
    }

    const fetchSearch = async () => {
      try {
        const { data } = await userTransactionApi.get(
          `/api/v1/products/search?query=${encodeURIComponent(searchQuery)}`,
          {
            headers: { Authorization: `Bearer ${token}` },
          }
        );
        setSearchResults(data.products || []);
      } catch (err) {
        console.error("PRODUCT SEARCH ERROR:", err);
      }
    };

    const timeoutId = setTimeout(fetchSearch, 300);
    return () => clearTimeout(timeoutId);
  }, [searchQuery, token, selectedProduct]);

  const handleSelectProduct = (product) => {
    setSelectedProduct(product);
    setSearchQuery(product.title);
    setSearchResults([]);
  };

  // ---------- ÜRÜN EKLEME ----------
  const handleAddProduct = async (e) => {
    e.preventDefault();
    if (!selectedProduct || !grams) return;

    // ❌ Yasak ürün kontrolü
    if (
      userBloodGroup &&
      selectedProduct.groupBloodNotAllowed &&
      Array.isArray(selectedProduct.groupBloodNotAllowed)
    ) {
      const index = Number(userBloodGroup) - 1;
      if (selectedProduct.groupBloodNotAllowed[index]) {
        setError("This product is not recommended for your blood group.");
        return;
      }
    }

    setIsAdding(true);
    setError(null);

    try {
      const body = {
        date,
        productId: selectedProduct._id,
        weight: Number(grams),
      };

      const { data } = await userTransactionApi.post(
        "/api/v1/day/add-product",
        body,
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      const day = data.day;
      if (day) {
        setEatenProducts(
          day.consumedProducts.map((p) => ({
            id: p._id,
            title: p.title,
            weight: p.weight,
            calories: p.calories,
          }))
        );
        setConsumedKcal(day.totalCalories);
      }

      // inputları temizle
      setGrams("");
      setSearchQuery("");
      setSelectedProduct(null);

      // mobil “Add ekranı” ise geri dön
      if (isMobile) {
        setIsMobileAddMode(false);
      }
    } catch (err) {
      console.error("ADD PRODUCT ERROR:", err);
      setError(
        err.response?.data?.message || "Could not add this product to your day."
      );
    } finally {
      setIsAdding(false);
    }
  };

  // ---------- ÜRÜN SİLME ----------
  const handleDeleteProduct = async (consumedId) => {
    try {
      const { data } = await userTransactionApi.delete(
        "/api/v1/day/delete-product",
        {
          headers: { Authorization: `Bearer ${token}` },
          data: { consumedProductId: consumedId },
        }
      );

      const day = data.day;
      if (day) {
        setEatenProducts(
          day.consumedProducts.map((p) => ({
            id: p._id,
            title: p.title,
            weight: p.weight,
            calories: p.calories,
          }))
        );
        setConsumedKcal(day.totalCalories);
      }
    } catch (err) {
      console.error("DELETE PRODUCT ERROR:", err);
    }
  };

  // ---------- GÖRSEL LABEL / HESAPLAMALAR ----------
  const dateLabel = useMemo(() => {
    const d = new Date(date);
    return d.toLocaleDateString("tr-TR", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    });
  }, [date]);

  const percentOfNormal = useMemo(() => {
    if (!dailyRate || dailyRate <= 0) return 0;
    return Math.round((consumedKcal / dailyRate) * 100);
  }, [dailyRate, consumedKcal]);

  // 🔒 BÜTÜN HOOK’LARDAN SONRA token kontrolü
  if (!token) return <Navigate to="/login" replace />;

  // ------------------------------------------------------------------
  // MOBİL ADD SCREEN
  // ------------------------------------------------------------------
  if (isMobile && isMobileAddMode) {
    return (
      <section className={styles.page}>
        <div className={styles.inner}>
          <div className={styles.left}>
            <div className={styles.mobileAddHeader}>
              <button
                type="button"
                className={styles.backBtn}
                onClick={() => setIsMobileAddMode(false)}
              >
                ←
              </button>
              <span className={styles.mobileAddTitle}>Add product</span>
            </div>

            <form className={styles.form} onSubmit={handleAddProduct}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Enter product name</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedProduct(null);
                    }}
                    placeholder="Eggplant"
                  />
                  {searchResults.length > 0 && (
                    <ul className={styles.suggestions}>
                      {searchResults.map((p) => (
                        <li
                          key={p._id}
                          onClick={() => handleSelectProduct(p)}
                          className={styles.suggestionItem}
                        >
                          {p.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.fieldSmall}>
                  <label className={styles.label}>Grams</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    value={grams}
                    onChange={(e) => setGrams(e.target.value)}
                    placeholder="100"
                  />
                </div>
              </div>

              {error && <p className={styles.error}>{error}</p>}

              <button
                type="submit"
                className={styles.addBtnMobile}
                disabled={!selectedProduct || !grams || isAdding}
              >
                Add
              </button>
            </form>
          </div>
        </div>
      </section>
    );
  }

  // ------------------------------------------------------------------
  // NORMAL EKRAN (desktop / tablet + mobil liste görünümü)
  // ------------------------------------------------------------------
  return (
    <section className={styles.page}>
      <div className={styles.inner}>
        {/* SOL KOLON: tarih + liste + (desktop form) */}
        <div className={styles.left}>
          <div className={styles.dateRow}>
            <span className={styles.dateText}>{dateLabel}</span>

            {/* Takvim butonu */}
            <button
  type="button"
  className={styles.calendarBtn}
  onClick={() => document.getElementById("hiddenDatePicker").showPicker()}
  aria-label="Select date"
>
  <span className={styles.calendarIcon} />
</button>


            {/* GİZLİ INPUT */}
            <input
              id="hiddenDatePicker"
              type="date"
              className={styles.hiddenDateInput}
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          {/* Desktop & tablet: form yukarıda, mobilde form yok (sadece liste + +) */}
          {!isMobile && (
            <form className={styles.form} onSubmit={handleAddProduct}>
              <div className={styles.formRow}>
                <div className={styles.field}>
                  <label className={styles.label}>Enter product name</label>
                  <input
                    className={styles.input}
                    type="text"
                    value={searchQuery}
                    onChange={(e) => {
                      setSearchQuery(e.target.value);
                      setSelectedProduct(null);
                    }}
                    placeholder="Eggplant"
                  />
                  {searchResults.length > 0 && (
                    <ul className={styles.suggestions}>
                      {searchResults.map((p) => (
                        <li
                          key={p._id}
                          onClick={() => handleSelectProduct(p)}
                          className={styles.suggestionItem}
                        >
                          {p.title}
                        </li>
                      ))}
                    </ul>
                  )}
                </div>

                <div className={styles.fieldSmall}>
                  <label className={styles.label}>Grams</label>
                  <input
                    className={styles.input}
                    type="number"
                    min="1"
                    value={grams}
                    onChange={(e) => setGrams(e.target.value)}
                    placeholder="100"
                  />
                </div>

                <button
                  type="submit"
                  className={styles.addBtnCircle}
                  disabled={!selectedProduct || !grams || isAdding}
                >
                  +
                </button>
              </div>

              {error && <p className={styles.error}>{error}</p>}
            </form>
          )}

          {/* TABLO */}
          <div className={styles.tableWrapper}>
            {isLoadingDay ? (
              <p>Loading day...</p>
            ) : eatenProducts.length === 0 ? (
              <p className={styles.emptyText}>
                You have not added any products yet.
              </p>
            ) : (
              <table className={styles.table}>
                <thead>
                  <tr>
                    <th>Product</th>
                    <th>Grams</th>
                    <th>kcal</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {eatenProducts.map((item) => (
                    <tr key={item.id || item._id}>
                      <td>{item.title}</td>
                      <td>{item.weight}</td>
                      <td>{Math.round(item.calories || 0)}</td>
                      <td>
                        <button
                          type="button"
                          className={styles.deleteBtn}
                          onClick={() =>
                            handleDeleteProduct(item.id || item._id)
                          }
                        >
                          ✕
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* Mobilde, alt ortada turuncu + → Add ekranı */}
          {isMobile && (
            <>
              <button
                type="button"
                className={styles.addBtnCircle}
                onClick={() => setIsMobileAddMode(true)}
              >
                +
              </button>

              {/* Mobilde summary solda listenin altında */}
              <div className={styles.summaryBox}>
                <SummaryCard
                  date={dateLabel}
                  dailyRate={dailyRate}
                  consumed={consumedKcal}
                  forbiddenFoods={forbiddenFoods}
                  percentOfNormal={percentOfNormal}
                />
              </div>
            </>
          )}
        </div>

        {/* SAĞ KOLON: desktop/tablet için Summary */}
        {!isMobile && (
          <div className={styles.right}>
            <div className={styles.summaryBox}>
              <SummaryCard
                date={dateLabel}
                dailyRate={dailyRate}
                consumed={consumedKcal}
                forbiddenFoods={forbiddenFoods}
                percentOfNormal={percentOfNormal}
              />
            </div>
          </div>
        )}
      </div>
    </section>
  );
};

export default DiaryPage;

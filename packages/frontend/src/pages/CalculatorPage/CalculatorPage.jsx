import React, { useState } from "react";
import axios from "axios";
import DailyCaloriesForm from "../../components/DailyCaloriesForm/DailyCaloriesForm";
import Modal from "../../components/Modal/Modal";
import DailyCalorieIntake from "../../components/DailyCalorieIntake/DailyCalorieIntake";

const CalculatorPage = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [calculatedData, setCalculatedData] = useState(null);

  const handleFormSubmit = async (formData) => {
    console.log("Form gönderildi:", formData);
    try {
      const response = await axios.post("/api/v1/calories/public", formData);

      const { dailyRate, forbiddenFoods } = response.data;

      const data = {
        calories: dailyRate,
        foods: forbiddenFoods,
      };

      setCalculatedData(data);
      setIsModalOpen(true);
      console.log("Modal açılış state'i set edildi");
      console.log("Hesaplanan Kaloriler:", dailyRate);
      console.log("Yasaklı Yiyecekler:", forbiddenFoods);
    } catch (error) {
      console.error(
        "Kalori hesaplama başarısız oldu:",
        error.response?.data || error.message
      );
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setCalculatedData(null);
  };

  return (
    <div className="calculator-wrapper">
     <DailyCaloriesForm onFormSubmit={handleFormSubmit} />
      {isModalOpen && calculatedData && (
        <Modal isOpen={isModalOpen} onClose={closeModal}>
          <DailyCalorieIntake
            dailyRate={calculatedData.calories}
            forbiddenFoods={calculatedData.foods}
            onClose={closeModal}
          />
        </Modal>
      )}
    </div>
  );
};

export default CalculatorPage;

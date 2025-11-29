// src/pages/CalculatorPage/CalculatorPage.jsx

import React, { useState } from 'react';
// Yolları projenize göre düzeltin:
import DailyCaloriesForm from '../../components/DailyCaloriesForm/DailyCaloriesForm'; 
import Modal from '../../components/Modal/Modal'; 
import DailyCalorieIntake from '../../components/DailyCalorieIntake/DailyCalorieIntake'; 
import { calculateDailyCalories, getForbiddenFoods } from '../../utils/CalculatorUtils'; 


const CalculatorPage = () => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [calculatedData, setCalculatedData] = useState(null); 

    const handleFormSubmit = (formData) => {
        console.log("Form gönderildi:", formData);
        
        // Fonksiyonları çağırma
        const dailyCalories = calculateDailyCalories(formData);
        const forbiddenFoods = getForbiddenFoods(formData.bloodType);

        console.log("Hesaplanan kaloriler:", dailyCalories);
        console.log("Yasaklı yiyecekler:", forbiddenFoods);

        const data = {
            calories: dailyCalories,
            foods: forbiddenFoods
        };

        setCalculatedData(data);
        setIsModalOpen(true);
        
        console.log("Modal açılış state'i set edildi");
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
                        calories={calculatedData.calories} 
                        foods={calculatedData.foods}
                        onClose={closeModal}
                    />
                </Modal>
            )}
        </div>
    );
};

// 🛑 React Router'ın beklediği DEFAULT EXPORT budur.
export default CalculatorPage;
import React from 'react';
import css from './DailyCalorieIntake.module.css';

const DailyCalorieIntake = ({ dailyRate, forbiddenFoods, onClose }) => {
    
    const handleStartLosingWeight = () => {
        console.log("Kullanıcı kayıtlı hedefler sayfasına yönlendiriliyor...");
        if (onClose) {
            onClose();
        }
    };

    const hasForbiddenFoods = forbiddenFoods && forbiddenFoods.length > 0;

    return (
        <div className={css.modalContent}> 
            {/*GERİ OK BUTONU */}
            {onClose && (
                <button className={css.closeButton} onClick={onClose}>
                    &#x2190;
                </button>
            )}

            <div className={css.contentBox}>
                <h2 className={`page-title ${css.intakeTitle}`}>Your recommended daily calorie intake is</h2> 
                
                {/* Kalori Değeri Bölümü */}
                <div className={css.rateBox}>
                    <span className={`modal-calorie-text ${css.dailyRate}`}>{dailyRate || 2800}</span>
                    <span className={css.unit}> kkal</span>
                </div>
                <hr className={css.divider} />
                <h3 className={css.subtitle}>Foods you should not eat</h3>
                
                {/* Yiyecek Listesi */}
                <ol className={css.foodList}>
                    {hasForbiddenFoods ? (
                        forbiddenFoods.map((food, index) => (
                            <li key={index} className={css.foodItem}>{food}</li>
                        ))
                    ) : (
                        <li className={css.noFoodItem}>No forbidden foods for your blood type</li>
                    )}
                </ol>
            </div>
            <button 
                onClick={handleStartLosingWeight}
                type="submit" className={`calculation-btn ${css.submitBtn}`}
            >
                Start losing weight
            </button>
        </div>
    );
};

export default DailyCalorieIntake;
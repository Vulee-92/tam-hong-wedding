import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

i18n
  .use(initReactI18next)
  .init({
    resources: {
      en: {
        translation: {
          "welcome": "Welcome to my portfolio",
          "experience": "Experience",
          "projects": "Projects",
          "skills": "Skills",
          "contact": "Contact",
          // Thêm các chuỗi khác
        }
      },
      vi: {
        translation: {
          "welcome": "Chào mừng bạn đến với portfolio của tôi",
          "experience": "Kinh Nghiệm",
          "projects": "Dự Án",
          "skills": "Kỹ Năng",
          "contact": "Liên Hệ",
          // Thêm các chuỗi khác
        }
      }
    },
    lng: "vi", // Ngôn ngữ mặc định
    fallbackLng: "en",
    interpolation: {
      escapeValue: false // không cần thiết cho React
    }
  });

export default i18n; 
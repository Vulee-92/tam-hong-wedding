import { useState, useEffect } from 'react';

const RECRUITER_KEY = 'vulee_recruiter_access';
const SECRET_CODE = 'VULEE2024'; // Bạn có thể thay đổi mã này

export const useRecruiterAuth = () => {
  const [isRecruiter, setIsRecruiter] = useState(false);

  useEffect(() => {
    const savedAccess = localStorage.getItem(RECRUITER_KEY);
    if (savedAccess === SECRET_CODE) {
      setIsRecruiter(true);
    }
  }, []);

  const verifyRecruiter = (code: string) => {
    if (code === SECRET_CODE) {
      localStorage.setItem(RECRUITER_KEY, code);
      setIsRecruiter(true);
      return true;
    }
    return false;
  };

  const clearRecruiterAccess = () => {
    localStorage.removeItem(RECRUITER_KEY);
    setIsRecruiter(false);
  };

  return { isRecruiter, verifyRecruiter, clearRecruiterAccess };
}; 
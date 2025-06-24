"use client";
import { createContext, useContext, useState } from "react";

const SellerFormContext = createContext();

export const SellerFormProvider = ({ children }) => {
  const [formData, setFormData] = useState({
    // Personal Info
    firstName: "",
    lastName: "",
    displayName: "",
    profileImage: null,
    description: "",
    languages: [],

    // Professional Details
    occupation: "",
    skills: [],
    education: "",
    certifications: [],
    website: "",

    // Account Details
    phoneNumber: "",
    phoneVerified: false,
    email: "",
    emailVerified: false,
  });

  const updateFormData = (stepData) => {
    setFormData((prev) => ({ ...prev, ...stepData }));
  };

  const calculateCompletion = () => {
    const totalFields = 13; // total form fields
    let filled = 0;

    Object.values(formData).forEach((val) => {
      if (Array.isArray(val)) {
        if (val.length) filled++;
      } else if (val || val === true) {
        filled++;
      }
    });

    return Math.round((filled / totalFields) * 100);
  };

  return (
    <SellerFormContext.Provider value={{ formData, updateFormData, calculateCompletion }}>
      {children}
    </SellerFormContext.Provider>
  );
};

export const useSellerForm = () => useContext(SellerFormContext);

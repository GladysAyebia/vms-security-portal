// src/features/validation/hooks/useValidation.ts

import { useState, useEffect } from "react";
import {
  validateAccessCode,
  validateQRAccessCode,
  getRecentValidations,
} from "@/features/validation/validationService";
import type { ValidationResult, RecentValidation } from "@/features/validation/validationTypes";

type ValidationState = "idle" | "loading" | "success" | "denied" | "error";

interface ValidationHook {
  state: ValidationState;
  result: ValidationResult | null;
  history: RecentValidation[];
  errorMessage: string | null;
  validate: (code: string) => Promise<void>;
  validateQR: (qrData: string) => Promise<void>;
  fetchHistory: () => Promise<void>;
  reset: () => void;
}

export const useValidation = (): ValidationHook => {
  const [state, setState] = useState<ValidationState>("idle");
  const [result, setResult] = useState<ValidationResult | null>(null);
  const [history, setHistory] = useState<RecentValidation[]>([]);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const reset = () => {
    setState("idle");
    setResult(null);
    setErrorMessage(null);
  };

  // ✅ Fix 1: Define fetchHistory *before* using it in finally blocks
  const fetchHistory = async () => {
    try {
      const response = await getRecentValidations(20);
      
      if (response.success && response.data?.validations) {
 const formatted: RecentValidation[] = response.data.validations.map((item: any) => ({
 id: item.id,
  code: item.code,
  result: item.result as "granted" | "denied",
  validated_at: item.validated_at,
  // IMPROVED FALLBACK: 
  visitor_name: item.visitor_name 
                 ? item.visitor_name 
                 : item.result === "granted" 
                    ? "Name Missing (Granted)" 
                    : "N/A", // Default for denied or unknown
  resident_name: item.resident_name,
  home: item.home,
  }));
           console.log("Raw recent validation data:", response.data.validations);

        setHistory(formatted);
      } else {
        const errorMsg = "error" in response ? response.error?.message : "Unknown error";
        console.error("Failed to fetch recent validations:", errorMsg);
      }
    } catch (error) {
      console.error("Error fetching validation history:", error);
    }
  };

  // --- Manual validation ---
  const validate = async (code: string) => {
    reset();
    setState("loading");

    try {
      const response = await validateAccessCode(code);

      if (response.success) {
        const data = response.data;
        setResult(data);

        if (data.result === "granted") {
          setState("success");
        } else {
          setState("denied");
          setErrorMessage(data.reason || "Access denied");
        }
      } else {
        setState("error");
        setErrorMessage(response.error?.message || "Validation failed");
      }
    } catch (err) {
      setState("error");
      setErrorMessage("A network error occurred.");
    } finally {
      // ✅ Fix 2: Automatically refresh the history
      fetchHistory();
    }
  };

  // --- QR validation ---
  const validateQR = async (qrData: string) => {
    reset();
    setState("loading");

    try {
      const response = await validateQRAccessCode(qrData);

      if (response.success) {
        const data = response.data;
        setResult(data);

        if (data.result === "granted") {
          setState("success");
        } else {
          setState("denied");
          setErrorMessage(data.reason || "Access denied");
        }
      } else {
        setState("error");
        setErrorMessage(response.error?.message || "Validation failed");
      }
    } catch (err) {
      setState("error");
      setErrorMessage("A network error occurred.");
    } finally {
      fetchHistory();
    }
  };

  useEffect(() => {
    fetchHistory();
  }, []);

  return {
    state,
    result,
    history,
    errorMessage,
    validate,
    validateQR,
    fetchHistory,
    reset,
  };
};

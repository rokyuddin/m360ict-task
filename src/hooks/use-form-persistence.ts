// "use client";

// import { useEffect, useState } from "react";
// import type { CompleteFormData } from "@/lib/form-schema";

// export function useFormPersistence() {
//   const [formData, setFormData] = useState<Partial<CompleteFormData>>({});
//   const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);

//   const updateFormData = (step: keyof CompleteFormData, data: any) => {
//     setFormData((prev) => ({ ...prev, [step]: data }));
//     setHasUnsavedChanges(true);
//   };

//   const markAsSaved = () => {
//     setHasUnsavedChanges(false);
//   };

//   // Warn before leaving with unsaved changes
//   useEffect(() => {
//     const handleBeforeUnload = (e: BeforeUnloadEvent) => {
//       if (hasUnsavedChanges) {
//         e.preventDefault();
//         e.returnValue = "";
//       }
//     };

//     window.addEventListener("beforeunload", handleBeforeUnload);
//     return () => window.removeEventListener("beforeunload", handleBeforeUnload);
//   }, [hasUnsavedChanges]);

//   return {
//     formData,
//     updateFormData,
//     markAsSaved,
//     hasUnsavedChanges,
//   };
// }

"use client";

import { useEffect, useState, useCallback } from "react";
import type { CompleteFormData } from "@/lib/form-schema";

// Storage utility functions with error handling and fallbacks
class FormStorage {
  private static readonly STORAGE_KEY_PREFIX = "form_data_";
  private static readonly STORAGE_VERSION = "1.0";

  /**
   * Check if localStorage is available and functional
   */
  private static isStorageAvailable(): boolean {
    try {
      const test = "__storage_test__";
      localStorage.setItem(test, test);
      localStorage.removeItem(test);
      return true;
    } catch {
      return false;
    }
  }

  /**
   * Safely save data to localStorage with error handling
   */
  static saveData(formId: string, data: any): boolean {
    if (!this.isStorageAvailable()) {
      console.warn("localStorage not available, form data will not persist");
      return false;
    }

    try {
      const storageData = {
        version: this.STORAGE_VERSION,
        timestamp: Date.now(),
        data: data,
      };

      const serializedData = JSON.stringify(storageData);
      localStorage.setItem(
        `${this.STORAGE_KEY_PREFIX}${formId}`,
        serializedData
      );
      return true;
    } catch (error) {
      // Handle quota exceeded or other storage errors
      console.warn("Failed to save form data:", error);

      // Try to clear old data and retry once
      try {
        this.clearOldData();
        const storageData = {
          version: this.STORAGE_VERSION,
          timestamp: Date.now(),
          data: data,
        };
        localStorage.setItem(
          `${this.STORAGE_KEY_PREFIX}${formId}`,
          JSON.stringify(storageData)
        );
        return true;
      } catch {
        return false;
      }
    }
  }

  /**
   * Safely load data from localStorage with validation
   */
  static loadData(formId: string): any | null {
    if (!this.isStorageAvailable()) {
      return null;
    }

    try {
      const stored = localStorage.getItem(
        `${this.STORAGE_KEY_PREFIX}${formId}`
      );
      if (!stored) return null;

      const parsedData = JSON.parse(stored);

      // Validate data structure and version
      if (!parsedData.version || !parsedData.data || !parsedData.timestamp) {
        this.removeData(formId);
        return null;
      }

      // Check if data is too old (older than 7 days)
      const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days in milliseconds
      if (Date.now() - parsedData.timestamp > maxAge) {
        this.removeData(formId);
        return null;
      }

      return parsedData.data;
    } catch (error) {
      console.warn("Failed to load form data:", error);
      this.removeData(formId);
      return null;
    }
  }

  /**
   * Remove specific form data
   */
  static removeData(formId: string): void {
    if (!this.isStorageAvailable()) return;

    try {
      localStorage.removeItem(`${this.STORAGE_KEY_PREFIX}${formId}`);
    } catch (error) {
      console.warn("Failed to remove form data:", error);
    }
  }

  /**
   * Clear old form data to free up storage space
   */
  private static clearOldData(): void {
    if (!this.isStorageAvailable()) return;

    const maxAge = 7 * 24 * 60 * 60 * 1000; // 7 days
    const keysToRemove: string[] = [];

    for (let i = 0; i < localStorage.length; i++) {
      const key = localStorage.key(i);
      if (key?.startsWith(this.STORAGE_KEY_PREFIX)) {
        try {
          const data = JSON.parse(localStorage.getItem(key) || "{}");
          if (data.timestamp && Date.now() - data.timestamp > maxAge) {
            keysToRemove.push(key);
          }
        } catch {
          keysToRemove.push(key);
        }
      }
    }

    keysToRemove.forEach((key) => {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.warn("Failed to remove old form data:", error);
      }
    });
  }

  /**
   * Get storage usage information
   */
  static getStorageInfo(): { used: number; available: boolean } {
    if (!this.isStorageAvailable()) {
      return { used: 0, available: false };
    }

    try {
      let used = 0;
      for (let i = 0; i < localStorage.length; i++) {
        const key = localStorage.key(i);
        if (key?.startsWith(this.STORAGE_KEY_PREFIX)) {
          used += (localStorage.getItem(key) || "").length;
        }
      }
      return { used, available: true };
    } catch {
      return { used: 0, available: false };
    }
  }
}

interface UseFormPersistenceOptions {
  formId?: string;
  autoSave?: boolean;
  debounceMs?: number;
  maxAge?: number;
}

export function useFormPersistence() {
  const [formData, setFormData] = useState<Partial<CompleteFormData>>(() => {
    // Initialize with persisted data if available
    const persistedData = FormStorage.loadData("employee-onboarding");
    return persistedData || {};
  });
  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  // Debounced save function to avoid excessive storage writes
  const debouncedSave = useCallback(
    (data: Partial<CompleteFormData>) =>
      debounce((data: Partial<CompleteFormData>) => {
        const success = FormStorage.saveData("employee-onboarding", data);
        if (success) {
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        } else {
          setIsStorageAvailable(false);
        }
      }, 500),
    []
  );

  const updateFormData = (step: keyof CompleteFormData, data: any) => {
    setFormData((prev) => {
      const newData = { ...prev, [step]: data };

      // Auto-save the updated data
      debouncedSave(newData);

      return newData;
    });
    setHasUnsavedChanges(true);
  };

  const markAsSaved = () => {
    // Final save when form is submitted
    FormStorage.saveData("employee-onboarding", formData);
    setHasUnsavedChanges(false);
    setLastSaved(new Date());
  };

  const clearPersistedData = () => {
    FormStorage.removeData("employee-onboarding");
    setFormData({});
    setHasUnsavedChanges(false);
    setLastSaved(null);
  };

  const resetFormData = () => {
    setFormData({});
    setHasUnsavedChanges(false);
  };

  // Check storage availability on mount
  useEffect(() => {
    const storageInfo = FormStorage.getStorageInfo();
    setIsStorageAvailable(storageInfo.available);
  }, []);

  // Load persisted data on mount
  useEffect(() => {
    const persistedData = FormStorage.loadData("employee-onboarding");
    if (persistedData) {
      setFormData(persistedData);
      setLastSaved(new Date());
    }
  }, []);

  // Auto-save current form data periodically
  useEffect(() => {
    if (Object.keys(formData).length > 0) {
      const interval = setInterval(() => {
        FormStorage.saveData("employee-onboarding", formData);
        setLastSaved(new Date());
      }, 30000); // Auto-save every 30 seconds

      return () => clearInterval(interval);
    }
  }, [formData]);

  // Enhanced beforeunload handler with better UX
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && Object.keys(formData).length > 0) {
        // Save data before leaving
        FormStorage.saveData("employee-onboarding", formData);

        // Show warning for unsaved changes
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        e.preventDefault();
        e.returnValue = message;
        return message;
      }
    };

    // Also handle visibility change (tab switching, minimizing)
    const handleVisibilityChange = () => {
      if (document.hidden && Object.keys(formData).length > 0) {
        FormStorage.saveData("employee-onboarding", formData);
        setLastSaved(new Date());
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    document.addEventListener("visibilitychange", handleVisibilityChange);

    return () => {
      window.removeEventListener("beforeunload", handleBeforeUnload);
      document.removeEventListener("visibilitychange", handleVisibilityChange);
    };
  }, [hasUnsavedChanges, formData]);

  return {
    formData,
    updateFormData,
    markAsSaved,
    clearPersistedData,
    resetFormData,
    hasUnsavedChanges,
    isStorageAvailable,
    lastSaved,
    storageInfo: FormStorage.getStorageInfo(),
  };
}

/**
 * Generic form persistence hook for any form
 */
export function useGenericFormPersistence<T = any>(
  formId: string,
  options: UseFormPersistenceOptions = {}
) {
  const {
    autoSave = true,
    debounceMs = 500,
    maxAge = 7 * 24 * 60 * 60 * 1000, // 7 days
  } = options;

  const [formData, setFormData] = useState<Partial<T>>(() => {
    const persistedData = FormStorage.loadData(formId);
    return persistedData || {};
  });

  const [hasUnsavedChanges, setHasUnsavedChanges] = useState(false);
  const [isStorageAvailable, setIsStorageAvailable] = useState(true);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);

  const debouncedSave = useCallback(
    (data: Partial<T>) =>
      debounce((data: Partial<T>) => {
        const success = FormStorage.saveData(formId, data);
        if (success) {
          setLastSaved(new Date());
          setHasUnsavedChanges(false);
        } else {
          setIsStorageAvailable(false);
        }
      }, debounceMs),
    [formId, debounceMs]
  );

  const updateFormData = useCallback(
    (data: Partial<T>) => {
      setFormData((prev) => {
        const newData = { ...prev, ...data };

        if (autoSave) {
          debouncedSave(newData);
        }

        return newData;
      });
      setHasUnsavedChanges(true);
    },
    [autoSave, debouncedSave]
  );

  const saveFormData = useCallback(() => {
    const success = FormStorage.saveData(formId, formData);
    if (success) {
      setLastSaved(new Date());
      setHasUnsavedChanges(false);
    }
    return success;
  }, [formId, formData]);

  const clearFormData = useCallback(() => {
    FormStorage.removeData(formId);
    setFormData({});
    setHasUnsavedChanges(false);
    setLastSaved(null);
  }, [formId]);

  // Load persisted data on mount
  useEffect(() => {
    const persistedData = FormStorage.loadData(formId);
    if (persistedData) {
      setFormData(persistedData);
      setLastSaved(new Date());
    }

    const storageInfo = FormStorage.getStorageInfo();
    setIsStorageAvailable(storageInfo.available);
  }, [formId]);

  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (hasUnsavedChanges && Object.keys(formData).length > 0) {
        FormStorage.saveData(formId, formData);
        const message =
          "You have unsaved changes. Are you sure you want to leave?";
        e.returnValue = message;
        return message;
      }
    };

    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, [hasUnsavedChanges, formData, formId]);

  return {
    formData,
    updateFormData,
    saveFormData,
    clearFormData,
    hasUnsavedChanges,
    isStorageAvailable,
    lastSaved,
  };
}

/**
 * Utility function for debouncing
 */
function debounce<T extends (...args: any[]) => any>(
  func: T,
  wait: number
): (...args: Parameters<T>) => void {
  let timeout: NodeJS.Timeout;

  return (...args: Parameters<T>) => {
    clearTimeout(timeout);
    timeout = setTimeout(() => func(...args), wait);
  };
}

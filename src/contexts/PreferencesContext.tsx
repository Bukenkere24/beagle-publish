import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
  type ReactNode,
} from "react";
import { useAuth } from "../hooks/useAuth";
import { supabase } from "../lib/supabase";
import {
  type UserPreferences,
  DEFAULT_PREFERENCES,
} from "../types/preferences";

interface PreferencesContextValue {
  preferences: UserPreferences;
  loading: boolean;
  updatePreferences: (updates: Partial<UserPreferences>) => Promise<void>;
  refreshPreferences: () => Promise<void>;
  toggleTheme: () => void;
}

const PreferencesContext = createContext<PreferencesContextValue | null>(null);

export function PreferencesProvider({ children }: { children: ReactNode }) {
  const { user, refreshProfile } = useAuth();
  const [preferences, setPreferences] =
    useState<UserPreferences>(DEFAULT_PREFERENCES);
  const [loading, setLoading] = useState(true);

  const refreshPreferences = useCallback(async () => {
    if (!user?.id) {
      setPreferences(DEFAULT_PREFERENCES);
      setLoading(false);
      return;
    }

    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("bcc_profiles")
        .select("preferences")
        .eq("id", user.id)
        .single();

      if (error) throw error;

      const mergedPrefs = {
        ...DEFAULT_PREFERENCES,
        ...(data?.preferences || {}),
      };
      setPreferences(mergedPrefs);

      // Apply theme
      applyTheme(mergedPrefs.theme);
    } catch (err) {
      console.error("Failed to load preferences:", err);
    } finally {
      setLoading(false);
    }
  }, [user?.id]);

  useEffect(() => {
    refreshPreferences();
  }, [refreshPreferences]);

  const applyTheme = (theme: "light" | "dark" | "system") => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");

    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)")
        .matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  };

  const updatePreferences = async (updates: Partial<UserPreferences>) => {
    if (!user?.id) return;

    const newPrefs = { ...preferences, ...updates };
    setPreferences(newPrefs);
    applyTheme(newPrefs.theme);

    try {
      const { error } = await supabase
        .from("bcc_profiles")
        .update({ preferences: newPrefs })
        .eq("id", user.id);

      if (error) throw error;
      await refreshProfile();
    } catch (err) {
      console.error("Failed to update preferences:", err);
      // Revert local state if DB update fails
      refreshPreferences();
    }
  };

  const toggleTheme = () => {
    const nextThemeMap: Record<string, "light" | "dark" | "system"> = {
      light: "dark",
      dark: "system",
      system: "light",
    };
    const nextTheme = nextThemeMap[preferences.theme] || "dark";
    updatePreferences({ theme: nextTheme });
  };

  return (
    <PreferencesContext.Provider
      value={{
        preferences,
        loading,
        updatePreferences,
        refreshPreferences,
        toggleTheme,
      }}
    >
      {children}
    </PreferencesContext.Provider>
  );
}

export function usePreferences() {
  const context = useContext(PreferencesContext);
  if (!context) {
    throw new Error("usePreferences must be used within a PreferencesProvider");
  }
  return context;
}

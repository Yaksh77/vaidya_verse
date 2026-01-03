import { User } from "@/lib/types";
import {
  getWithAuth,
  postWithoutAuth,
  putWithAuth,
} from "@/service/httpService";
import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";

interface AuthState {
  user: User | null;
  token: string | null;
  loading: boolean;
  error: string | null;
  isAuthenticated: boolean;
  hasHydrated: boolean;

  setUser: (user: User, token: string) => void;
  clearError: () => void;
  logout: () => void;
  setHasHydrated: (state: any) => void;

  loginDoctor: (email: string, password: string) => Promise<void>;
  loginPatient: (email: string, password: string) => Promise<void>;
  registerDoctor: (data: any) => Promise<void>;
  registerPatient: (data: any) => Promise<void>;
  fetchProfile: () => Promise<User | null>;
  updateProfile: (data: any) => Promise<void>;
}

export const userAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      token: null,
      loading: false,
      error: null,
      isAuthenticated: false,
      hasHydrated: false,

      setHasHydrated: (state) => set({ hasHydrated: state }),

      setUser: (user, token) => {
        set({
          user,
          token,
          isAuthenticated: true,
          error: null,
        });
      },

      clearError: () => set({ error: null }),

      logout: () =>
        set({
          user: null,
          token: null,
          isAuthenticated: false,
          error: null,
        }),

      loginDoctor: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("auth/doctor/login", {
            email,
            password,
          });
          get().setUser(response.data.user, response.data.token);
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      loginPatient: async (email, password) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("auth/patient/login", {
            email,
            password,
          });
          get().setUser(response.data.user, response.data.token);
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      registerDoctor: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("auth/doctor/register", data);
          get().setUser(response.data.user, response.data.token);
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      registerPatient: async (data) => {
        set({ loading: true, error: null });
        try {
          const response = await postWithoutAuth("auth/patient/register", data);
          get().setUser(response.data.user, response.data.token);
        } catch (err: any) {
          set({ error: err.message });
        } finally {
          set({ loading: false });
        }
      },

      fetchProfile: async () => {
        try {
          const { user } = get();
          if (!user) return null;

          const endpoint =
            user.type === "doctor" ? "/doctor/me" : "/patient/me";

          const response = await getWithAuth(endpoint);
          set({ user: { ...user, ...response.data } });

          return response.data;
        } catch (err: any) {
          set({ error: err.message });
          return null;
        }
      },

      updateProfile: async (data) => {
        try {
          const { user } = get();
          if (!user) throw new Error("User not found");

          const endpoint =
            user.type === "doctor" ? "/doctor/me" : "/patient/me";

          const response = await putWithAuth(endpoint, data);
          set({ user: { ...user, ...response.data } });
        } catch (err: any) {
          set({ error: err.message });
          throw err;
        }
      },
    }),
    {
      name: "auth-storage",
      storage: createJSONStorage(() => localStorage), // ✅ browser-only
      partialize: (state) => ({
        user: state.user,
        token: state.token,
        isAuthenticated: state.isAuthenticated,
      }),
      onRehydrateStorage: () => (state) => {
        state?.setHasHydrated(true); // ✅ IMPORTANT
      },
    }
  )
);

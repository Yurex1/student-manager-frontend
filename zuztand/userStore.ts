import { API_URL } from "@/app/config/API_URL";
import axios from "axios";
import { create } from "zustand";
import { persist } from "zustand/middleware";

interface User {
  id: string;
  login: string;
  name: string;
  isAdmin: boolean;
  school: object;
  schoolId: string;
}

interface UserState {
  user: User | null;
  loading: boolean;
  error: string | null;
  setUser: (user: User | null) => void;
  updateUser: (updatedUser: Partial<User>) => void;
  logoutUser: () => void;
  setError: (error: string) => void;
}

export const useUserStore = create<UserState>()(
  persist(
    (set) => ({
      user: null,
      loading: false,
      error: null,
      setUser: (user) => set({ user }),
      updateUser: (updatedUser) =>
        set((state) => ({
          user: state.user ? { ...state.user, ...updatedUser } : null,
        })),
      logoutUser: () => {
        axios.post(
          `${API_URL}/api/auth/logout`,
          {},
          {
            withCredentials: true,
          }
        );
        set({ user: null });
        set({ error: null });
        console.log("User logged out");
        window.location.href = "/login";
      },
      setError: (error) => set({ error }),
    }),
    {
      name: "user-storage",
    }
  )
);

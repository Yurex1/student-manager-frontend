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
        localStorage.removeItem("authToken");
        set({ user: null });
      },
    }),
    {
      name: "user-storage",
    }
  )
);

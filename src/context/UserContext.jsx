import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { userService } from "../services/userService";

const DEFAULT_USER_ID = import.meta.env.VITE_DEFAULT_USER_ID || "USR-001";
const USER_STORAGE_KEY = "exquisit_time_active_user_id";
const QUICK_USERS = [DEFAULT_USER_ID, "USR-00001", "USR-00002", "USR-00003"];

function normalizeUserId(value) {
  const text = String(value || "").trim();
  if (!text) return DEFAULT_USER_ID;
  const match = text.match(/^USR-(\d{1,5})$/i);
  if (!match) return text;
  const n = Number(match[1]);
  if (!Number.isFinite(n) || n <= 0) return text.toUpperCase();
  return `USR-${String(n).padStart(5, "0")}`;
}

function readInitialUserId() {
  if (typeof window === "undefined") return DEFAULT_USER_ID;
  try {
    return normalizeUserId(window.localStorage.getItem(USER_STORAGE_KEY));
  } catch {
    return DEFAULT_USER_ID;
  }
}

const UserContext = createContext(null);

export function UserProvider({ children }) {
  const [userId, setUserIdState] = useState(readInitialUserId);
  const [users, setUsers] = useState(Array.from(new Set(QUICK_USERS)));
  const [usersLoading, setUsersLoading] = useState(false);
  const [usersError, setUsersError] = useState(null);

  const setUserId = (value) => {
    const next = normalizeUserId(value);
    setUserIdState(next);
    setUsers((prev) => (prev.includes(next) ? prev : [next, ...prev]));
    if (typeof window !== "undefined") {
      window.localStorage.setItem(USER_STORAGE_KEY, next);
    }
  };

  useEffect(() => {
    const loadUsers = async () => {
      try {
        setUsersLoading(true);
        setUsersError(null);
        const ids = await userService.listAllUserIds();
        const merged = Array.from(new Set([...ids, ...QUICK_USERS, userId])).filter(Boolean);
        setUsers(merged);
        if (ids.length > 0 && !ids.includes(userId)) {
          const next = normalizeUserId(ids[0]);
          setUserIdState(next);
          if (typeof window !== "undefined") {
            window.localStorage.setItem(USER_STORAGE_KEY, next);
          }
        }
      } catch (err) {
        setUsersError(err.message);
        setUsers((prev) => Array.from(new Set([...prev, ...QUICK_USERS, userId])));
      } finally {
        setUsersLoading(false);
      }
    };
    loadUsers();
  }, [userId]);

  const value = useMemo(
    () => ({
      userId,
      defaultUserId: DEFAULT_USER_ID,
      users,
      usersLoading,
      usersError,
      setUserId,
    }),
    [userId, users, usersLoading, usersError]
  );

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
}

export function useUser() {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }
  return context;
}

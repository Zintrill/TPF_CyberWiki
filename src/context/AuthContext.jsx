import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [firebaseError, setFirebaseError] = useState(false);

  useEffect(() => {
    try {
      const unsub = onAuthStateChanged(
        auth,
        (u) => setUser(u ?? null),
        (err) => {
          console.warn("Firebase auth error:", err.code);
          setFirebaseError(true);
          setUser(null);
        }
      );
      return unsub;
    } catch (err) {
      console.warn("Firebase not configured:", err);
      setFirebaseError(true);
      setUser(null);
    }
  }, []);

  const logout = async () => {
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Logout error:", err);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, firebaseError }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

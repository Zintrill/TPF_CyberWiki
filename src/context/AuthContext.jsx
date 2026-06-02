import { createContext, useContext, useEffect, useState } from "react";
import { onAuthStateChanged, signOut } from "firebase/auth";
import { auth } from "../firebase";

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(undefined);
  const [firebaseError, setFirebaseError] = useState(false);
  const [isDemo, setIsDemo] = useState(false);

  useEffect(() => {
    try {
      const unsub = onAuthStateChanged(
        auth,
        (u) => { if (!isDemo) setUser(u ?? null); },
        (err) => {
          console.warn("Firebase auth error:", err.code);
          setFirebaseError(true);
          if (!isDemo) setUser(null);
        }
      );
      return unsub;
    } catch (err) {
      console.warn("Firebase not configured:", err);
      setFirebaseError(true);
      if (!isDemo) setUser(null);
    }
  }, [isDemo]);

  const loginDemo = (role = "admin") => {
    const demoUser = {
      email: `${role}@cyberwiki.demo`,
      displayName: role === "admin" ? "Admin Demo" : "Demo User",
      uid: `demo-${role}`,
      isDemo: true,
      isAdmin: role === "admin",
    };
    setIsDemo(true);
    setUser(demoUser);
  };

  const logout = async () => {
    if (isDemo) {
      setIsDemo(false);
      setUser(null);
      return;
    }
    try {
      await signOut(auth);
    } catch (err) {
      console.warn("Logout error:", err);
      setUser(null);
    }
  };

  return (
    <AuthContext.Provider value={{ user, logout, firebaseError, loginDemo, isDemo }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);

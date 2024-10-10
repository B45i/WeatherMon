import { auth } from "@/firebase";
import { User } from "firebase/auth";
import { createContext, useState, useEffect } from "react";

export const AuthContext = createContext<User | null>(null);

export const AuthProvider = ({ children }: { children: JSX.Element }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      setIsLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (isLoading) {
    return (
      <div className="h-screen w-screen grid place-content-center">
        Loading...
      </div>
    );
  }

  return <AuthContext.Provider value={user}>{children}</AuthContext.Provider>;
};

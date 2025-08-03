import { onAuthStateChanged } from "firebase/auth";
import { createContext, useContext, useEffect, useState } from "react";
import { auth, db } from "../firebase/Config";
import { doc, getDoc } from "firebase/firestore";
import { toast } from "react-toastify";
import LoadingSpinner from "../utils/LoadingSpinner";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, async (user) => {
      if (user) {
        try {
          const fetchCurrentUser = await getDoc(doc(db, "users", user.uid));
          if (fetchCurrentUser.exists()) {
            setUser({
              id: user.uid,
              ...fetchCurrentUser.data(),
            });
          } else {
            setUser(null);
          }
        } catch (err) {
          setUser(null);
          toast.error(`User does not exist, ${err.message}`);
        }
      } else {
        setUser(null);
      }
      setLoading(false);
    });

    return () => unsubscribe();
  }, []);

  if (loading) {
    return <LoadingSpinner />;
  }

  return (
    <AuthContext.Provider value={{ user, setUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  return useContext(AuthContext);
};

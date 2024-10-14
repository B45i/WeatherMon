import { GoogleAuthProvider, signInWithPopup } from "firebase/auth";
import { FaGoogle } from "react-icons/fa";
import { auth } from "../firebase";
import { Button } from "antd";

export const Login = () => {
  const handleGoogleSignIn = async () => {
    const provider = new GoogleAuthProvider();
    try {
      const result = await signInWithPopup(auth, provider);
      const user = result.user;
      console.log("User signed in:", user);
    } catch (error) {
      console.error("Error signing in:", error);
    }
  };
  return (
    <div className="h-screen w-screen grid place-content-center">
      <Button type="primary" onClick={handleGoogleSignIn}>
        Sign in with <FaGoogle className="ml-4" />
      </Button>
    </div>
  );
};

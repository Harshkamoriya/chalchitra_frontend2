import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Pacifico } from 'next/font/google';


const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400", // or other available weights
});


const Auth_modal = ({ isOpen, onClose, defaultMode }) => {
  const [authMode, setAuthMode] = useState(defaultMode || 'login');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userData, setUserData] = useState({});
  


  if (!isOpen) return null;

  const handleonchange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
  };

  const validateForm = () => {
    if (!email || !password) {
      toast.error('Email and password are required');
      return false;
    }
    if (!/\S+@\S+\.\S+/.test(email)) {
      toast.error('Email format is invalid');
      return false;
    }
    if (password.length < 6) {
      toast.error('Password must be at least 6 characters');
      return false;
    }
    return true;
  };

 const handleonsubmit = async (e) => {
  e.preventDefault();

  const isValid = validateForm(email, password);
  if (!isValid) return;

  if (authMode === "signup") {
    try {
      const res = await fetch("/api/auth/signup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }), // add name and role as needed
      });

      const data = await res.json();

      if (!res.ok) {
        toast.error(data.error || "Signup failed");
        return;
      }

      toast.success("Signup successful. Logging you in...");

      // Automatically log in after signup
      const loginRes = await signIn("credentials", {
        redirect: false,
        email,
        password,
      });

      if (loginRes.ok) {
        toast.success("Login successful");
        // Close modal or navigate
      } else {
        toast.error("Auto-login failed after signup");
      }

    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    }

  } else {
    // Login flow using credentials provider
    const loginRes = await signIn("credentials", {
      redirect: false,
      email,
      password,
    });

    if (loginRes.ok) {
      toast.success("Login successful");
      // Close modal or navigate
    } else {
      toast.error("Invalid email or password");
    }
  }
};

const handleSignin = async (e, provider) => {
  e.preventDefault();   
  if(provider === 'google') {   
    signIn('google', {
      callbackUrl: '/',

    });
    console.log("signing in with google");
    toast.success("Signed in with Google...");
    } else if (provider === 'github') { 
    signIn('github', {
      callbackUrl: '/',
    }); 
    console.log("signing in with github");
    toast.success("Signed in with GitHub...");

    }
}



  return (
<div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg">
       <div className="flex justify-between items-center mb-4">
  <Button
    onClick={onClose}
    className="bg-transparent text-black font-bold text-xl border-b-2 border-black"
  >
    ✕
  </Button>
</div>

<div className="text-pink-500">
  <h2 className="text-xl sm:text-2xl md:text-3xl text-purple-600 font-bold text-center mb-4">
    <span   className={cn(
                        "text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600",
                        pacifico.className,
                      )} >Welcome Back let's get started ! </span>
  </h2>
</div>


        <form onSubmit={handleonsubmit} className="flex flex-col gap-3">
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            className="border border-gray-400 p-2 rounded"
            onChange={handleonchange}
            value={email}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            className="border border-gray-400 p-2 rounded"
            onChange={handleonchange}
            value={password}
            required
          />

          <Button type="submit" className={`w-full ${authMode === 'login' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
            {authMode === 'login' ? 'Login' : 'Sign Up'}
          </Button>
        </form>

        <div className="flex justify-center mt-4 gap-4">
          <button onClick={(e) => handleSignin(e, 'google')} className="flex items-center gap-2 border p-2 rounded">
            <FcGoogle /> Continue with Google
          </button>
          <button onClick={(e) => handleSignin(e, 'github')} className="flex items-center gap-2 border p-2 rounded">
            <FaGithub /> Continue with GitHub
          </button>
        </div>

        <p className="mt-4 text-center text-sm text-gray-600">
          {authMode === 'login' ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-blue-500 cursor-pointer ml-1"
            onClick={() => setAuthMode(authMode === 'login' ? 'signup' : 'login')}
          >
            {authMode === 'login' ? 'Sign Up' : 'Login'}
          </span>
        </p>

        <p className="text-xs text-gray-400 text-center mt-2">Privacy Policy © Chalchitra</p>
      </div>
    </div>
  );
};

export default Auth_modal;

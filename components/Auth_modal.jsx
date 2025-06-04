import React, { useState } from 'react';
import { FaGithub } from 'react-icons/fa';
import { FcGoogle } from 'react-icons/fc';
import { toast } from 'react-toastify';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { signIn } from 'next-auth/react';
import { cn } from '@/lib/utils';
import { Pacifico } from 'next/font/google';
import Loader from './Loader'; // ✅ import Loader

const pacifico = Pacifico({
  subsets: ["latin"],
  weight: "400",
});

const Auth_modal = ({ isOpen, onClose, defaultMode }) => {
  const [authMode, setAuthMode] = useState(defaultMode || 'signin');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false); // ✅ loader state

  if (!isOpen) return null;

  const handleonchange = (e) => {
    const { name, value } = e.target;
    if (name === 'email') setEmail(value);
    else if (name === 'password') setPassword(value);
    else if (name === 'name') setName(value);
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
    if (!validateForm()) return;

    setLoading(true); // ✅ start loading

    try {
      if (authMode === "signup") {
        const res = await fetch("/api/auth/signup", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, email, password }),
        });

        const data = await res.json();
        if (!res.ok) {
          toast.error(data.error || "Signup failed");
          setLoading(false);
          return;
        }

        toast.success("Signup successful. Logging you in...");
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.ok || result?.status === 200) {
          toast.success("Login successful");
          onClose?.();
        } else {
          toast.error("Auto-login failed after signup");
        }

      } else {
        const result = await signIn("credentials", {
          redirect: false,
          email,
          password,
        });

        if (result?.ok || result?.status === 200) {
          toast.success("Login successful");
          onClose?.();
        } else {
          toast.error("Invalid email or password");
        }
      }
    } catch (err) {
      console.error(err);
      toast.error("Something went wrong");
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  const handleSignin = async (e, provider) => {
    e.preventDefault();
    setLoading(true); // ✅ start loading
    try {
await signIn(provider, { callbackUrl: `/?signin=${provider}` });
    } catch (error) {
      console.error(error);
      toast.error(`Sign in with ${provider} failed`);
    } finally {
      setLoading(false); // ✅ stop loading
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex justify-center items-center bg-black/30 backdrop-blur-sm">
      {loading && <Loader />} {/* ✅ Loader here */}
      <div className="bg-white rounded-md p-6 w-full max-w-md shadow-lg relative z-10">
        <div className="flex justify-between items-center mb-4">
          <Button
            onClick={onClose}
            className="bg-transparent text-black font-bold text-xl border-b-2 border-black"
          >
            ✕
          </Button>
        </div>

        <h2 className="text-xl sm:text-2xl md:text-3xl text-purple-600 font-bold text-center mb-4">
          <span className={cn("text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-purple-600 to-pink-600", pacifico.className)}>
            Welcome Back let's get started!
          </span>
        </h2>

        <form onSubmit={handleonsubmit} className="flex flex-col gap-3">
          {authMode === 'signup' && (
            <Input
              type="text"
              name="name"
              placeholder="Enter your name"
              onChange={handleonchange}
              value={name}
              required
            />
          )}
          <Input
            type="email"
            name="email"
            placeholder="Enter your email"
            onChange={handleonchange}
            value={email}
            required
          />
          <Input
            type="password"
            name="password"
            placeholder="Enter your password"
            onChange={handleonchange}
            value={password}
            required
          />

          <Button type="submit" className={`w-full ${authMode === 'signin' ? 'bg-blue-500' : 'bg-green-500'} text-white`}>
            {authMode === 'signin' ? 'Login' : 'Sign Up'}
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
          {authMode === 'signin' ? "Don't have an account?" : "Already have an account?"}
          <span
            className="text-blue-500 cursor-pointer ml-1"
            onClick={() => setAuthMode(authMode === 'signin' ? 'signup' : 'signin')}
          >
            {authMode === 'signin' ? 'Sign Up' : 'Sign In'}
          </span>
        </p>

        <p className="text-xs text-gray-400 text-center mt-2">Privacy Policy © Chalchitra</p>
      </div>
    </div>
  );
};

export default Auth_modal;

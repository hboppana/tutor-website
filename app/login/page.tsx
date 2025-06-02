'use client';
import { motion } from 'framer-motion';
import { useState } from 'react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function LoginPage() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    email: '',
    password: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle login logic here
    console.log('Login form submitted:', formData);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleBack = () => {
    router.push('/');
  };

  return (
    <div className="moving-gradient">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen flex items-center justify-center p-4"
      >
        <div className="glass-card w-full max-w-md">
          <button
            onClick={handleBack}
            className="btn-back mb-6"
            type="button"
          >
            <Image
              src="/back-arrow.svg"
              alt="Back"
              width={20}
              height={20}
              className="w-5 h-5"
            />
            Back
          </button>

          <h1 className="text-3xl font-bold text-white mb-8 text-center">Welcome Back</h1>
          
          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="form-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your email"
              />
            </div>

            <div>
              <label htmlFor="password" className="form-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                required
                className="form-input"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              className="btn-primary w-full"
            >
              Log In
            </button>

            <div className="divider">
              <div className="divider-text">
                <span>or continue with</span>
              </div>
            </div>

            <button
              type="button"
              className="btn-secondary w-full flex items-center justify-center gap-2"
            >
              <Image
                src="/google-icon.svg"
                alt="Google"
                width={24}
                height={24}
                className="w-6 h-6"
              />
              Sign in with Google
            </button>
          </form>
        </div>
      </motion.div>
    </div>
  );
} 
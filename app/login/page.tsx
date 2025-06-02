'use client';
import { motion } from 'framer-motion';
import { useState, useEffect } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface ParticleProps {
  x: number;
  y: number;
  size: number;
  duration: number;
  delay: number;
}

// Particle component
const Particle = ({ x, y, size, duration, delay }: ParticleProps) => {
  return (
    <motion.div
      className="absolute rounded-full bg-white/40 backdrop-blur-sm shadow-lg"
      style={{
        width: size,
        height: size,
        x,
        y,
      }}
      animate={{
        y: [y, y - 100],
        opacity: [0, 0.8, 0],
      }}
      transition={{
        duration,
        delay,
        repeat: Infinity,
        ease: "linear",
      }}
    />
  );
};

// Particle container component
const ParticleContainer = () => {
  const [particles, setParticles] = useState<ParticleProps[]>([]);

  useEffect(() => {
    const newParticles = Array.from({ length: 20 }, () => ({
      x: Math.random() * window.innerWidth,
      y: Math.random() * window.innerHeight,
      size: Math.random() * 4 + 2,
      duration: Math.random() * 3 + 2,
      delay: Math.random() * 2,
    }));
    setParticles(newParticles);
  }, []);

  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      {particles.map((particle, index) => (
        <Particle key={index} {...particle} />
      ))}
    </div>
  );
};

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
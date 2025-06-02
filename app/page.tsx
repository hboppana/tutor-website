'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';

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

export default function Home() {
  const servicesRef = useRef<HTMLElement>(null);
  const scheduleRef = useRef<HTMLElement>(null);
  const { scrollY } = useScroll();
  const buttonOpacity = useTransform(scrollY, [0, 100], [1, 0]);

  useEffect(() => {
    const handleScroll = () => {
      const scrollPosition = window.scrollY;
      if (scrollPosition > 100) {
        // You can add any scroll-based logic here if needed
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToServices = () => {
    servicesRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  const scrollToSchedule = () => {
    scheduleRef.current?.scrollIntoView({ 
      behavior: 'smooth',
      block: 'start'
    });
  };

  return (
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-emerald-600 to-blue-800 overflow-hidden">
      {/* Particles */}
      <ParticleContainer />

      {/* Animated Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-1 left-0 right-0">
          <svg className="relative w-full h-[100px] animate-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="rgba(255, 255, 255, 0.15)"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg className="relative w-full h-[100px] animate-wave-delayed" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="rgba(255, 255, 255, 0.1)"
              d="M0,64L48,80C96,96,192,128,288,128C384,128,480,96,576,90.7C672,85,768,107,864,128C960,149,1056,171,1152,165.3C1248,160,1344,128,1392,112L1440,96L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
      </div>

      {/* Hero Section with Animation */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center px-4 relative z-10"
      >
        {/* Login/Signup Buttons */}
        <div className="absolute top-8 right-8 flex gap-4">
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="px-6 py-2 bg-white/10 backdrop-blur-sm text-white font-semibold rounded-lg hover:bg-white/20 transition-colors border border-white/20"
          >
            Log In
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="px-6 py-2 bg-white text-blue-600 rounded-lg font-semibold hover:bg-blue-50 transition-colors shadow-lg"
          >
            Sign Up
          </motion.button>
        </div>

        <div className="text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, x: -100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: 0.3,
              duration: 1.5
            }}
            className="text-4xl sm:text-6xl font-bold text-white tracking-tight mb-6 leading-tight"
          >
            Hi, I&apos;m Hemanshu Boppana
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, x: 100 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: 0.6,
              duration: 1.5
            }}
            className="text-xl sm:text-2xl text-blue-100 mb-8 leading-relaxed"
          >
            Your Personal Academic Guide
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ 
              type: "spring",
              stiffness: 50,
              damping: 20,
              delay: 0.9,
              duration: 1.5
            }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4 w-full max-w-2xl mx-auto"
          >
            <button 
              onClick={scrollToServices}
              className="bg-white text-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[200px] w-full sm:w-auto"
            >
              View Services
            </button>
            <button 
              onClick={scrollToSchedule}
              className="bg-transparent text-white border-2 border-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-white/10 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[200px] w-full sm:w-auto"
            >
              Schedule a Session
            </button>
          </motion.div>
        </div>

        {/* Animated Scroll Button */}
        <motion.div
          style={{ opacity: buttonOpacity }}
          className="absolute bottom-8 left-1/2 transform -translate-x-1/2 cursor-pointer"
          onClick={scrollToServices}
          whileHover={{ y: 5 }}
          whileTap={{ scale: 0.95 }}
        >
          <div className="bg-white/10 backdrop-blur-sm p-3 rounded-full border border-white/20 shadow-lg">
            <Image
              src="/scroll-arrow.svg"
              alt="Scroll down"
              width={40}
              height={40}
              className="animate-bounce invert"
            />
          </div>
        </motion.div>
      </motion.section>

      {/* Separator */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100" />

      {/* About Me Section */}
      <motion.section 
        id="about"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, margin: "-100px" }}
        className="py-20 px-4 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
          >
            About Me
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false }}
            className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-100"
          >
            {/* Content will be added later */}
          </motion.div>
        </div>
      </motion.section>

      {/* Separator */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100" />

      {/* Services Section */}
      <motion.section 
        ref={servicesRef}
        id="services"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, margin: "-100px" }}
        className="py-20 px-4 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
            className="text-3xl sm:text-4xl font-bold text-center text-white mb-12"
          >
            My Services
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: false }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-4">General Instruction</h3>
              <p className="text-blue-100 mb-6">
                Comprehensive tutoring sessions covering various subjects and topics. Perfect for students seeking general academic support.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">$30/hr</span>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
                  Book Now
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: false }}
              className="bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20"
            >
              <h3 className="text-2xl font-bold text-white mb-4">SAT/ACT Prep</h3>
              <p className="text-blue-100 mb-6">
                Specialized test preparation sessions focusing on SAT and ACT strategies, practice tests, and comprehensive review.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-white">$35/hr</span>
                <button className="bg-white text-blue-600 px-6 py-2 rounded-md hover:bg-blue-50 transition-colors">
                  Book Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Separator */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100" />

      {/* Schedule Section */}
      <motion.section 
        ref={scheduleRef}
        id="schedule"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, margin: "-100px" }}
        className="py-20 px-4 scroll-mt-20"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
            className="text-3xl sm:text-4xl font-bold text-center text-white mb-12"
          >
            Schedule a Session
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false }}
            className="max-w-4xl mx-auto bg-white/10 backdrop-blur-sm p-8 rounded-xl shadow-lg border border-white/20"
          >
            {/* Webhook placeholder */}
            <div className="text-center text-blue-100">
              Scheduling system coming soon...
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

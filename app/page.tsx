'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import React from 'react';

// GridLines component
const GridLines = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <div className="absolute inset-0" style={{
        backgroundImage: `
          linear-gradient(to right, rgba(0, 0, 0, 0.15) 1px, transparent 1px),
          linear-gradient(to bottom, rgba(0, 0, 0, 0.15) 1px, transparent 1px)
        `,
        backgroundSize: '50px 50px',
        maskImage: 'linear-gradient(to bottom, transparent, rgba(0, 0, 0, 0.8), transparent)'
      }} />
    </div>
  );
};

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
      className="absolute rounded-full bg-white/60 backdrop-blur-sm shadow-lg"
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
      size: Math.random() * 8 + 4,
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
  const [currentTestimonial, setCurrentTestimonial] = useState(0);

  const testimonials = [
    {
      name: "Susana Z.",
      role: "Mom of Adrian Zapatier",
      text: "My son Adrian is in a 5th grade gifted class that is both challenging and fast-paced, covering advanced math standards from sixth through eighth grade. Hemanshu has worked intensively with him to ensure he not only keeps up but also builds a strong foundation for future learning.",
      image: "/testimonial1.jpg"
    },
    {
      name: "Prajwal N.",
      role: "High School Senior",
      text: "The way Hemanshu breaks down complex concepts into understandable parts is incredible. He's helped me maintain a 4.0 in my first semester!",
      image: "/testimonial2.jpg"
    },
    {
      name: "Emily R.",
      role: "AP Student",
      text: "Thanks to Hemanshu's guidance, I got a 5 on my AP Calculus exam. His teaching style is engaging and effective!",
      image: "/testimonial3.jpg"
    }
  ];

  const nextTestimonial = () => {
    setCurrentTestimonial((prev) => (prev + 1) % testimonials.length);
  };

  const prevTestimonial = () => {
    setCurrentTestimonial((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  const goToTestimonial = (index: number) => {
    setCurrentTestimonial(index);
  };

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
    <div className="relative min-h-screen bg-gradient-to-br from-blue-600 via-blue-400 to-blue-600 overflow-hidden font-['Poppins']">
      {/* GridLines */}
      <GridLines />
      
      {/* Particles */}
      <ParticleContainer />

      {/* Animated Waves */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -bottom-1 left-0 right-0">
          <svg className="relative w-full h-[100px] animate-wave" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="rgba(59, 130, 246, 0.1)"
              d="M0,192L48,197.3C96,203,192,213,288,229.3C384,245,480,267,576,250.7C672,235,768,181,864,181.3C960,181,1056,235,1152,234.7C1248,235,1344,181,1392,154.7L1440,128L1440,320L1392,320C1344,320,1248,320,1152,320C1056,320,960,320,864,320C768,320,672,320,576,320C480,320,384,320,288,320C192,320,96,320,48,320L0,320Z"
            ></path>
          </svg>
        </div>
        <div className="absolute -bottom-1 left-0 right-0">
          <svg className="relative w-full h-[100px] animate-wave-delayed" viewBox="0 0 1440 320" preserveAspectRatio="none">
            <path
              fill="rgba(59, 130, 246, 0.05)"
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
            className="btn-primary"
          >
            <Link href="/login" className="block w-full h-full">
              Log In
            </Link>
          </motion.button>
          <motion.button
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="btn-secondary"
          >
            <Link href="/signup" className="block w-full h-full">
              Sign Up
            </Link>
          </motion.button>
        </div>

        <div className="flex flex-col md:flex-row items-center md:items-start justify-center md:justify-between w-full max-w-7xl mx-auto">
          {/* Left Side: Intro */}
          <div className="text-center md:text-left md:w-1/2 mb-12 md:mb-0">
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
              className="text-4xl sm:text-6xl font-normal tracking-tight mb-6 leading-tight"
            >
              <span className="text-blue-950 font-semibold tracking-wide">Hi, I&apos;m Hemanshu Boppana</span>
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
              className="text-xl sm:text-2xl text-white mb-8 leading-relaxed font-normal italic"
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
              className="flex flex-col sm:flex-row items-center justify-center md:justify-start gap-6 mt-4 w-full max-w-2xl mx-auto md:mx-0"
            >
              <button 
                onClick={scrollToServices}
                className="btn-primary min-w-[200px] w-full sm:w-auto"
              >
                View Services
              </button>
            </motion.div>
          </div>

          {/* Right Side: About Me */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false }}
            className="md:w-1/2 md:pl-12 text-center md:text-left mt-12 md:mt-0"
          >
            <motion.h2 
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="text-3xl sm:text-4xl font-semibold text-white mb-8 bg-gradient-to-r from-blue-200 to-white bg-clip-text text-transparent"
            >
              About Me
            </motion.h2>
            <motion.div 
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="space-y-6"
            >
              <p className="text-white font-normal leading-relaxed text-xl">
                Computer Science & Statistics student at UF, passionate about helping students achieve their academic goals through personalized tutoring.
              </p>
              <ul className="text-white space-y-4 font-normal text-xl">
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="flex items-center space-x-3"
                >
                  <svg className="w-8 h-8 text-blue-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M4 19.5V4.5C4 3.67157 4.67157 3 5.5 3H18.5C19.3284 3 20 3.67157 20 4.5V19.5C20 20.3284 19.3284 21 18.5 21H5.5C4.67157 21 4 20.3284 4 19.5Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M4 16H20" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M8 3V21" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>3+ Years of Tutoring Experience</span>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="flex items-center space-x-3"
                >
                  <svg className="w-8 h-8 text-blue-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M12 22C17.5228 22 22 17.5228 22 12C22 6.47715 17.5228 2 12 2C6.47715 2 2 6.47715 2 12C2 17.5228 6.47715 22 12 22Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M12 6V12L16 14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>1560 SAT Score</span>
                </motion.li>
                <motion.li 
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: 0.5 }}
                  className="flex items-center space-x-3"
                >
                  <svg className="w-8 h-8 text-blue-200" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
                    <path d="M9 3H4C3.44772 3 3 3.44772 3 4V9C3 9.55228 3.44772 10 4 10H9C9.55228 10 10 9.55228 10 9V4C10 3.44772 9.55228 3 9 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 3H15C14.4477 3 14 3.44772 14 4V9C14 9.55228 14.4477 10 15 10H20C20.5523 10 21 9.55228 21 9V4C21 3.44772 20.5523 3 20 3Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M9 14H4C3.44772 14 3 14.4477 3 15V20C3 20.5523 3.44772 21 4 21H9C9.55228 21 10 20.5523 10 20V15C10 14.4477 9.55228 14 9 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                    <path d="M20 14H15C14.4477 14 14 14.4477 14 15V20C14 20.5523 14.4477 21 15 21H20C20.5523 21 21 20.5523 21 20V15C21 14.4477 20.5523 14 20 14Z" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"/>
                  </svg>
                  <span>Machine Learning Researcher at UF</span>
                </motion.li>
              </ul>
            </motion.div>
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
              className="animate-bounce text-white"
            />
          </div>
        </motion.div>
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
            className="text-3xl sm:text-4xl font-normal text-center text-white mb-12"
          >
            My Services
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: false }}
              className="glass-card"
            >
              <h3 className="text-2xl font-normal text-white mb-4">General Instruction</h3>
              <p className="text-blue-100 mb-6 font-normal">
                Comprehensive tutoring sessions covering various subjects and topics. Perfect for students seeking general academic support.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-normal text-white">$30/hr</span>
                <button className="btn-primary">
                  Book Now
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: false }}
              className="glass-card"
            >
              <h3 className="text-2xl font-normal text-white mb-4">SAT/ACT Prep</h3>
              <p className="text-blue-100 mb-6 font-normal">
                Specialized test preparation sessions focusing on SAT and ACT strategies, practice tests, and comprehensive review.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-normal text-white">$35/hr</span>
                <button className="btn-primary">
                  Book Now
                </button>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>

      {/* Separator */}
      <div className="w-full h-1 bg-gradient-to-r from-blue-100 via-blue-300 to-blue-100" />

      {/* Testimonials Section */}
      <motion.section 
        id="testimonials"
        initial={{ opacity: 0, y: 50 }}
        whileInView={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        viewport={{ once: false, margin: "-100px" }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.2 }}
            viewport={{ once: false }}
            className="text-3xl sm:text-4xl font-normal text-center text-white mb-12"
          >
            Student Success Stories
          </motion.h2>
          
          <div className="max-w-4xl mx-auto">
            <motion.div 
              className="relative overflow-hidden"
              initial={{ opacity: 0 }}
              whileInView={{ opacity: 1 }}
              transition={{ duration: 0.8 }}
            >
              <div className="relative">
                <div className="flex transition-transform duration-500 ease-in-out">
                  {testimonials.map((testimonial, index) => (
                    <motion.div
                      key={index}
                      className="w-full flex-shrink-0 px-4"
                      initial={{ opacity: 0, x: 100 }}
                      whileInView={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.5, delay: index * 0.2 }}
                      style={{
                        transform: `translateX(-${currentTestimonial * 100}%)`,
                        display: index === currentTestimonial ? 'block' : 'none'
                      }}
                    >
                      <div className="glass-card p-8 rounded-2xl">
                        <div className="flex items-center mb-6">
                          <div className="w-16 h-16 rounded-full bg-blue-200/20 flex items-center justify-center text-2xl">
                            {testimonial.name[0]}
                          </div>
                          <div className="ml-4">
                            <h3 className="text-xl font-medium text-white">{testimonial.name}</h3>
                            <p className="text-blue-200">{testimonial.role}</p>
                          </div>
                        </div>
                        <p className="text-white text-lg italic">"{testimonial.text}"</p>
                      </div>
                    </motion.div>
                  ))}
                </div>

                {/* Navigation Arrows */}
                <div className="absolute -left-12 -right-12 top-1/2 -translate-y-1/2 flex items-center justify-between pointer-events-none">
                  <button
                    onClick={prevTestimonial}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors pointer-events-auto shadow-lg"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
                    </svg>
                  </button>
                  <button
                    onClick={nextTestimonial}
                    className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-colors pointer-events-auto shadow-lg"
                  >
                    <svg className="w-6 h-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                    </svg>
                  </button>
                </div>
                
                {/* Navigation Dots */}
                <div className="flex justify-center mt-8 space-x-2">
                  {testimonials.map((_, index) => (
                    <button
                      key={index}
                      className={`w-3 h-3 rounded-full transition-colors ${
                        index === currentTestimonial ? 'bg-white' : 'bg-white/30 hover:bg-white/50'
                      }`}
                      onClick={() => goToTestimonial(index)}
                    />
                  ))}
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </motion.section>
    </div>
  );
}

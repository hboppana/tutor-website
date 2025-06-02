'use client';
import { motion, useScroll, useTransform } from 'framer-motion';
import { useRef, useEffect } from 'react';
import Image from 'next/image';

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
    <div className="bg-white">
      {/* Hero Section with Animation */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center px-4 relative"
      >
        <div className="text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-6xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight mb-6 leading-tight"
          >
            Hi, I&apos;m Hemanshu Boppana
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl sm:text-2xl text-gray-600 mb-8 leading-relaxed"
          >
            Your Personal Academic Guide
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6 mt-4 w-full max-w-2xl mx-auto"
          >
            <button 
              onClick={scrollToServices}
              className="bg-blue-600 text-white px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-700 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[200px] w-full sm:w-auto"
            >
              View Services
            </button>
            <button 
              onClick={scrollToSchedule}
              className="bg-white text-blue-600 border-2 border-blue-600 px-10 py-4 rounded-lg text-lg font-semibold hover:bg-blue-50 transition-all duration-300 shadow-lg hover:shadow-xl transform hover:-translate-y-0.5 min-w-[200px] w-full sm:w-auto"
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
          <Image
            src="/scroll-arrow.svg"
            alt="Scroll down"
            width={40}
            height={40}
            className="animate-bounce"
          />
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
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
          >
            My Services
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.3 }}
              viewport={{ once: false }}
              className="bg-white p-8 rounded-xl shadow-lg border border-blue-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">General Instruction</h3>
              <p className="text-gray-600 mb-6">
                Comprehensive tutoring sessions covering various subjects and topics. Perfect for students seeking general academic support.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">$30/hr</span>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
                  Book Now
                </button>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, x: 30 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
              viewport={{ once: false }}
              className="bg-white p-8 rounded-xl shadow-lg border border-blue-100"
            >
              <h3 className="text-2xl font-bold text-gray-900 mb-4">SAT/ACT Prep</h3>
              <p className="text-gray-600 mb-6">
                Specialized test preparation sessions focusing on SAT and ACT strategies, practice tests, and comprehensive review.
              </p>
              <div className="flex items-center justify-between">
                <span className="text-2xl font-bold text-blue-600">$35/hr</span>
                <button className="bg-blue-600 text-white px-6 py-2 rounded-md hover:bg-blue-700 transition-colors">
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
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
          >
            Schedule a Session
          </motion.h2>
          
          <motion.div 
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.3 }}
            viewport={{ once: false }}
            className="max-w-4xl mx-auto bg-white p-8 rounded-xl shadow-lg border border-blue-100"
          >
            {/* Webhook placeholder */}
            <div className="text-center text-gray-600">
              Scheduling system coming soon...
            </div>
          </motion.div>
        </div>
      </motion.section>
    </div>
  );
}

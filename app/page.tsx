'use client';
import { motion } from 'framer-motion';
import Link from "next/link";

export default function Home() {
  return (
    <div className="min-h-screen bg-gradient-to-b from-blue-50 to-white">
      {/* Navbar */}
      <nav className="bg-white shadow-md border-b border-blue-100">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-20 items-center">
            <div className="flex-shrink-0">
              <h1 className="text-3xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent tracking-tight">
                TutorPro
              </h1>
            </div>
            <div className="hidden sm:flex sm:space-x-10">
              <Link href="/" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors duration-200">
                Home
              </Link>
              <Link href="/services" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors duration-200">
                Schedule a Session
              </Link>
              <Link href="/tutors" className="text-gray-700 hover:text-blue-600 px-3 py-2 text-base font-medium transition-colors duration-200">
                About My Services
              </Link>
            </div>
          </div>
        </div>
      </nav>

      {/* Hero Section with Animation */}
      <motion.section 
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
        className="min-h-screen flex items-center justify-center px-4"
      >
        <div className="text-center max-w-3xl">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6"
          >
            Hi, I&apos;m Hemanshu Boppana
          </motion.h1>
          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4, duration: 0.8 }}
            className="text-xl sm:text-2xl text-gray-600 mb-8"
          >
            Your Personal Academic Guide
          </motion.p>
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6, duration: 0.8 }}
            className="flex justify-center gap-4"
          >
            <a href="#services" className="bg-blue-600 text-white px-8 py-3 rounded-md text-lg font-medium hover:bg-blue-700 transition-colors">
              View Services
            </a>
          </motion.div>
        </div>
      </motion.section>

      {/* Services Section */}
      <motion.section 
        id="services"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        transition={{ duration: 0.8 }}
        viewport={{ once: true }}
        className="py-20 px-4"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
            className="text-3xl sm:text-4xl font-bold text-center text-gray-900 mb-12"
          >
            My Services
          </motion.h2>
          
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
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
              initial={{ opacity: 0, x: 20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.8 }}
              viewport={{ once: true }}
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
    </div>
  );
}

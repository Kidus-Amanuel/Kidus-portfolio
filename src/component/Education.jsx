import React from 'react';
import { motion } from 'framer-motion';
import DebreTaborLogo from '../assets/debretabor.jpg';
import SunnySideLogo from '../assets/Sunnyside.jpg';

const Education = () => {
  return (
    <section id="education" className="dark:bg-gray-900 py-12">
      <div className="container mx-auto px-4">
        <h2 className="text-4xl font-semibold text-gray-900 dark:text-white mb-8 text-center">
          Education Background
        </h2>
        <div className="space-y-10">
          {/* Debre Tabor University */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center transition-transform transform hover:scale-105"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7 }}
          >
            <img
              src={DebreTaborLogo}
              alt="Debre Tabor University"
              className="w-28 h-28 object-contain mr-6 mb-4 md:mb-0 rounded-full shadow-md border-2 border-blue-500"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Debre Tabor University
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                Bachelor's Degree in Electrical and Computer Engineering (Computer Stream)
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                2019 – 2025
              </p>
              <ul className="list-disc ml-5 mt-2 text-gray-600 dark:text-gray-300">
                <li>CGPA: <span className="font-semibold">3.64</span></li>
                <li>Exit Exam Score: <span className="font-semibold">70</span></li>
              </ul>
            </div>
          </motion.div>

          {/* Sunny Side Educational Institute */}
          <motion.div
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-8 flex flex-col md:flex-row items-center transition-transform transform hover:scale-105"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.7, delay: 0.3 }}
          >
            <img
              src={SunnySideLogo}
              alt="Sunny Side Educational Institute"
              className="w-28 h-28 object-contain mr-6 mb-4 md:mb-0 rounded-full shadow-md border-2 border-yellow-500"
            />
            <div className="flex-1">
              <h3 className="text-2xl font-bold text-gray-800 dark:text-white mb-2">
                Sunny Side Educational Institute
              </h3>
              <p className="text-gray-600 dark:text-gray-300 mb-1">
                High School Diploma
              </p>
              <p className="text-gray-600 dark:text-gray-300 mb-2">
                Graduated in 2019
              </p>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
};

export default Education;

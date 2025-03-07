import React from "react";
import Softnet from '../assets/pi-school-system-logo-only.png';
import ReccomendationSoftnet from "../assets/Recommended.pdf";
import Spectrum from "../assets/logo.png";
import { FaCircle } from "react-icons/fa";

const WorkExperience = () => {
  return (
    <div className="container mx-auto px-4 py-12 lg:py-10">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center relative pb-4">
        Work Experience
        <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-600 rounded-full"></div>
      </h1>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">
        {/* Experience Card 1 */}
        <div className="group bg-white border border-gray-200 rounded-xl shadow-lg p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <img className="w-10 h-10 object-contain" src={Spectrum} alt="Spectrum logo" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Customer Support and Technical Specialist
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Spectrum Engineering Company • 2024
              </p>
              <div className="mt-2">
                <span className="inline-block bg-blue-100 dark:bg-blue-900/30 text-blue-800 dark:text-blue-400 text-xs px-3 py-1 rounded-full">
                  Full-Time
                </span>
              </div>
            </div>
          </div>
          <ul className="space-y-3">
            {[
              "Provided exceptional customer support, addressing inquiries and troubleshooting issues to enhance customer satisfaction.",
              "Installed and configured networking equipment including antennas, switches, and routers for reliable Wi-Fi services.",
              "Diagnosed and resolved connectivity problems, ensuring optimal network performance.",
              "Collaborated with technical teams to improve service delivery and customer experience."
            ].map((item, index) => (
              <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                <FaCircle className="w-2 h-2 text-blue-600 mt-2 mr-3 flex-shrink-0" />
                <span className="text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
        </div>

        {/* Experience Card 2 */}
        <div className="group bg-white border border-gray-200 rounded-xl shadow-lg p-6 dark:bg-gray-800 dark:border-gray-700 hover:shadow-xl transition-shadow duration-300">
          <div className="flex items-start space-x-4 mb-6">
            <div className="flex-shrink-0">
              <div className="w-16 h-16 rounded-full bg-blue-50 dark:bg-blue-900/20 flex items-center justify-center">
                <img className="w-10 h-10 object-contain" src={Softnet} alt="Softnet logo" />
              </div>
            </div>
            <div className="flex-1">
              <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-1">
                Full Stack Development Intern
              </h2>
              <p className="text-gray-600 dark:text-gray-400 text-sm font-medium">
                Softnet Inc. • 2024
              </p>
              <div className="mt-2">
                <span className="inline-block bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-400 text-xs px-3 py-1 rounded-full">
                  Internship
                </span>
              </div>
            </div>
          </div>
          <ul className="space-y-3">
            {[
              "Developed and maintained web applications using React and Node.js.",
              "Collaborated with teams to design user-friendly interfaces and improve functionality.",
              "Managed confidential documents and maintained proper organizational systems.",
              "Received recommendation letter for outstanding internship performance."
            ].map((item, index) => (
              <li key={index} className="flex items-start text-gray-600 dark:text-gray-300">
                <FaCircle className="w-2 h-2 text-blue-600 mt-2 mr-3 flex-shrink-0" />
                <span className="text-base leading-relaxed">{item}</span>
              </li>
            ))}
          </ul>
          <div className="mt-6 border-t border-gray-100 dark:border-gray-700 pt-4">
            <a 
              href={ReccomendationSoftnet} 
              target="_blank" 
              rel="noopener noreferrer"
              className="text-blue-600 dark:text-blue-400 hover:text-blue-800 dark:hover:text-blue-300 font-medium flex items-center"
            >
              View Recommendation Letter
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default WorkExperience;
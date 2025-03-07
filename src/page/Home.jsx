import React from 'react';
import { motion } from 'framer-motion';
import AboutMe from '../component/AboutMe';
import Projects from '../component/Projects';
import Experience from '../component/Experience';
import Contact from "../component/Contact";
import Recommendations from "../component/Recommendation";
import Kidus from "../assets/KIDUS.jpg";
import CV from "../assets/KIDUS AMANUEL CVs.pdf";


const Home = () => {
  // Animation variant for text: fade in and slide up
  const textVariant = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8 } }
  };

  // Animation variant for the image: scale up and slight rotation on hover
  const imageVariant = {
    hover: { scale: 1.05, rotate: 2 }
  };

  return (
    <div>
      {/* Hero Section */}
      <section className="bg-white dark:bg-gray-900" id="home">
        <div className="grid max-w-screen-xl px-4 py-16 mx-auto lg:gap-8 xl:gap-0 lg:py-16 lg:grid-cols-12">
          <motion.div 
            className="mr-auto place-self-center lg:col-span-7"
            initial="hidden"
            animate="visible"
            variants={textVariant}
          >
            <h1 className="max-w-2xl mb-4 text-4xl font-extrabold tracking-tight leading-none md:text-5xl xl:text-6xl dark:text-white">
              HI I AM KIDUS AMANUEL
            </h1>
            <motion.p 
              className="max-w-2xl mb-6 font-light text-gray-500 lg:mb-8 md:text-lg lg:text-xl dark:text-gray-400"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            >
              Full-Stack Web Developer, UI/UX Designer, Network Technician, Video Editor
            </motion.p>
            <div className="flex flex-wrap gap-3">
            <a 
            href={CV} download
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:ring-blue-300 dark:focus:ring-blue-900"
              >
                Get CV
                <svg 
                  className="w-5 h-5 ml-2 -mr-1" 
                  fill="currentColor" 
                  viewBox="0 0 20 20" 
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path 
                    fillRule="evenodd" 
                    d="M10.293 3.293a1 1 0 011.414 0l6 6a1 1 0 010 1.414l-6 6a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-4.293-4.293a1 1 0 010-1.414z" 
                    clipRule="evenodd"
                  ></path>
                </svg>
              </a>
              <a 
                href="#contact" 
                className="inline-flex items-center justify-center px-5 py-3 text-base font-medium text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 dark:text-white dark:border-gray-700 dark:hover:bg-gray-700 dark:focus:ring-gray-800"
              >
                Contact Me
              </a>
            </div>
          </motion.div>
          <motion.div 
            className="mt-8 lg:mt-0 lg:col-span-5 flex justify-center items-center"
            whileHover="hover"
            variants={imageVariant}
          >
            <motion.img 
              src={Kidus} 
              alt="Kidus" 
              className="w-full max-w-md rounded-lg shadow-lg"
            />
          </motion.div>
        </div>
      </section>

      {/* Main Content */}
      <main>
        <section id="about">
          <AboutMe />
        </section>
        <section id="projects">
          <Projects />
        </section>
        <section id="experience">
          <Experience />
        </section>
        <section id="recommendations">
          <Recommendations />
        </section>
        <section id="contact">
          <Contact />
        </section>
      </main>
    </div>
  );
};

export default Home;

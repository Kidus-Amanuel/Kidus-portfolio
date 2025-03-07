// src/component/AboutMe.jsx
import React from "react";
import Education from "./Education";
import Skills from './Skill';

const AboutMe = () => {
  return (
    <div className="max-w-screen-xl mx-auto p-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center relative pb-4">About Me
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-600 rounded-full"></div>
      </h1>
      <p className="mt-4 text-lg text-gray-600 dark:text-gray-400">
        Hi, I'm Kidus Amanuel, a passionate web developer with a love for creating responsive, user-friendly applications. My skills include React, Node.js, and more. I enjoy tackling complex challenges and learning new technologies.
      </p>
      <Education/>
      <Skills />
    </div>
  );
};

export default AboutMe;
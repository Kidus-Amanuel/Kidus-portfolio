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
      Hi, I’m Kidus Amanuel, a creative web developer passionate about building intuitive, user-friendly applications. I specialize in React, Node.js, and modern web technologies, blending logic with creativity to craft seamless digital experiences. I love solving complex problems, learning new tools, and pushing boundaries to create innovative solutions. 🚀</p>
      <Education/>
      <Skills />
    </div>
  );
};

export default AboutMe;
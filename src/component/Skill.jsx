import React, { useEffect, useState } from "react";
import Python from "../assets/python-svgrepo-com.svg";
import Tailwind from "../assets/tailwindcss-icon-svgrepo-com.svg";
import Nodejs from "../assets/nodejs-svgrepo-com.svg";
import Nextjs from "../assets/nextjs-svgrepo-com.svg";
import Mysql from "../assets/mysql-svgrepo-com.svg";
import Re from "../assets/reactjs-svgrepo-com.svg";
import Postgrsql from "../assets/postgresql-svgrepo-com.svg";
import JavaScript from "../assets/javascript-svgrepo-com.svg";

const Skills = () => {
  const [animate, setAnimate] = useState(false);
  useEffect(() => {
    // Trigger animation after mount
    setAnimate(true);
  }, []);

  const skills = [
    { name: "React", icon: Re, proficiency: "95%" },
    { name: "Node.js", icon: Nodejs, proficiency: "85%" },
    { name: "JavaScript", icon: JavaScript, proficiency: "80%" },
    { name: "Python", icon: Python, proficiency: "80%" },
    { name: "Next.js", icon: Nextjs, proficiency: "80%" },
    { name: "Tailwind CSS", icon: Tailwind, proficiency: "90%" },
    { name: "MySQL", icon: Mysql, proficiency: "90%" },
    { name: "PostgreSQL", icon: Postgrsql, proficiency: "90%" },
  ];

  return (
    <section id="skills" className="my-8">
      <h2 className="text-3xl font-semibold text-gray-900 dark:text-white">Skills</h2>
      <div className="mt-4 grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, index) => (
          <div
            key={skill.name}
            className="skill p-4 border rounded-lg shadow hover:shadow-lg transition-shadow duration-300 transform hover:scale-105"
            style={{
              opacity: animate ? 1 : 0,
              transform: animate ? "translateY(0)" : "translateY(20px)",
              transition: "opacity 0.5s ease-out, transform 0.5s ease-out",
              transitionDelay: `${index * 0.1}s`,
            }}
          >
            <div className="flex items-center mb-2">
              <img src={skill.icon} alt={skill.name} className="h-8 w-8 mr-2" />
              <h3 className="text-xl font-medium text-gray-800 dark:text-white">{skill.name}</h3>
            </div>
            <div className="w-full bg-gray-200 rounded-full h-2.5 dark:bg-gray-700">
              <div
                className="bg-blue-600 h-2.5 rounded-full transition-all duration-1000 ease-out"
                style={{ width: animate ? skill.proficiency : "0%" }}
              ></div>
            </div>
            <span className="text-sm text-gray-500 mt-1">{skill.proficiency}</span>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Skills;

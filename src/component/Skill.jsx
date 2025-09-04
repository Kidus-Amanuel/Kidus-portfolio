import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import Python from "../assets/python-svgrepo-com.svg";
import Tailwind from "../assets/tailwindcss-icon-svgrepo-com.svg";
import Nodejs from "../assets/nodejs-svgrepo-com.svg";
import Nextjs from "../assets/nextjs-svgrepo-com.svg";
import Mysql from "../assets/mysql-svgrepo-com.svg";
import Re from "../assets/reactjs-svgrepo-com.svg";
import Postgrsql from "../assets/postgresql-svgrepo-com.svg";
import JavaScript from "../assets/javascript-svgrepo-com.svg";
import Firebase from "../assets/Firebase.png";

const Skills = () => {
  const [animate, setAnimate] = useState(false);

  useEffect(() => {
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
    { name: "Firebase", icon: Firebase, proficiency: "90%" },
  ];

  return (
    <section id="skills" className="my-16">
      <motion.h2
        className="text-3xl font-bold text-gray-900 dark:text-white text-center mb-10"
        initial={{ opacity: 0, y: -30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8 }}
      >
        Skills & Technologies
      </motion.h2>

      <div className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
        {skills.map((skill, index) => (
          <motion.div
            key={skill.name}
            className="p-6 bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-2xl shadow-md hover:shadow-xl cursor-pointer group"
            initial={{ opacity: 0, y: 40 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.15, duration: 0.6 }}
            whileHover={{ scale: 1.05 }}
          >
            {/* Icon + Title */}
            <div className="flex items-center mb-4">
              <motion.img
                src={skill.icon}
                alt={skill.name}
                className="h-10 w-10 mr-3"
                whileHover={{ rotate: 15 }}
                transition={{ type: "spring", stiffness: 200 }}
              />
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white">
                {skill.name}
              </h3>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-3 overflow-hidden">
              <motion.div
                className="bg-gradient-to-r from-blue-500 to-green-400 h-3 rounded-full"
                initial={{ width: 0 }}
                animate={{ width: animate ? skill.proficiency : "0%" }}
                transition={{ duration: 1.5, ease: "easeOut" }}
              />
            </div>

            {/* Proficiency Percentage */}
            <motion.span
              className="text-sm text-gray-600 dark:text-gray-400 mt-2 block"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 + index * 0.1 }}
            >
              {skill.proficiency}
            </motion.span>
          </motion.div>
        ))}
      </div>
    </section>
  );
};

export default Skills;

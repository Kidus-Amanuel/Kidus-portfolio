// src/component/Projects.jsx
import React from "react";
import Image1 from '../assets/download.jpg';
import Spectrum from '../assets/Spect.jpg';
import Movie from '../assets/mov.jpg';
import Student from '../assets/Student.jpg';
import SpectrumPortal from '../assets/FireShot Capture 001 - Vite + React - localhost.png';
import Ale from '../assets/Ale.jpg';
import Helloerf from '../assets/Helloerf.png';
import EmbroCoffee from '../assets/Emro.png';
import { Swiper, SwiperSlide } from 'swiper/react';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';

const Projects = () => {
  const projects = [
    {
  title: "Helloerf Website",
  description:
    "A modern, responsive company website with multi-language support, showcasing Helloerf’s services and brand identity with a clean UI and smooth navigation.",
  image: Helloerf, // Replace with your project image import
  link: "https://www.helloerf.com", // Replace with your GitHub link
},

{
  title: "Ale Tube",
  description:
    "A video streaming platform designed specifically for content creators, enabling YouTubers to upload, share, and interact with their videos in a user-friendly interface.",
  image: Ale, // Replace with your project image import
  link: "https://aletubes.netlify.app/", // Replace with your GitHub link
},

{
  title: "Embro Coffee",
  description:
    "An e-commerce website for Embro Coffee featuring product listings, shopping cart functionality, and a seamless checkout process.",
  image: EmbroCoffee, // Replace with your project image import
  link: "https://emrocoffee.netlify.app/", // Replace with your GitHub link
},

    {
      title: "Student Grading System",
      description:
        "A web application to manage student grades, track progress, and generate reports. This system allows teachers to input grades, and students can view their progress over time.",
      image: Student,
      link: "https://github.com/Kidus-Amanuel/Grading-System", // Replace with your GitHub link
    },
    {
      title: "Customer Portal for Spectrum",
      description:
        "An interactive portal for customers to manage their accounts, view services, and make payments. The portal enhances user experience with a clean UI and easy navigation.",
      image: SpectrumPortal,
      link: "https://github.com/Kidus-Amanuel/customerportal", // Replace with your GitHub link
    },
    {
      title: "Spectrum Landing Page",
      description:
        "A promotional landing page for Spectrum services, designed to capture leads and drive conversions. It features responsive design and optimized content for better engagement.",
      image: Spectrum,
      link: "https://github.com/Kidus-Amanuel/Spectrum", // Replace with your GitHub link
    },
    {
      title: "Movie Review App",
      description:
        "An application for users to browse movies, read reviews, and submit their own ratings. Users can create accounts to save their favorite films and share their opinions.",
      image: Movie,
      link: "https://github.com/Kidus-Amanuel/Kiik-Movie", // Replace with your GitHub link
    },
  ];

  return (
    <div className="container mx-auto px-4">
      <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-12 text-center relative pb-4">Projects
      <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-24 h-1 bg-blue-600 rounded-full"></div>
      </h1>
      <Swiper
        modules={[Navigation, Pagination, Autoplay]}
        spaceBetween={30}
        slidesPerView={1}
        navigation={{
          nextEl: '.swiper-button-next',
          prevEl: '.swiper-button-prev',
        }}
        pagination={{ 
          clickable: true,
          el: '.swiper-pagination',
        }}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        breakpoints={{
          640: { slidesPerView: 2 },
          1024: { slidesPerView: 3 },
        }}
        className="mySwiper"
      >
        {projects.map((project, index) => (
          <SwiperSlide key={index}>
            <div className="max-w-sm h-full bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700 mb-8 mx-2 transition-transform transform hover:scale-105 flex flex-col">
              <a href={project.link} target="_blank" rel="noopener noreferrer">
                <img className="rounded-t-lg h-48 w-full object-cover" src={project.image} alt={project.title} />
              </a>
              <div className="flex-1 p-5">
                <a href={project.link} target="_blank" rel="noopener noreferrer">
                  <h5 className="mb-2 text-2xl font-bold tracking-tight text-gray-900 dark:text-white">{project.title}</h5>
                </a>
                <p className="mb-3 font-normal text-gray-700 dark:text-gray-400">{project.description}</p>
                <a href={project.link} target="_blank" rel="noopener noreferrer" className="inline-flex items-center px-3 py-2 text-sm font-medium text-center text-white bg-blue-700 rounded-lg hover:bg-blue-800 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800">
                  View Project
                  <svg className="rtl:rotate-180 w-3.5 h-3.5 ms-2" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 10">
                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M1 5h12m0 0L9 1m4 4L9 9" />
                  </svg>
                </a>
              </div>
            </div>
          </SwiperSlide>
        ))}
        
        {/* Custom navigation elements */}
        <div className="swiper-button-next !right-0 after:!text-xl"></div>
        <div className="swiper-button-prev !left-0 after:!text-xl"></div>
        <div className="swiper-pagination !relative !bottom-0 !mt-4"></div>
      </Swiper>
    </div>
  );
};

export default Projects;
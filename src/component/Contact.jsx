import React from "react";
import { FaGithub, FaTelegram, FaInstagram, FaEnvelope, FaLinkedin } from "react-icons/fa";

const Contact = () => {
  return (
    <div className="container mx-auto lg:py-4">

      {/* Contact Form Section */}
      <section className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg mb-8">
        <div className="py-8 lg:py-16 px-4 mx-auto max-w-screen-md">
          <h2 className="mb-4 text-4xl tracking-tight font-extrabold text-center text-gray-900 dark:text-white">
            Get in Touch
          </h2>
          <p className="mb-8 lg:mb-16 font-light text-center text-gray-500 dark:text-gray-400 sm:text-xl">
            Have a project in mind? Want to collaborate? Or just want to say hello? I'd love to hear from you!
          </p>
          <form action="https://formspree.io/f/mqapzzyd" method="POST" className="space-y-8">
            <div>
              <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Your email
              </label>
              <input
                type="email"
                id="email"
                name="email"
                className="shadow-sm bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-full p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="your.email@example.com"
                required
              />
            </div>
            <div>
              <label htmlFor="subject" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-300">
                Subject
              </label>
              <input
                type="text"
                id="subject"
                name="subject"
                className="block p-3 w-full text-sm text-gray-900 bg-gray-50 rounded-lg border border-gray-300 shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="How can I help you?"
                required
              />
            </div>
            <div>
              <label htmlFor="message" className="block mb-2 text-sm font-medium text-gray-900 dark:text-gray-400">
                Your message
              </label>
              <textarea
                id="message"
                name="message"
                rows="6"
                className="block p-2.5 w-full text-sm text-gray-900 bg-gray-50 rounded-lg shadow-sm border border-gray-300 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
                placeholder="Hi [Your Name], I wanted to talk about..."
                required
              ></textarea>
            </div>
            <button
              type="submit"
              className="w-full py-3 px-5 text-sm font-medium text-center text-white rounded-lg bg-blue-800 hover:bg-blue-700 focus:ring-4 focus:outline-none focus:ring-blue-300 dark:bg-blue-600 dark:hover:bg-blue-500 dark:focus:ring-blue-800"
            >
              Send Message
            </button>
          </form>
        </div>
      </section>

      {/* Social Media Links Section */}
      <div className="bg-white dark:bg-gray-900 p-8 rounded-lg shadow-lg">
        <h2 className="mb-6 text-3xl font-bold text-gray-900 dark:text-white text-center">Let's Connect</h2>
        <div className="flex flex-wrap justify-center items-center gap-6">
          {socialLinks.map(({ href, icon, label }, index) => (
            <a
              key={index}
              href={href}
              className="flex items-center space-x-2 text-lg p-3 rounded-lg transition-all hover:bg-gray-100 dark:hover:bg-gray-800"
              target="_blank"
              rel="noopener noreferrer"
            >
              {icon}
              <span className="text-gray-700 dark:text-gray-300">{label}</span>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
};

const socialLinks = [
  {
    href: "https://github.com/kidus-amanuel",
    icon: <FaGithub className="text-2xl text-gray-900 dark:text-white" />,
    label: "GitHub",
  },
  {
    href: "https://t.me/kiik7",
    icon: <FaTelegram className="text-2xl text-[#0088CC]" />,
    label: "Telegram",
  },
  {
    href: "https://instagram.com/Kidus_a",
    icon: <FaInstagram className="text-2xl text-[#E1306C]" />,
    label: "Instagram",
  },
  {
    href: "mailto:Kidusamanuel0371@gmail.com",
    icon: <FaEnvelope className="text-2xl text-[#EA4335]" />,
    label: "Email",
  },
  {
    href: "https://linkedin.com/in/kidus-amanuel",
    icon: <FaLinkedin className="text-2xl text-[#0A66C2]" />,
    label: "LinkedIn",
  },
];

export default Contact;
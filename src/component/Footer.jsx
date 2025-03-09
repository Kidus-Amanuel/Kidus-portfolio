import Kidus from "../assets/KIDUS.jpg";

const Footer = () => {
  return (
    <footer className="bg-white dark:bg-gray-900 border-t py-2 border-gray-200p-4 sm:p-6">
      <div className="mx-auto max-w-screen-xl">
        <div className="flex flex-col items-center justify-center">
          {/* Branding */}
          <div className="flex items-center mb-4">
            <img 
              src={Kidus} 
              alt="Kidus Amanuel" 
              className="w-10 h-10 rounded-full mr-3"
            />
            <span className="text-2xl font-bold text-gray-900 dark:text-white">
              KIDUS AMANUEL
            </span>
          </div>
          {/* Social Media Icons */}
          <div className="flex space-x-6 mb-4">
            <a 
              href="https://github.com/kidus-amanuel" 
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              aria-label="GitHub"
            >
            <svg class="w-6 h-6 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
            <path fill-rule="evenodd" d="M12.006 2a9.847 9.847 0 0 0-6.484 2.44 10.32 10.32 0 0 0-3.393 6.17 10.48 10.48 0 0 0 1.317 6.955 10.045 10.045 0 0 0 5.4 4.418c.504.095.683-.223.683-.494 0-.245-.01-1.052-.014-1.908-2.78.62-3.366-1.21-3.366-1.21a2.711 2.711 0 0 0-1.11-1.5c-.907-.637.07-.621.07-.621.317.044.62.163.885.346.266.183.487.426.647.71.135.253.318.476.538.655a2.079 2.079 0 0 0 2.37.196c.045-.52.27-1.006.635-1.37-2.219-.259-4.554-1.138-4.554-5.07a4.022 4.022 0 0 1 1.031-2.75 3.77 3.77 0 0 1 .096-2.713s.839-.275 2.749 1.05a9.26 9.26 0 0 1 5.004 0c1.906-1.325 2.74-1.05 2.74-1.05.37.858.406 1.828.101 2.713a4.017 4.017 0 0 1 1.029 2.75c0 3.939-2.339 4.805-4.564 5.058a2.471 2.471 0 0 1 .679 1.897c0 1.372-.012 2.477-.012 2.814 0 .272.18.592.687.492a10.05 10.05 0 0 0 5.388-4.421 10.473 10.473 0 0 0 1.313-6.948 10.32 10.32 0 0 0-3.39-6.165A9.847 9.847 0 0 0 12.007 2Z" clip-rule="evenodd"/>
          </svg>
          
            </a>
            <a 
              href="https://linkedin.com/in/kidus-amanuel" 
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              aria-label="LinkedIn"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                {/* Replace with your LinkedIn SVG path */}
                <path d="M4.98 3.5C4.98 4.88 3.87 6 2.5 6S0 4.88 0 3.5 1.12 1 2.5 1 4.98 2.12 4.98 3.5zM.25 8.5h4.5v15H.25v-15zM8.5 8.5h4.31v2.05h.06c.6-1.13 2.07-2.33 4.26-2.33 4.55 0 5.39 3 5.39 6.92v8.36h-4.5v-7.41c0-1.77-.03-4.06-2.47-4.06-2.47 0-2.85 1.93-2.85 3.93v7.54h-4.5v-15z" />
              </svg>
            </a>
            <a 
              href="mailto:kidusamanuel0371@gmail.com" 
              className="text-gray-500 hover:text-gray-900 dark:hover:text-white"
              aria-label="Email"
            >
              <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24">
                {/* Replace with your Email SVG path */}
                <path d="M12 13.065L.02 5.25V18a2 2 0 002 2h19.96a2 2 0 002-2V5.25l-11.98 7.815zM12 11L24 3H0l12 8z" />
              </svg>
            </a>
          </div>
          {/* Copyright */}
          <p className="text-sm text-gray-500 dark:text-gray-400 text-center">
            © 2025 KIDUS AMANUEL. All Rights Reserved.
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;

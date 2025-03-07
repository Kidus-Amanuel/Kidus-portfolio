
import './App.css'

import React from 'react';
import Navbar from './component/Nav';
import AboutMe from './component/AboutMe';
import Projects from './component/Projects';
import Experience from './component/Experience';
import Contact from './component/Contact';
import Footer from './component/Footer';

const App = () => {
  return (
    <div>
    <h1> hello world</h1>
    <h1> hello world</h1>
    <h1> hello world</h1>
    <h1> hello world</h1>
    <h1> hello world</h1>
      <Navbar />
      <main>
        <AboutMe />
        <Projects />
        <Experience />
        <Contact />
      </main>
      <Footer />
    </div>
  );
};

export default App;


import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App'

createRoot(document.getElementById('root')).render(
  <StrictMode>
    <App />
  </StrictMode>,
)


<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>My Portfolio</title>
  </head>
  <body>
    <div id="root"></div> <!-- React renders here -->
  </body>
</html>

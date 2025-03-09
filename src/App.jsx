import './App.css';
import React, { useState, useEffect } from 'react';
import Home from "./page/Home";
import Navbar from './component/Nav';
import Footer from './component/Footer';
import Loading from './component/Loading'; // Import Loading component

function App() {
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadApp = async () => {
            // Simulate loading (e.g., fetching data)
            await new Promise(resolve => setTimeout(resolve, 5000));
            setLoading(false); // Set loading to false after loading is complete
        };

        loadApp();
    }, []);

    return (
        <div className="bg-white dark:bg-gray-900 w-full absolute left-0 p-4">
            {loading ? ( // Show loading spinner while loading
                <Loading />
            ) : (
                <div className='bg-white dark:bg-gray-900'>
                    <Navbar />
                    <Home />
                    <Footer />
                </div>
            )}
        </div>
    );
}

export default App;
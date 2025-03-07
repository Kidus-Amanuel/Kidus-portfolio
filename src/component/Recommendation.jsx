import React from "react";
import { Avatar, Blockquote } from "flowbite-react";
const recommendationsData = [
  {
    quote: "Kidus is a remarkable full stack developer who consistently delivers high-quality solutions. His ability to integrate both front-end and back-end technologies is impressive!",
    user: {
      Name: "Misgananw Aguate",
      School: "Senior Software Engineer",
      ProPic: "https://media.licdn.com/dms/image/v2/D4E03AQHtdAkjgUKD9Q/profile-displayphoto-shrink_100_100/profile-displayphoto-shrink_100_100/0/1706360394519?e=1746662400&v=beta&t=MgXMhhfTr3aaOSdofPPSTnF74RhMAwBH_z-dBVVpOqA",
    },
  },
  {
    quote: "Kidus has a keen eye for design and user experience. His front-end skills are top-notch, and he always brings fresh ideas to the table.",
    user: {
      Name: "Miftah Adem",
      School: "Frontend Web Developer",
      ProPic: "https://media.licdn.com/dms/image/v2/D4E35AQEniRa6mKJoMA/profile-framedphoto-shrink_100_100/profile-framedphoto-shrink_100_100/0/1660498052900?e=1741953600&v=beta&t=fk2P6NCzzx4Njg0E_qAc6vf5iNYin5qsSLWFiZ1PRwA",
    },
  },
  {
    quote: "Working with Kidus has been a great experience. His backend development skills are solid, and he is always willing to help others improve.",
    user: {
      Name: "Biniyam Asefa",
      School: "Backend Developer",
      ProPic: "https://media.licdn.com/dms/image/v2/D4D35AQF_MMbLnR1eYQ/profile-framedphoto-shrink_100_100/profile-framedphoto-shrink_100_100/0/1703701566649?e=1741953600&v=beta&t=6ueympR7aY-vjcc9dW5t4zdoz9YgMj0TuCRNpECGS1Y",
    },
  },
];

export const QuoteComponent = ({ quote }) => {
  return (
    <div className="bg-white p-6 shadow-md rounded-lg dark:bg-gray-800">
      <figure className="text-center">
        <svg
          className="mx-auto mb-3 h-10 w-10 text-gray-400 dark:text-gray-600"
          aria-hidden="true"
          xmlns="http://www.w3.org/2000/svg"
          fill="currentColor"
          viewBox="0 0 18 14"
        >
          <path d="M6 0H2a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3H2a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Zm10 0h-4a2 2 0 0 0-2 2v4a2 2 0 0 0 2 2h4v1a3 3 0 0 1-3 3h-1a1 1 0 0 0 0 2h1a5.006 5.006 0 0 0 5-5V2a2 2 0 0 0-2-2Z" />
        </svg>
        <Blockquote>
          <p className="text-lg font-medium italic text-gray-900 dark:text-white">
            "{quote.quote}"
          </p>
        </Blockquote>
        <figcaption className="mt-6 flex items-center justify-center space-x-3">
          <Avatar rounded size="sm" img={quote.user.ProPic} alt="profile picture" />
          <div className="flex items-center divide-x divide-gray-500 dark:divide-gray-700">
            <cite className="pr-3 font-medium text-gray-900 dark:text-white">{quote.user.Name}</cite>
            <cite className="pl-3 text-sm text-gray-500 dark:text-gray-400">{quote.user.School}</cite>
          </div>
        </figcaption>
      </figure>
    </div>
  );
};

const Recommendations = () => {
  // Select only the first 3 recommendations for display
  const threeRecommendations = recommendationsData.slice(0, 3);

  return (
    <section id="recommendations" className="py-12 lg:py-16">
      <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
        Recommendations
      </h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        {threeRecommendations.map((item, index) => (
          <QuoteComponent key={index} quote={item} />
        ))}
      </div>
    </section>
  );
};

export default Recommendations;

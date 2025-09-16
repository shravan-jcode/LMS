import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const HeroSection = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const navigate = useNavigate();

  const searchHandler = (e) => {
    e.preventDefault();
    if (searchQuery.trim() !== "") {
      navigate(`/course/search?query=${searchQuery}`);
    }
    setSearchQuery("");
  };

  return (
    <div className="relative bg-gradient-to-br from-gray-50 to-gray-200 dark:from-gray-950 dark:to-gray-900 py-28 md:py-32 px-6 text-center">
      <div className="relative z-10 max-w-4xl mx-auto">
        {/* Heading */}
        <h1 className="text-gray-900 dark:text-white text-4xl sm:text-5xl md:text-6xl font-extrabold leading-tight mb-6">
          Empower Your <span className="text-teal-600 dark:text-teal-400">Future</span> with Knowledge
        </h1>

        {/* Subtext */}
        <p className="text-gray-600 dark:text-gray-300 text-lg sm:text-xl mb-10 max-w-2xl mx-auto">
          Discover a world of courses designed to help you achieve your professional and personal goals.
        </p>

        {/* Search Bar */}
        <form
          onSubmit={searchHandler}
          className="flex flex-col sm:flex-row items-center bg-white/50 dark:bg-gray-800/50 rounded-full shadow-lg overflow-hidden max-w-xl sm:max-w-2xl mx-auto mb-8 border border-white dark:border-gray-700 backdrop-blur-sm"
        >
          <Input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search courses..."
            className="flex-grow w-full focus-visible:ring-2 focus-visible:ring-teal-400 px-6 py-4 text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 text-lg sm:rounded-l-full sm:rounded-t-full rounded-t-full bg-transparent border-0"
          />
          <Button
            type="submit"
            className="w-full sm:w-auto bg-teal-600 text-white px-8 py-4 rounded-b-full sm:rounded-r-full sm:rounded-b-full hover:bg-teal-700 transition-all duration-300 text-lg font-medium shadow-sm"
          >
            Search
          </Button>
        </form>

        {/* Explore Button */}
        <Button
          onClick={() => navigate(`/course/search?query`)}
          className="bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded-full px-8 py-3 text-lg font-medium shadow-sm hover:shadow-md hover:bg-gray-200 dark:hover:bg-gray-700 transition-all duration-300"
        >
          Browse All Courses
        </Button>
      </div>
    </div>
  );
};

export default HeroSection;
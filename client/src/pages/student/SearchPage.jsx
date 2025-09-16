import React, { useState } from "react";
import Filter from "./Filter";
import SearchResult from "./SearchResult";
import { Skeleton } from "@/components/ui/skeleton";
import { useGetSearchCourseQuery } from "@/features/api/courseApi";
import { Link, useSearchParams } from "react-router-dom";
import { AlertCircle } from "lucide-react";
import { Button } from "@/components/ui/button";

const SearchPage = () => {
  const [searchParams] = useSearchParams();
  const query = searchParams.get("query") || "";
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const { data, isLoading } = useGetSearchCourseQuery({
    searchQuery: query,
    categories: selectedCategories,
    sortByPrice,
  });

  const isEmpty = !isLoading && data?.courses?.length === 0;

  const handleFilterChange = (categories, price) => {
    setSelectedCategories(categories);
    setSortByPrice(price);
  };

  return (
    <div className="max-w-7xl mx-auto p-4 md:p-8">
      <div className="my-6">
        <h1 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-gray-100">
          Result for <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400 font-extrabold italic">{query || "all courses"}</span>
        </h1>
        {query && (
          <p className="text-gray-600 dark:text-gray-400">
            Showing results matching <span className="font-semibold">{query}</span>
          </p>
        )}
      </div>

      <div className="flex flex-col md:flex-row gap-8 md:gap-10">
        <Filter handleFilterChange={handleFilterChange} />
        <div className="flex-1 flex flex-col gap-4">
          {isLoading
            ? Array.from({ length: 3 }).map((_, idx) => <CourseSkeleton key={idx} />)
            : isEmpty
            ? <CourseNotFound />
            : data?.courses?.map((course) => <SearchResult key={course._id} course={course} />)}
        </div>
      </div>
    </div>
  );
};

export default SearchPage;

const CourseNotFound = () => (
  <div className="flex flex-col items-center justify-center min-h-32 bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700">
    <AlertCircle className="text-teal-600 dark:text-teal-400 h-16 w-16 mb-4 animate-pulse" />
    <h1 className="font-bold text-2xl md:text-4xl text-gray-900 dark:text-gray-100 mb-2">
      Course Not Found
    </h1>
    <p className="text-lg text-gray-700 dark:text-gray-300 mb-4">
      Sorry, we couldn't find the course you're looking for.
    </p>
    <Link to="/courses">
      <Button variant="link" className="text-teal-600 dark:text-teal-400 hover:text-teal-700 dark:hover:text-teal-300">
        Browse All Courses
      </Button>
    </Link>
  </div>
);

const CourseSkeleton = () => (
  <div className="flex flex-col md:flex-row justify-between border border-gray-200 dark:border-gray-800 p-4 rounded-lg shadow-sm bg-white dark:bg-gray-800">
    <Skeleton className="h-32 w-full md:w-56 object-cover rounded-lg bg-gray-200 dark:bg-gray-700" />
    <div className="flex flex-col gap-2 flex-1 px-0 md:px-4 mt-4 md:mt-0">
      <Skeleton className="h-6 w-full md:w-3/4 bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-4 w-1/3 bg-gray-200 dark:bg-gray-700" />
      <Skeleton className="h-6 w-20 mt-2 bg-gray-200 dark:bg-gray-700" />
    </div>
    <div className="flex-shrink-0 self-center">
      <Skeleton className="h-10 w-24 mt-4 md:mt-0 rounded-full bg-gray-200 dark:bg-gray-700" />
    </div>
  </div>
);
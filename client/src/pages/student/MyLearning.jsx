import React from "react";
import Course from "./Course";
import { useLoadUserQuery } from "@/features/api/authApi";
import { Skeleton } from "@/components/ui/skeleton";

const MyLearning = () => {
  const { data, isLoading } = useLoadUserQuery();

  const myLearning = data?.user.enrolledCourses || [];

  return (
    <div className="max-w-7xl mx-auto my-10 px-4 md:px-8">
      <h1 className="font-bold text-3xl mb-6 text-gray-900 dark:text-gray-100">
        MY LEARNING
      </h1>
      {isLoading ? (
        <MyLearningSkeleton />
      ) : myLearning.length === 0 ? (
        <p className="text-gray-600 dark:text-gray-300 text-lg">
          You are not enrolled in any course.
        </p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {myLearning.map((course) => (
            <Course key={course._id} course={course} />
          ))}
        </div>
      )}
    </div>
  );
};

export default MyLearning;

// Skeleton component for loading state
const MyLearningSkeleton = () => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
    {[...Array(4)].map((_, index) => (
      <div
        key={index}
        className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden border border-gray-200 dark:border-gray-700"
      >
        <Skeleton className="w-full h-36 bg-gray-200 dark:bg-gray-700" />
        <div className="p-4 space-y-2">
          <Skeleton className="h-5 w-3/4 bg-gray-200 dark:bg-gray-700" />
          <Skeleton className="h-4 w-1/2 bg-gray-200 dark:bg-gray-700" />
        </div>
      </div>
    ))}
  </div>
);
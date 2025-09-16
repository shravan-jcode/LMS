import { Button } from "@/components/ui/button";
import React from "react";
import { Link } from "react-router-dom";
import CourseTab from "./CourseTab";

const EditCourse = () => {
  return (
    <div className="flex-1 p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-gray-200 dark:border-gray-800 pb-4">
        <h1 className="text-2xl font-bold text-gray-900 dark:text-gray-100">
          Course Details
        </h1>
        <Link to="lecture">
          <Button
            className="bg-teal-600 text-white hover:bg-teal-700 transition-colors shadow-md dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            Go to Lectures
          </Button>
        </Link>
      </div>

      {/* Course Info Section */}
      <p className="text-gray-600 dark:text-gray-400">
        Add or edit detailed information for your course. Make sure everything looks good before publishing.
      </p>

      <CourseTab />
    </div>
  );
};

export default EditCourse;
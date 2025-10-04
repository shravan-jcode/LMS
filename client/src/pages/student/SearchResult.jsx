import { Badge } from "@/components/ui/badge";
import React from "react";
import { Link } from "react-router-dom";

const SearchResult = ({ course }) => {
  return (
    <div className="flex flex-col md:flex-row justify-between items-start md:items-center border-b border-gray-200 dark:border-slate-700 py-4 gap-4 hover:bg-gray-100 dark:hover:bg-slate-800 transition-all rounded-lg p-3 shadow-sm hover:shadow-md">
      <Link
        to={`/course-detail/${course._id}`}
        className="flex flex-col md:flex-row gap-4 w-full"
      >
        <img
          src={course.courseThumbnail}
          alt="course-thumbnail"
          className="h-32 w-full md:w-56 object-cover rounded-lg shadow-md"
        />
        <div className="flex flex-col gap-2">
          <h1 className="font-bold text-lg md:text-xl text-gray-900 dark:text-gray-100">
            {course.courseTitle}
          </h1>
          <p className="text-sm text-gray-600 dark:text-gray-400">{course.subTitle}</p>
          <p className="text-sm text-gray-700 dark:text-gray-300">
            Instructor: <span className="font-bold">{course.creator?.name}</span>
          </p>
          <Badge className="w-fit mt-2 md:mt-0 bg-blue-500/10 text-blue-700 dark:bg-blue-400/10 dark:text-blue-300 border-none">
            {course.courseLevel}
          </Badge>
        </div>
      </Link>
      <div className="mt-4 md:mt-0 md:text-right w-full md:w-auto flex-shrink-0 self-center md:self-auto">
        <h1 className="font-extrabold text-2xl bg-clip-text  bg-gradient-to-r text-teal-600 dark:text-teal-400">
          ₹{course.coursePrice}
        </h1>
      </div>
    </div>
  );
};

export default SearchResult;
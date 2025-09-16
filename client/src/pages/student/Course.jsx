import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import React from "react";
import { Link } from "react-router-dom";

const Course = ({ course }) => {
  return (
    <Link to={`/course-detail/${course._id}`}>
      <Card className="overflow-hidden rounded-lg bg-white dark:bg-gray-800 shadow-lg hover:shadow-2xl transform hover:scale-105 transition-all duration-300 border border-gray-200 dark:border-gray-700">
        {/* Course Thumbnail */}
        <div className="relative">
          <img
            src={course.courseThumbnail}
            alt={course.courseTitle}
            className="w-full h-36 object-cover rounded-t-lg"
          />
        </div>

        {/* Card Content */}
        <CardContent className="px-5 py-4 space-y-3">
          {/* Course Title */}
          <h1 className="hover:text-teal-600 dark:hover:text-teal-400 font-bold text-lg truncate text-gray-900 dark:text-gray-100 transition-colors">
            {course.courseTitle}
          </h1>

          {/* Creator info & level */}
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar className="h-8 w-8">
                <AvatarImage
                  src={course.creator?.photoUrl || "https://github.com/shadcn.png"}
                  alt={course.creator?.name || "Creator"}
                />
                <AvatarFallback>U</AvatarFallback>
              </Avatar>
              <h1 className="font-medium text-sm truncate text-gray-700 dark:text-gray-300">
                {course.creator?.name}
              </h1>
            </div>

            <Badge className="bg-teal-600 dark:bg-teal-400 text-white dark:text-gray-900 px-2 py-1 text-xs rounded-full uppercase hover:bg-teal-700 dark:hover:bg-teal-500 transition-colors">
              {course.courseLevel}
            </Badge>
          </div>

          {/* Price */}
          <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
            ₹{course.coursePrice}
          </div>
        </CardContent>
      </Card>
    </Link>
  );
};

export default Course;
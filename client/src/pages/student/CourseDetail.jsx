import BuyCourseButton from "@/components/BuyCourseButton";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { useGetCourseDetailWithStatusQuery } from "@/features/api/purchaseApi";
import { BadgeInfo, Lock, PlayCircle } from "lucide-react";
import React from "react";
import { useNavigate, useParams } from "react-router-dom";

const CourseDetail = () => {
  const { courseId } = useParams();
  const navigate = useNavigate();
  const { data, isLoading, isError } = useGetCourseDetailWithStatusQuery(courseId);

  if (isLoading)
    return (
      <h1 className="text-center mt-10 text-xl text-gray-900 dark:text-gray-100">
        Loading course details...
      </h1>
    );
  if (isError)
    return (
      <h1 className="text-center mt-10 text-xl text-red-500">
        Failed to load course details.
      </h1>
    );

  const { course, purchased } = data;
  const firstLecture = course?.lectures?.[0];

  const handleContinueCourse = () => {
    if (purchased) {
      navigate(`/course-progress/${courseId}`);
    }
  };

  return (
    <div className="space-y-8 max-w-7xl mx-auto px-4 md:px-8 py-10">
      {/* Course Header */}
      <div className="bg-gray-800 text-white rounded-lg shadow-md p-6 md:p-10 space-y-2 dark:bg-gray-950">
        <h1 className="font-bold text-2xl md:text-4xl text-teal-400 dark:text-teal-400">
          {course?.courseTitle}
        </h1>
        <p className="text-gray-300 md:text-lg">{course?.subTitle || "Course Sub-title"}</p>
        <p className="text-sm">
          Created by{" "}
          <span className="text-teal-400 underline italic">{course?.creator?.name}</span>
        </p>
        <div className="flex items-center gap-4 text-sm text-gray-400">
          <BadgeInfo size={16} />
          <p>Last updated {new Date(course?.createdAt).toLocaleDateString()}</p>
          <p>Students enrolled: {course?.enrolledStudents?.length || 0}</p>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex flex-col lg:flex-row gap-10">
        {/* Left Side: Description & Lectures */}
        <div className="w-full lg:w-2/3 space-y-6">
          {/* Course Description */}
          <Card className="shadow-lg hover:shadow-2xl transition bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="space-y-4 p-6">
              <h2 className="font-bold text-xl md:text-2xl text-gray-900 dark:text-gray-100">
                Course Description
              </h2>
              <p
                className="text-gray-700 dark:text-gray-300 text-sm md:text-base"
                dangerouslySetInnerHTML={{ __html: course?.description || "" }}
              />
            </CardContent>
          </Card>

          {/* Lectures List */}
          <Card className="shadow-lg hover:shadow-2xl transition bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardHeader>
              <CardTitle className="text-gray-900 dark:text-gray-100">Course Content</CardTitle>
              <CardDescription className="text-gray-500 dark:text-gray-400">
                {course?.lectures?.length || 0} lectures
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-3">
              {course?.lectures?.length > 0 ? (
                course.lectures.map((lecture, idx) => (
                  <div
                    key={lecture._id || idx}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition"
                  >
                    {lecture.isPreviewFree || purchased ? (
                      <PlayCircle size={18} className="text-teal-600 dark:text-teal-400" />
                    ) : (
                      <Lock size={18} className="text-gray-500 dark:text-gray-400" />
                    )}
                    <p className="text-gray-800 dark:text-gray-200 font-medium">
                      {lecture.lectureTitle}
                    </p>
                  </div>
                ))
              ) : (
                <p className="text-gray-500 dark:text-gray-400">No lectures available</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Right Side: Video & Purchase */}
        <div className="w-full lg:w-1/3 space-y-6">
          <Card className="shadow-lg hover:shadow-2xl transition bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
            <CardContent className="flex flex-col space-y-4 p-6">
              {/* Video Preview */}
              <div className="w-full aspect-video rounded-md overflow-hidden bg-black">
                {firstLecture && (firstLecture.isPreviewFree || purchased) ? (
                  <video
                    src={firstLecture.videoUrl}
                    poster={firstLecture.thumbnail || ""}
                    controls
                    className="w-full h-full object-cover rounded-md"
                  >
                    Your browser does not support the video tag.
                  </video>
                ) : (
                  <p className="text-center text-gray-500 dark:text-gray-400">
                    Preview not available
                  </p>
                )}
              </div>
              <h3 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-gray-100">
                {firstLecture?.lectureTitle || "Lecture Title"}
              </h3>

              <Separator className="bg-gray-200 dark:bg-gray-700" />

              <div className="flex flex-col space-y-2">
                <h2 className="text-lg font-semibold text-gray-900 dark:text-gray-100">Course Price</h2>
                <p className="text-2xl font-bold text-teal-600 dark:text-teal-400">
                  ₹{course?.coursePrice}
                </p>
              </div>
            </CardContent>
            <CardFooter className="flex justify-center p-4">
              {purchased ? (
                <Button
                  onClick={handleContinueCourse}
                  className="w-full rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold transition shadow-sm hover:shadow-md"
                >
                  Continue Course
                </Button>
              ) : (
                <BuyCourseButton courseId={courseId} />
              )}
            </CardFooter>
          </Card>
        </div>
      </div>
    </div>
  );
};

export default CourseDetail;

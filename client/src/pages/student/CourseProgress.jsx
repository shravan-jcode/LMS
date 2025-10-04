import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardTitle } from "@/components/ui/card";
import {
  useCompleteCourseMutation,
  useGetCourseProgressQuery,
  useInCompleteCourseMutation,
  useUpdateLectureProgressMutation,
} from "@/features/api/courseProgressApi";
import { CheckCircle2, CirclePlay } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { toast } from "sonner";

const CourseProgress = () => {
  const { courseId } = useParams();
  const { data, isLoading, isError, refetch } = useGetCourseProgressQuery(courseId);

  const [updateLectureProgress] = useUpdateLectureProgressMutation();
  const [completeCourse, { data: markCompleteData, isSuccess: completedSuccess }] =
    useCompleteCourseMutation();
  const [inCompleteCourse, { data: markInCompleteData, isSuccess: inCompletedSuccess }] =
    useInCompleteCourseMutation();

  const [currentLecture, setCurrentLecture] = useState(null);

  useEffect(() => {
    if (completedSuccess) {
      refetch();
      toast.success(markCompleteData.message);
    }
    if (inCompletedSuccess) {
      refetch();
      toast.success(markInCompleteData.message);
    }
  }, [completedSuccess, inCompletedSuccess]);

  if (isLoading)
    return (
      <p className="text-center mt-10 text-gray-800 dark:text-gray-200">
        Loading course details...
      </p>
    );
  if (isError)
    return (
      <p className="text-center mt-10 text-red-500">
        Failed to load course details
      </p>
    );

  const { courseDetails, progress, completed } = data.data;
  const { courseTitle } = courseDetails;

  const initialLecture = currentLecture || courseDetails.lectures[0];

  const isLectureCompleted = (lectureId) => {
    return progress.some((prog) => prog.lectureId === lectureId && prog.viewed);
  };

  const handleLectureProgress = async (lectureId) => {
    await updateLectureProgress({ courseId, lectureId });
    refetch();
  };

  const handleSelectLecture = (lecture) => {
    setCurrentLecture(lecture);
    handleLectureProgress(lecture._id);
  };

  const handleCompleteCourse = async () => await completeCourse(courseId);
  const handleInCompleteCourse = async () => await inCompleteCourse(courseId);

  const handleDownloadCertificate = () => {
    // Opens a new tab to download PDF
    window.open(`http://localhost:8080/api/v1/certificate/${courseId}`, "_blank");
  };

  return (
    <div className="max-w-7xl mx-auto p-4 space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-6">
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 dark:text-gray-100">
          {courseTitle}
        </h1>
        <div className="flex flex-col md:flex-row gap-3">
          {/* Mark Complete / Incomplete */}
          <Button
            onClick={completed ? handleInCompleteCourse : handleCompleteCourse}
            variant={completed ? "outline" : "default"}
            className={`rounded-full px-5 ${completed
                ? "border-teal-600 text-teal-600 dark:border-teal-400 dark:text-teal-400 hover:bg-teal-500/10"
                : "bg-teal-600 text-white hover:bg-teal-700 dark:bg-teal-400 dark:text-gray-950 dark:hover:bg-teal-500"
              } transition-colors duration-300`}
          >
            {completed ? (
              <div className="flex items-center gap-2">
                <CheckCircle2 size={18} /> Completed
              </div>
            ) : (
              "Mark as Completed"
            )}
          </Button>

          {/* Certificate Button */}
          {completed && (
            <Button
              onClick={handleDownloadCertificate}
              className="w-full rounded-full bg-teal-600 hover:bg-teal-700 text-white font-semibold"
            >
              Download Certificate
            </Button>
          )}
        </div>
      </div>

      <div className="flex flex-col md:flex-row gap-6">
        {/* Video Section */}
        <div className="flex-1 md:w-3/5 bg-white dark:bg-gray-800 shadow-lg rounded-lg p-4 border border-gray-200 dark:border-gray-700">
          <div className="w-full aspect-video mb-4">
            <video
              src={currentLecture?.videoUrl || initialLecture.videoUrl}
              controls
              className="w-full h-full rounded-lg object-cover"
              onPlay={() =>
                handleLectureProgress(currentLecture?._id || initialLecture._id)
              }
            />
          </div>
          <h2 className="text-lg md:text-xl font-medium text-gray-900 dark:text-gray-100">
            Lecture{" "}
            {courseDetails.lectures.findIndex(
              (lec) => lec._id === (currentLecture?._id || initialLecture._id)
            ) + 1}{" "}
            : {currentLecture?.lectureTitle || initialLecture.lectureTitle}
          </h2>
          {(currentLecture?.notes?.pdfUrl || initialLecture?.notes?.pdfUrl) && (
            <div className="mt-4">
              <h3 className="text-md font-semibold text-gray-800 dark:text-gray-200 mb-2">
                Lecture Notes:
              </h3>
              <div className="flex gap-3">
                <Button
                  onClick={() =>
                    window.open(
                      currentLecture?.notes?.pdfUrl || initialLecture?.notes?.pdfUrl,
                      "_blank"
                    )
                  }
                  className="bg-teal-600 hover:bg-teal-700 text-white"
                >
                  View Notes
                </Button>
                <Button
                  onClick={() => {
                    const link = document.createElement("a");
                    link.href = currentLecture?.notes?.pdfUrl || initialLecture?.notes?.pdfUrl;
                    link.download =
                      currentLecture?.notes?.fileName || initialLecture?.notes?.fileName || "notes.pdf";
                    link.click();
                  }}
                  variant="outline"
                  className="border-teal-600 text-teal-600 hover:bg-teal-50 dark:border-teal-400 dark:text-teal-400"
                >
                  Download Notes
                </Button>
              </div>
            </div>
          )}

        </div>

        {/* Lecture Sidebar */}
        <div className="w-full md:w-2/5 flex flex-col">
          <h2 className="font-semibold text-xl mb-4 text-gray-900 dark:text-gray-100">
            Course Lectures
          </h2>
          <div className="flex-1 overflow-y-auto space-y-3 max-h-[70vh]">
            {courseDetails.lectures.map((lecture) => (
              <Card
                key={lecture._id}
                onClick={() => handleSelectLecture(lecture)}
                className={`cursor-pointer transition transform border border-gray-200 dark:border-gray-700
                ${lecture._id === currentLecture?._id
                    ? "bg-gray-200 dark:bg-gray-700 border-teal-600 dark:border-teal-400 ring-2 ring-teal-600 dark:ring-teal-400"
                    : "bg-white dark:bg-gray-800 hover:bg-gray-100 dark:hover:bg-gray-700"
                  }`}
              >
                <CardContent className="flex justify-between items-center p-4">
                  <div className="flex items-center gap-3">
                    {isLectureCompleted(lecture._id) ? (
                      <CheckCircle2
                        size={24}
                        className="text-teal-600 dark:text-teal-400"
                      />
                    ) : (
                      <CirclePlay
                        size={24}
                        className="text-gray-500 dark:text-gray-400"
                      />
                    )}
                    <CardTitle className="text-md md:text-lg font-medium text-gray-800 dark:text-gray-200">
                      {lecture.lectureTitle}
                    </CardTitle>
                  </div>
                  {isLectureCompleted(lecture._id) && (
                    <Badge className="bg-green-500/20 text-green-700 dark:bg-green-500/10 dark:text-green-400">
                      Completed
                    </Badge>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseProgress;

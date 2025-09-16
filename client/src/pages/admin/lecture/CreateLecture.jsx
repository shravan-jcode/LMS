import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  useCreateLectureMutation,
  useGetCourseLectureQuery,
} from "@/features/api/courseApi";
import { Loader2, BookOpen } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { toast } from "sonner";
import Lecture from "./Lecture";

const CreateLecture = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const params = useParams();
  const courseId = params.courseId;
  const navigate = useNavigate();

  const [createLecture, { data, isLoading, isSuccess, error }] =
    useCreateLectureMutation();

  const {
    data: lectureData,
    isLoading: lectureLoading,
    isError: lectureError,
    refetch,
  } = useGetCourseLectureQuery(courseId);

  const createLectureHandler = async () => {
    await createLecture({ lectureTitle, courseId });
  };

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success(data?.message);
      setLectureTitle(""); // reset input after success
    }
    if (error) {
      toast.error(error?.data?.message);
    }
  }, [isSuccess, error, data, refetch]);

  return (
    <div className="flex-1 px-6 sm:px-10 py-6 bg-gray-50 dark:bg-gray-900 rounded-lg shadow-md">
      {/* Header */}
      <div className="mb-6">
        <h1 className="font-extrabold text-2xl text-teal-600 dark:text-teal-400 flex items-center gap-2">
          <BookOpen className="h-6 w-6" />
          Create a New Lecture
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400 mt-1">
          Add some basic details to get started with your lecture.
        </p>
      </div>

      {/* Form */}
      <div className="space-y-4 bg-white dark:bg-gray-800 p-5 rounded-xl shadow-sm border border-gray-200 dark:border-gray-700">
        <div className="space-y-2">
          <Label className="text-gray-900 dark:text-gray-200">Title</Label>
          <Input
            type="text"
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            placeholder="Enter lecture title..."
            className="dark:bg-gray-700 dark:text-gray-200 focus-visible:ring-2 focus-visible:ring-teal-500"
          />
        </div>

        {/* Buttons */}
        <div className="flex items-center gap-3">
          <Button
            variant="outline"
            onClick={() => navigate(`/admin/course/${courseId}`)}
            className="border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 text-gray-800 dark:text-gray-200"
          >
            Back to course
          </Button>
          <Button
            disabled={isLoading}
            onClick={createLectureHandler}
            className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600"
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create lecture"
            )}
          </Button>
        </div>
      </div>

      {/* Lectures List */}
      <div className="mt-10">
        <h2 className="font-semibold text-lg mb-4 text-gray-900 dark:text-gray-100">
          Lecture List
        </h2>
        {lectureLoading ? (
          <div className="flex items-center gap-2 text-gray-500 dark:text-gray-400">
            <Loader2 className="h-4 w-4 animate-spin" />
            <p>Loading lectures...</p>
          </div>
        ) : lectureError ? (
          <p className="text-red-500 dark:text-red-400">Failed to load lectures.</p>
        ) : lectureData.lectures.length === 0 ? (
          <p className="text-gray-500 dark:text-gray-400">
            No lectures available.
          </p>
        ) : (
          <div className="grid gap-4">
            {lectureData.lectures.map((lecture, index) => (
              <Lecture
                key={lecture._id}
                lecture={lecture}
                courseId={courseId}
                index={index}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default CreateLecture;
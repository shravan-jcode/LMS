import React, { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useCreateCourseMutation } from "@/features/api/courseApi";
import { Loader2 } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { toast } from "sonner";

const AddCourse = () => {
  const [courseTitle, setCourseTitle] = useState("");
  const [category, setCategory] = useState("");

  const [createCourse, { data, isLoading, error, isSuccess }] =
    useCreateCourseMutation();

  const navigate = useNavigate();

  const getSelectedCategory = (value) => {
    setCategory(value);
  };

  const createCourseHandler = async () => {
    // Basic client-side validation
    if (!courseTitle || !category) {
      toast.error("Please fill in both the course title and category.");
      return;
    }
    await createCourse({ courseTitle, category });
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Course created successfully!");
      navigate("/admin/course");
    }
    // Handle API errors
    if (error) {
      toast.error(error?.data?.message || "Failed to create course.");
    }
  }, [isSuccess, error, navigate, data]);

  return (
    <div className="flex-1 max-w-2xl mx-auto px-6 py-10">
      {/* Heading Section */}
      <div className="mb-8 text-center md:text-left">
        <h1 className="font-extrabold text-2xl md:text-3xl text-gray-900 dark:text-gray-100">
          Add a New Course
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-sm mt-2">
          Provide the basic details to create your course.
        </p>
      </div>

      {/* Form Section */}
      <div className="space-y-6 bg-white dark:bg-gray-800 rounded-xl shadow-lg p-6 border border-gray-200 dark:border-gray-700">
        {/* Course Title */}
        <div>
          <Label htmlFor="courseTitle" className="text-gray-800 dark:text-gray-200 font-medium">Course Title</Label>
          <Input
            id="courseTitle"
            type="text"
            value={courseTitle}
            onChange={(e) => setCourseTitle(e.target.value)}
            placeholder="e.g., Advanced React Mastery"
            className="mt-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus-visible:ring-teal-500"
          />
        </div>

        {/* Category */}
        <div>
          <Label htmlFor="category" className="text-gray-800 dark:text-gray-200 font-medium">Category</Label>
          <Select onValueChange={getSelectedCategory} value={category}>
            <SelectTrigger id="category" className="w-full mt-2 bg-gray-50 dark:bg-gray-700 border border-gray-300 dark:border-gray-600 focus-visible:ring-teal-500">
              <SelectValue placeholder="Select a category" />
            </SelectTrigger>
            <SelectContent className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700">
              <SelectGroup>
                <SelectLabel className="text-gray-500 dark:text-gray-400">Category</SelectLabel>
                <SelectItem value="Next JS" className="hover:bg-gray-100 dark:hover:bg-gray-700">Next JS</SelectItem>
                <SelectItem value="Data Science" className="hover:bg-gray-100 dark:hover:bg-gray-700">Data Science</SelectItem>
                <SelectItem value="Frontend Development" className="hover:bg-gray-100 dark:hover:bg-gray-700">Frontend Development</SelectItem>
                <SelectItem value="Fullstack Development" className="hover:bg-gray-100 dark:hover:bg-gray-700">Fullstack Development</SelectItem>
                <SelectItem value="MERN Stack Development" className="hover:bg-gray-100 dark:hover:bg-gray-700">MERN Stack Development</SelectItem>
                <SelectItem value="Javascript" className="hover:bg-gray-100 dark:hover:bg-gray-700">Javascript</SelectItem>
                <SelectItem value="Python" className="hover:bg-gray-100 dark:hover:bg-gray-700">Python</SelectItem>
                <SelectItem value="Docker" className="hover:bg-gray-100 dark:hover:bg-gray-700">Docker</SelectItem>
                <SelectItem value="MongoDB" className="hover:bg-gray-100 dark:hover:bg-gray-700">MongoDB</SelectItem>
                <SelectItem value="HTML" className="hover:bg-gray-100 dark:hover:bg-gray-700">HTML</SelectItem>
              </SelectGroup>
            </SelectContent>
          </Select>
        </div>

        {/* Action Buttons */}
        <div className="flex items-center justify-end gap-3 pt-4">
          <Button
            variant="outline"
            className="px-6 border-gray-300 dark:border-gray-600 hover:bg-gray-100 dark:hover:bg-gray-700 transition-colors text-gray-800 dark:text-gray-200"
            onClick={() => navigate("/admin/course")}
          >
            Back
          </Button>
          <Button
            disabled={isLoading || !courseTitle || !category}
            onClick={createCourseHandler}
            className="
              px-6 bg-teal-600 text-white font-semibold shadow-sm 
              hover:bg-teal-700 transition-colors
              disabled:opacity-50 disabled:cursor-not-allowed
              dark:bg-teal-400 dark:text-gray-900 dark:hover:bg-teal-500
            "
          >
            {isLoading ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Please wait
              </>
            ) : (
              "Create Course"
            )}
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AddCourse;
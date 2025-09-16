import { Button } from "@/components/ui/button";
import { ArrowLeft, Pencil } from "lucide-react";
import React from "react";
import { Link, useParams } from "react-router-dom";
import LectureTab from "./LectureTab";

const EditLecture = () => {
  const params = useParams();
  const courseId = params.courseId;

  return (
    <div className="flex-1 px-6 sm:px-10 py-6 bg-gradient-to-b from-blue-50 to-white dark:from-slate-900 dark:to-slate-950 rounded-lg shadow-md">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <Link to={`/admin/course/${courseId}/lecture`}>
            <Button
              size="icon"
              variant="outline"
              className="rounded-full hover:bg-blue-100 dark:hover:bg-slate-700 transition"
            >
              <ArrowLeft size={18} />
            </Button>
          </Link>
          <h1 className="font-extrabold text-2xl text-blue-900 dark:text-blue-400 flex items-center gap-2">
            <Pencil className="h-5 w-5" />
            Update Lecture
          </h1>
        </div>
      </div>

      {/* Lecture Tab */}
      <div className="bg-white dark:bg-slate-800 rounded-xl shadow p-5">
        <LectureTab />
      </div>
    </div>
  );
};

export default EditLecture;

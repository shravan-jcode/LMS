import { Edit } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const Lecture = ({ lecture, courseId, index }) => {
  const navigate = useNavigate();
  const goToUpdateLecture = () => {
    navigate(`${lecture._id}`);
  };

  return (
    <div
      onClick={goToUpdateLecture}
      className="flex items-center justify-between px-5 py-3 rounded-lg border border-gray-200 dark:border-gray-700 
                 bg-white dark:bg-gray-800 shadow-sm hover:shadow-md transition cursor-pointer my-3 group"
    >
      <h1 className="font-semibold text-gray-900 dark:text-gray-100 text-sm sm:text-base">
        Lecture {index + 1}: {lecture.lectureTitle}
      </h1>
      <Edit
        size={20}
        className="text-gray-500 dark:text-gray-400 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition"
      />
    </div>
  );
};

export default Lecture;
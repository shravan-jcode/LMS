import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { useGetCreatorCourseQuery } from "@/features/api/courseApi";
import { Edit, PlusCircle, Loader2 } from "lucide-react";
import React from "react";
import { useNavigate } from "react-router-dom";

const CourseTable = () => {
  const { data, isLoading } = useGetCreatorCourseQuery();
  const navigate = useNavigate();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-full">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-teal-600 dark:text-teal-400" />
        <h1 className="text-lg font-semibold text-gray-800 dark:text-gray-200">
          Loading courses...
        </h1>
      </div>
    );
  }

  return (
    <div className="p-6 space-y-6">
      {/* Header Section */}
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold tracking-tight text-gray-900 dark:text-gray-100">
          Your Courses
        </h2>
        <Button
          onClick={() => navigate(`create`)}
          className="flex items-center gap-2 bg-teal-600 dark:bg-teal-500 text-white dark:text-gray-900 shadow-md hover:bg-teal-700 dark:hover:bg-teal-600 transition-all"
        >
          <PlusCircle size={18} />
          Create Course
        </Button>
      </div>

      {/* Table Section */}
      <div className="rounded-lg border border-gray-200 dark:border-gray-800 shadow-md overflow-hidden bg-white dark:bg-gray-900">
        {data?.courses?.length === 0 ? (
          <p className="p-6 text-center text-gray-600 dark:text-gray-400">
            You haven't created any courses yet.
          </p>
        ) : (
          <Table>
            <TableCaption className="text-gray-600 dark:text-gray-400">
              A list of your courses, including status and price.
            </TableCaption>
            <TableHeader className="bg-gray-100 dark:bg-gray-800">
              <TableRow>
                <TableHead className="text-gray-700 dark:text-gray-300">
                  Title
                </TableHead>
                <TableHead className="w-[120px] text-gray-700 dark:text-gray-300">
                  Price (₹)
                </TableHead>
                <TableHead className="text-gray-700 dark:text-gray-300">
                  Status
                </TableHead>
                <TableHead className="text-right text-gray-700 dark:text-gray-300">
                  Action
                </TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {data?.courses?.map((course) => (
                <TableRow
                  key={course._id}
                  className="border-b border-gray-200 dark:border-gray-800 hover:bg-gray-50 dark:hover:bg-gray-800/50 transition-colors"
                >
                  <TableCell className="font-medium text-gray-900 dark:text-gray-100">
                    {course.courseTitle}
                  </TableCell>
                  <TableCell className="text-gray-900 dark:text-gray-100">
                    {course?.coursePrice || "NA"}
                  </TableCell>
                  <TableCell>
                    <Badge
                      className={
                        course.isPublished
                          ? "bg-green-500/20 text-green-700 dark:text-green-300"
                          : "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
                      }
                    >
                      {course.isPublished ? "Published" : "Draft"}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right flex gap-2 justify-end">
                    {/* Edit Course Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() => navigate(`${course._id}`)}
                      className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      <Edit className="w-4 h-4 text-teal-600 dark:text-teal-400" />
                    </Button>

                    {/* Enrolled Users Button */}
                    <Button
                      size="sm"
                      variant="ghost"
                      onClick={() =>
                        navigate(`/admin/course/${course._id}/enrolled-users`)
                      }
                      className="hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
                    >
                      Enrolled Users
                    </Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        )}
      </div>
    </div>
  );
};

export default CourseTable;

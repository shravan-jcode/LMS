import React, { useState } from "react";
import { useParams } from "react-router-dom";
import { useGetEnrolledUsersQuery, useRemoveUserFromCourseMutation } from "@/features/api/courseApi";
import { Loader2, Trash2, Search, Users, Calendar } from "lucide-react";

const EnrolledUsers = () => {
    const { courseId } = useParams();
    const [search, setSearch] = useState("");
    const [sort, setSort] = useState("name");

    const { data, isLoading, isError, refetch } = useGetEnrolledUsersQuery({ courseId, search, sort });
    const [removeUserFromCourse] = useRemoveUserFromCourseMutation();

    if (isLoading) return (
        <div className="flex justify-center items-center h-screen bg-gray-50 dark:bg-gray-900">
            <Loader2 className="animate-spin w-6 h-6 mr-2 text-teal-600 dark:text-teal-400" />
            <span className="text-lg text-gray-700 dark:text-gray-300">Loading enrolled users...</span>
        </div>
    );

    if (isError) return <p className="p-4 text-red-600 bg-red-50 dark:bg-red-900/30 border border-red-200 dark:border-red-700 rounded-lg mx-auto max-w-4xl mt-10">Failed to load enrolled users. Please try again.</p>;

    const handleRemove = async (userId) => {
        if (window.confirm("Are you sure you want to remove this user from the course? This action cannot be undone.")) {
            await removeUserFromCourse({ courseId, userId });
            refetch();
        }
    };

    const enrolledUsers = data?.enrolledUsers || [];
    const courseName = data?.course?.courseTitle || "Course Name";


    return (
        <div className="p-4 md:p-8 bg-gray-50 dark:bg-gray-900 min-h-screen text-gray-900 dark:text-gray-100">

            {/* Header with Course Name */}
            <div className="mb-6">
                <h1 className="text-3xl font-extrabold flex items-center gap-2">
                    <Users className="w-7 h-7 text-teal-600 dark:text-teal-400" />
                    {courseName}
                </h1>
                <p className="text-gray-600 dark:text-gray-400 mt-1">
                    Manage and review all users currently enrolled in this course.
                </p>
            </div>

            {/* Filter and Sort Controls */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8 p-4 bg-white dark:bg-gray-800 rounded-lg shadow-md border border-gray-200 dark:border-gray-700">

                {/* Search Input */}
                <div className="relative w-full md:w-2/3">
                    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-400 dark:text-gray-500" />
                    <input
                        type="text"
                        placeholder="Search by user name or email..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-full p-2 pl-10 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all text-sm dark:placeholder-gray-400"
                    />
                </div>

                {/* Sort Select */}
                <select
                    value={sort}
                    onChange={(e) => setSort(e.target.value)}
                    className="w-full md:w-1/3 p-2 border border-gray-300 dark:border-gray-600 bg-gray-50 dark:bg-gray-700 rounded-lg focus:ring-2 focus:ring-teal-500 focus:border-teal-500 appearance-none cursor-pointer transition-all text-sm"
                >
                    <option value="name">Sort by Name</option>
                    <option value="recent">Sort by Newest</option>
                </select>
            </div>

            {/* Empty State */}
            {enrolledUsers.length === 0 && !isLoading && (
                <div className="text-center p-10 bg-white dark:bg-gray-800 rounded-lg shadow-md">
                    <Users className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                    <p className="text-lg font-medium text-gray-600 dark:text-gray-400">No users are currently enrolled in this course.</p>
                </div>
            )}

            {/* Enrolled Users Table */}
            {enrolledUsers.length > 0 && (
                <div className="overflow-x-auto shadow-xl rounded-xl border border-gray-200 dark:border-gray-700">
                    <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                        <thead className="bg-teal-600 dark:bg-teal-700 text-white sticky top-0">
                            <tr>
                                <th scope="col" className="p-4 text-left text-xs font-semibold uppercase tracking-wider">User Name</th>
                                <th scope="col" className="p-4 text-left text-xs font-semibold uppercase tracking-wider hidden sm:table-cell">Email</th>
                                <th scope="col" className="p-4 text-left text-xs font-semibold uppercase tracking-wider hidden md:table-cell">Purchased At</th>
                                <th scope="col" className="p-4 text-center text-xs font-semibold uppercase tracking-wider">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white dark:bg-gray-800 divide-y divide-gray-200 dark:divide-gray-700">
                            {enrolledUsers.map((user) => (
                                <tr key={user._id} className="hover:bg-gray-50 dark:hover:bg-gray-700/50 transition duration-150">
                                    <td className="p-4 whitespace-nowrap font-medium text-sm">{user.name}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden sm:table-cell">{user.email}</td>
                                    <td className="p-4 whitespace-nowrap text-sm text-gray-500 dark:text-gray-400 hidden md:table-cell flex items-center">
                                        <Calendar className="w-3.5 h-3.5 mr-1.5" />
                                        {new Date(user.createdAt).toLocaleDateString()}
                                    </td>
                                    <td className="p-4 whitespace-nowrap text-center">
                                        <button
                                            onClick={() => handleRemove(user._id)}
                                            className="flex items-center justify-center mx-auto gap-1.5 px-3 py-1 text-sm font-medium text-red-700 bg-red-100 rounded-full hover:bg-red-200 dark:bg-red-900/30 dark:text-red-400 dark:hover:bg-red-900 transition-colors duration-200"
                                        >
                                            <Trash2 size={14} />
                                            <span className="hidden sm:inline">Remove</span>
                                        </button>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default EnrolledUsers;

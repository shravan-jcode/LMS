// Dashboard Component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from "recharts";
import { Loader2 } from "lucide-react";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-lg font-semibold text-gray-800 dark:text-gray-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-teal-600 dark:text-teal-400" />
        Loading...
      </div>
    );
  }
  if (isError)
    return (
      <div className="flex justify-center items-center h-full text-red-500 text-lg font-semibold dark:text-red-400">
        Failed to get purchased course
      </div>
    );

  const { purchasedCourse } = data || [];

  const courseData = purchasedCourse.map((course) => ({
    name: course.courseId?.courseTitle,
    price: course.courseId?.coursePrice,
  }));

  const totalRevenue = purchasedCourse.reduce(
    (acc, element) => acc + (element.amount || 0),
    0
  );

  const totalSales = purchasedCourse.length;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Sales */}
      <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-200 text-lg">
            Total Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">
            {totalSales}
          </p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-200 text-lg">
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">
            ₹{totalRevenue}
          </p>
        </CardContent>
      </Card>

      {/* Course Prices */}
      <Card className="shadow-lg hover:shadow-2xl transition-all duration-300 col-span-1 sm:col-span-2 lg:col-span-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Course Prices
          </CardTitle>
        </CardHeader>
        <CardContent>
          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={courseData}>
              <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" className="dark:stroke-gray-700" />
              <XAxis
                dataKey="name"
                stroke="#374151"
                className="dark:stroke-gray-300"
                angle={-30}
                textAnchor="end"
                interval={0}
              />
              <YAxis stroke="#374151" className="dark:stroke-gray-300" />
              <Tooltip
                formatter={(value, name) => [`₹${value}`, name]}
                contentStyle={{
                  backgroundColor: "#ffffff",
                  borderRadius: "8px",
                  border: "1px solid #e5e7eb",
                }}
                wrapperStyle={{ color: "#111827" }}
              />
              <Line
                type="monotone"
                dataKey="price"
                stroke="#0d9488" // Teal-600
                strokeWidth={3}
                dot={{ stroke: "#0f766e", strokeWidth: 2 }} // Darker teal for dot
                activeDot={{ r: 6, fill: "#0f766e" }}
              />
            </LineChart>
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
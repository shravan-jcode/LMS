// Dashboard Component
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
import React, { useState } from "react";
import {
  BarChart,
  Bar,
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from "recharts";
import { Loader2 } from "lucide-react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

const Dashboard = () => {
  const { data, isSuccess, isError, isLoading } = useGetPurchasedCoursesQuery();
  const [chartType, setChartType] = useState("bar"); // bar | line

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-lg font-semibold text-gray-800 dark:text-gray-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-teal-600 dark:text-teal-400" />
        Loading...
      </div>
    );
  }

  if (isError) {
    return (
      <div className="flex justify-center items-center h-full text-red-500 text-lg font-semibold dark:text-red-400">
        Failed to get purchased courses
      </div>
    );
  }

  const { purchasedCourse } = data || [];

  // Group by course
  const courseStats = purchasedCourse.reduce((acc, purchase) => {
    const courseId = purchase.courseId?._id;
    const title = purchase.courseId?.courseTitle || "Unknown Course";
    const price = purchase.courseId?.coursePrice || 0;

    if (!acc[courseId]) {
      acc[courseId] = {
        name: title,
        price,
        sales: 0,
        revenue: 0,
      };
    }

    acc[courseId].sales += 1;
    acc[courseId].revenue += purchase.amount || 0;

    return acc;
  }, {});

  const chartData = Object.values(courseStats);

  const totalRevenue = purchasedCourse.reduce(
    (acc, element) => acc + (element.amount || 0),
    0
  );
  const totalSales = purchasedCourse.length;
  const uniqueCourses = Object.keys(courseStats).length;

  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">
      {/* Total Sales */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-200 text-lg">
            Total Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">
            {totalSales}
          </p>
        </CardContent>
      </Card>

      {/* Total Revenue */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
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

      {/* Unique Courses */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-200 text-lg">
            Courses Sold
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-yellow-600 dark:text-yellow-400">
            {uniqueCourses}
          </p>
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card className="shadow-lg col-span-1 sm:col-span-2 lg:col-span-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Course Insights
          </CardTitle>

          {/* Chart Type Selector */}
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Select Chart" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="bar">Bar Chart</SelectItem>
              <SelectItem value="line">Line Chart</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={350}>
            {chartType === "bar" ? (
              <BarChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis
                  dataKey="name"
                  stroke="#374151"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#374151" />
                <Tooltip
                  formatter={(value, name) =>
                    name === "sales" ? [`${value} sales`] : [`₹${value}`]
                  }
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend />
                <Bar dataKey="sales" fill="#0891b2" name="Sales" />
                <Bar dataKey="revenue" fill="#0f766e" name="Revenue" />
              </BarChart>
            ) : (
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#cbd5e1" />
                <XAxis
                  dataKey="name"
                  stroke="#374151"
                  interval={0}
                  angle={-20}
                  textAnchor="end"
                />
                <YAxis stroke="#374151" />
                <Tooltip
                  formatter={(value, name) =>
                    name === "sales" ? [`${value} sales`] : [`₹${value}`]
                  }
                  contentStyle={{
                    backgroundColor: "#ffffff",
                    borderRadius: "8px",
                    border: "1px solid #e5e7eb",
                  }}
                />
                <Legend />
                <Line
                  type="monotone"
                  dataKey="sales"
                  stroke="#0891b2"
                  strokeWidth={3}
                  name="Sales"
                />
                <Line
                  type="monotone"
                  dataKey="revenue"
                  stroke="#0f766e"
                  strokeWidth={3}
                  name="Revenue"
                />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;
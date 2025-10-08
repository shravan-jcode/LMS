// Dashboard Component
import React, { useState, useMemo } from "react";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useGetPurchasedCoursesQuery } from "@/features/api/purchaseApi";
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
  ComposedChart,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import {
  Loader2,
  DollarSign,
  LineChart as LineChartIcon,
  BookOpen,
  Tag,
} from "lucide-react";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

// Custom color palette for Pie Chart
const COLORS = [
  "#0f766e",
  "#0e7490",
  "#fbbf24",
  "#7c3aed",
  "#ef4444",
  "#10b981",
  "#f97316",
  "#6366f1",
];

// Hook to process chart data
const useProcessedChartData = (purchasedCourse) => {
  return useMemo(() => {
    if (!purchasedCourse || purchasedCourse.length === 0) return [];

    const courseStats = purchasedCourse.reduce((acc, purchase) => {
      const courseId = purchase.courseId?._id;
      const title = purchase.courseId?.courseTitle || `Course ID: ${courseId}`;

      if (!acc[courseId]) {
        acc[courseId] = { name: title, sales: 0, revenue: 0 };
      }

      acc[courseId].sales += 1;
      acc[courseId].revenue += purchase.amount || 0;

      return acc;
    }, {});

    return Object.values(courseStats).sort((a, b) => b.sales - a.sales);
  }, [purchasedCourse]);
};

const Dashboard = () => {
  const { data, isLoading, isError } = useGetPurchasedCoursesQuery();
  const [chartType, setChartType] = useState("combined"); // bar | line | combined | pie

  // Always call hooks unconditionally
  const purchasedCourse = data?.purchasedCourse || [];
  const chartData = useProcessedChartData(purchasedCourse);
  const totalRevenue = purchasedCourse.reduce((acc, e) => acc + (e.amount || 0), 0);
  const totalSales = purchasedCourse.length;
  const uniqueCourses = chartData.length;

  // Custom XAxis Tick for better label rotation
  const CustomXAxisTick = ({ x, y, payload }) => {
    const value = payload.value;
    const truncated = value.length > 20 ? `${value.substring(0, 17)}...` : value;
    return (
      <g transform={`translate(${x},${y})`}>
        <text
          x={0}
          y={0}
          dy={16}
          textAnchor="end"
          fill="#6b7280"
          transform="rotate(-45)"
          fontSize={12}
        >
          {truncated}
        </text>
      </g>
    );
  };

  // Tooltip formatter
  const tooltipFormatter = (value, name, props) => {
    if (name === "Sales" || name === "Sales Trend") return [`${value} sales`, name];
    if (name === "Revenue" || props.dataKey === "revenue") return [`₹${value.toLocaleString()}`, name];
    return [value, name];
  };

  // Pie Chart Label
  const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent }) => {
    if (percent <= 0.05) return null;
    const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
    const x = cx + radius * Math.cos(-midAngle * Math.PI / 180);
    const y = cy + radius * Math.sin(-midAngle * Math.PI / 180);
    return (
      <text x={x} y={y} fill="white" textAnchor={x > cx ? "start" : "end"} dominantBaseline="central" fontSize={12} fontWeight="bold">
        {`${(percent * 100).toFixed(0)}%`}
      </text>
    );
  };

  // Pie Chart Tooltip
  const CustomPieTooltip = ({ active, payload }) => {
    if (active && payload && payload.length) {
      const data = payload[0].payload;
      const contribution = totalRevenue > 0 ? ((data.revenue / totalRevenue) * 100).toFixed(1) : 0;
      return (
        <div className="bg-white p-3 border border-gray-200 rounded-lg shadow-md text-sm">
          <p className="font-bold text-gray-700">{data.name}</p>
          <p className="text-teal-600">Revenue: <span className="font-semibold">₹{data.revenue.toLocaleString()}</span></p>
          <p className="text-cyan-600">Sales: <span className="font-semibold">{data.sales}</span></p>
          <p className="text-gray-500">Contribution: <span className="font-semibold">{contribution}%</span></p>
        </div>
      );
    }
    return null;
  };

  // --- Loading / Error States ---
  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-full text-lg font-semibold text-gray-800 dark:text-gray-200">
        <Loader2 className="mr-2 h-6 w-6 animate-spin text-teal-600 dark:text-teal-400" />
        Loading...
      </div>
    );
  }

  if (isError || purchasedCourse.length === 0) {
    return (
      <div className="flex justify-center items-center h-full text-red-500 text-lg font-semibold dark:text-red-400">
        Failed to get purchased courses or no data available.
      </div>
    );
  }

  // --- Dashboard JSX ---
  return (
    <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4">

      {/* Cards */}
      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-200 text-lg flex items-center">
            <LineChartIcon className="mr-2 h-5 w-5 text-cyan-600" />
            Total Sales
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-cyan-600 dark:text-cyan-400">{totalSales}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-200 text-lg flex items-center">
            <DollarSign className="mr-2 h-5 w-5 text-teal-600" />
            Total Revenue
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-teal-600 dark:text-teal-400">₹{totalRevenue.toLocaleString()}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-200 text-lg flex items-center">
            <BookOpen className="mr-2 h-5 w-5 text-yellow-600" />
            Courses Sold
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-yellow-600 dark:text-yellow-400">{uniqueCourses}</p>
        </CardContent>
      </Card>

      <Card className="shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader>
          <CardTitle className="text-gray-700 dark:text-gray-200 text-lg flex items-center">
            <Tag className="mr-2 h-5 w-5 text-indigo-600" />
            Avg. Revenue/Sale
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-4xl font-extrabold text-indigo-600 dark:text-indigo-400">
            ₹{totalSales > 0 ? (totalRevenue / totalSales).toFixed(2) : 0}
          </p>
        </CardContent>
      </Card>

      {/* Chart Section */}
      <Card className="shadow-lg col-span-1 sm:col-span-2 lg:col-span-4 border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
        <CardHeader className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
          <CardTitle className="text-xl font-semibold text-gray-700 dark:text-gray-200">
            Course Performance Insights
          </CardTitle>

          {/* Chart Type Selector */}
          <Select value={chartType} onValueChange={setChartType}>
            <SelectTrigger className="w-48 mt-2 sm:mt-0">
              <SelectValue placeholder="Select Chart View" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="combined">Bar + Trend Line</SelectItem>
              <SelectItem value="pie">Revenue Distribution (Pie)</SelectItem>
              <SelectItem value="bar">Sales/Revenue Bars</SelectItem>
              <SelectItem value="line">Sales/Revenue Lines</SelectItem>
            </SelectContent>
          </Select>
        </CardHeader>

        <CardContent>
          <ResponsiveContainer width="100%" height={chartType === "pie" ? 400 : 500}>
            {chartType === "combined" ? (
              <ComposedChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" height={90} tick={<CustomXAxisTick />} interval={0} />
                <YAxis yAxisId="sales" orientation="left" stroke="#0891b2" tickFormatter={(v) => `${v} sales`} />
                <YAxis yAxisId="revenue" orientation="right" stroke="#0f766e" tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}k`} />
                <Tooltip formatter={tooltipFormatter} contentStyle={{ backgroundColor: "#fff", borderRadius: "8px", border: "1px solid #e5e7eb" }} />
                <Legend iconType="square" verticalAlign="top" height={36} />
                <Bar yAxisId="revenue" dataKey="revenue" fill="#0f766e" barSize={25} />
                <Bar yAxisId="sales" dataKey="sales" fill="#0891b2" barSize={25} opacity={0.8} />
                <Line yAxisId="sales" type="monotone" dataKey="sales" stroke="#ef4444" strokeWidth={3} dot={{ r: 4 }} activeDot={{ r: 8 }} name="Sales Trend" />
              </ComposedChart>
            ) : chartType === "pie" ? (
              <PieChart>
                <Pie data={chartData} dataKey="revenue" nameKey="name" cx="50%" cy="50%" outerRadius={150} fill="#8884d8" labelLine={false} label={renderCustomizedLabel}>
                  {chartData.map((entry, index) => <Cell key={index} fill={COLORS[index % COLORS.length]} />)}
                </Pie>
                <Tooltip content={<CustomPieTooltip />} />
                <Legend layout="vertical" verticalAlign="middle" align="right" wrapperStyle={{ paddingLeft: "20px" }} />
              </PieChart>
            ) : chartType === "bar" ? (
              <BarChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" height={90} tick={<CustomXAxisTick />} interval={0} />
                <YAxis />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Bar dataKey="sales" fill="#0891b2" />
                <Bar dataKey="revenue" fill="#0f766e" />
              </BarChart>
            ) : (
              <LineChart data={chartData} margin={{ top: 20, right: 30, left: 20, bottom: 90 }}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                <XAxis dataKey="name" height={90} tick={<CustomXAxisTick />} interval={0} />
                <YAxis />
                <Tooltip formatter={tooltipFormatter} />
                <Legend />
                <Line type="monotone" dataKey="sales" stroke="#0891b2" strokeWidth={3} />
                <Line type="monotone" dataKey="revenue" stroke="#0f766e" strokeWidth={3} />
              </LineChart>
            )}
          </ResponsiveContainer>
        </CardContent>
      </Card>
    </div>
  );
};

export default Dashboard;

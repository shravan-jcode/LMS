import { Checkbox } from "@/components/ui/checkbox";
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
import { Separator } from "@/components/ui/separator";
import React, { useState } from "react";

const categories = [
  { id: "nextjs", label: "Next JS" },
  { id: "data-science", label: "Data Science" },
  { id: "frontend-development", label: "Frontend Development" },
  { id: "fullstack-development", label: "Fullstack Development" },
  { id: "mern-stack-development", label: "MERN Stack Development" },
  { id: "backend-development", label: "Backend Development" },
  { id: "javascript", label: "Javascript" },
  { id: "python", label: "Python" },
  { id: "docker", label: "Docker" },
  { id: "mongodb", label: "MongoDB" },
  { id: "html", label: "HTML" },
];

const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");

  const handleCategoryChange = (categoryId) => {
    const newCategories = selectedCategories.includes(categoryId)
      ? selectedCategories.filter((id) => id !== categoryId)
      : [...selectedCategories, categoryId];

    setSelectedCategories(newCategories);
    handleFilterChange(newCategories, sortByPrice);
  };

  const selectByPriceHandler = (value) => {
    setSortByPrice(value);
    handleFilterChange(selectedCategories, value);
  };

  return (
    <div className="w-full md:w-1/5 bg-white dark:bg-gray-800 p-6 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 mb-4">
        <h1 className="font-semibold text-lg md:text-xl text-gray-900 dark:text-gray-100">Filter Options</h1>
        <Select onValueChange={selectByPriceHandler}>
          <SelectTrigger className="w-full sm:w-40 rounded-full dark:bg-gray-700 dark:border-gray-600">
            <SelectValue placeholder="Sort by price" className="text-gray-500 dark:text-gray-400" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700 rounded-lg">
            <SelectGroup>
              <SelectLabel className="text-gray-500 dark:text-gray-400">Sort by price</SelectLabel>
              <SelectItem value="low" className="hover:bg-gray-100 dark:hover:bg-gray-700">Low to High</SelectItem>
              <SelectItem value="high" className="hover:bg-gray-100 dark:hover:bg-gray-700">High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-6 bg-gray-200 dark:bg-gray-700" />

      <div>
        <h2 className="font-semibold mb-4 text-gray-900 dark:text-gray-100">CATEGORY</h2>
        <div className="space-y-3">
          {categories.map((category) => (
            <div key={category.id} className="flex items-center space-x-3">
              <Checkbox
                id={category.id}
                checked={selectedCategories.includes(category.id)}
                onCheckedChange={() => handleCategoryChange(category.id)}
                className="w-5 h-5 rounded-sm border-gray-300 dark:border-gray-600 focus:ring-teal-600 focus:ring-offset-0 data-[state=checked]:bg-teal-600 dark:data-[state=checked]:bg-teal-400 dark:data-[state=checked]:text-gray-900"
              />
              <Label
                htmlFor={category.id}
                className="text-sm font-medium leading-none cursor-pointer text-gray-800 dark:text-gray-200"
              >
                {category.label}
              </Label>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default Filter;
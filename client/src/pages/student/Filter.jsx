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
import { ChevronDown, Filter as FilterIcon } from "lucide-react"; // Added icons for flair
import React, { useState } from "react";

// Assuming you've corrected the categories array structure in your overall codebase
// For the frontend component, we'll keep the existing structure since the IDs are the same as labels.
const categories = [
  { id: "Programming Languages", label: "Programming Languages" },
  { id: "Web Development", label: "Web Development" },
  { id: "Mobile App Development", label: "Mobile App Development" },
  { id: "Data Science & AI", label: "Data Science & AI" },
  { id: "Cloud Computing & DevOps", label: "Cloud Computing & DevOps" },
  { id: "Cybersecurity", label: "Cybersecurity" },
  { id: "Database & Big Data", label: "Database & Big Data" },
  { id: "Software Development Tools", label: "Software Development Tools" },
  { id: "Blockchain & Web3", label: "Blockchain & Web3" },
];


const Filter = ({ handleFilterChange }) => {
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [sortByPrice, setSortByPrice] = useState("");
  const [isCategoryOpen, setIsCategoryOpen] = useState(true); // Control visibility for a cleaner look

  const handleCategoryChange = (categoryId) => {
    // This logic correctly uses the full category name (which is also the ID)
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
    <div className="w-full md:w-1/5 **sticky top-6** h-fit **min-w-[250px]** bg-white dark:bg-gray-800 p-6 rounded-xl shadow-2xl border border-gray-100 dark:border-gray-700">
      
      {/* HEADER SECTION (Title & Sort) - Now aligned and prominent */}
      <div className="flex items-center justify-between mb-6">
        <h1 className="flex items-center font-bold text-xl text-gray-900 dark:text-gray-100">
          <FilterIcon className="w-5 h-5 mr-2 text-teal-600 dark:text-teal-400" />
          Filters
        </h1>
      </div>

      <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

      {/* SORT BY PRICE SECTION - Cleaned up */}
      <div className="mb-6 space-y-3">
        <Label className="font-semibold text-sm text-gray-800 dark:text-gray-200 tracking-wider uppercase">Sort by Price</Label>
        <Select onValueChange={selectByPriceHandler} value={sortByPrice}>
          <SelectTrigger className="w-full h-10 rounded-lg dark:bg-gray-700 dark:border-gray-600 focus:ring-1 focus:ring-teal-500 transition-shadow">
            <SelectValue placeholder="Price order..." className="text-gray-500 dark:text-gray-400" />
          </SelectTrigger>
          <SelectContent className="dark:bg-gray-800 dark:border-gray-700 rounded-lg">
            <SelectGroup>
              <SelectItem value="low">Price: Low to High</SelectItem>
              <SelectItem value="high">Price: High to Low</SelectItem>
            </SelectGroup>
          </SelectContent>
        </Select>
      </div>

      <Separator className="my-4 bg-gray-200 dark:bg-gray-700" />

      {/* CATEGORY SECTION - Implemented a simple collapse/expand pattern */}
      <div className="space-y-4">
        <button 
            onClick={() => setIsCategoryOpen(!isCategoryOpen)} 
            className="flex items-center justify-between w-full p-2 -ml-2 rounded-md hover:bg-gray-50 dark:hover:bg-gray-700/50 transition-colors"
        >
            <h2 className="font-semibold text-sm text-gray-800 dark:text-gray-200 tracking-wider uppercase">
                Category
            </h2>
            <ChevronDown className={`w-4 h-4 text-gray-500 dark:text-gray-400 transition-transform ${isCategoryOpen ? 'rotate-180' : 'rotate-0'}`} />
        </button>
        
        {/* Checkbox List */}
        {isCategoryOpen && (
            <div className="space-y-3 pt-1 animate-in slide-in-from-top-1">
                {categories.map((category) => (
                    <div key={category.id} className="flex items-center space-x-3 group cursor-pointer hover:text-teal-600 dark:hover:text-teal-400 transition-colors">
                        <Checkbox
                            id={category.id}
                            checked={selectedCategories.includes(category.id)}
                            onCheckedChange={() => handleCategoryChange(category.id)}
                            className="w-4 h-4 rounded-sm border-gray-400 dark:border-gray-500 focus:ring-1 focus:ring-offset-1 focus:ring-teal-600 focus:ring-offset-white dark:focus:ring-offset-gray-900 data-[state=checked]:bg-teal-600 dark:data-[state=checked]:bg-teal-400 dark:data-[state=checked]:text-gray-900 transition-all"
                        />
                        <Label
                            htmlFor={category.id}
                            className="text-sm font-medium leading-none cursor-pointer text-gray-800 dark:text-gray-200 group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors"
                        >
                            {category.label}
                        </Label>
                    </div>
                ))}
            </div>
        )}
      </div>
    </div>
  );
};

export default Filter;
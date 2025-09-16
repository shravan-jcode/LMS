import { Menu, Zap } from "lucide-react";
import React, { useEffect } from "react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "./ui/dropdown-menu";
import { Button } from "./ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "./ui/avatar";
import DarkMode from "@/DarkMode";
import {
  Sheet,
  SheetClose,
  SheetContent,
  SheetHeader,
  SheetTrigger,
} from "./ui/sheet";
import { Separator } from "@radix-ui/react-dropdown-menu";
import { Link, useNavigate } from "react-router-dom";
import { useLogoutUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";
import { useSelector } from "react-redux";

const Navbar = () => {
  const { user } = useSelector((store) => store.auth);
  const [logoutUser, { data, isSuccess }] = useLogoutUserMutation();
  const navigate = useNavigate();

  const logoutHandler = async () => {
    await logoutUser();
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "User logged out.");
      navigate("/login");
    }
  }, [isSuccess, navigate, data]);

  return (
    <div className="fixed top-0 left-0 right-0 z-50 h-16 border-b border-gray-200 dark:border-gray-800 bg-white/80 dark:bg-gray-950/80 backdrop-blur-md">
      {/* Desktop Navbar */}
      <div className="max-w-7xl mx-auto hidden md:flex justify-between items-center px-4 md:px-8 h-full">
        {/* Logo */}
        <div className="flex items-center gap-3">
          <Zap size={28} className="text-teal-600 dark:text-teal-400" />
          <Link to="/">
            <h1 className="font-extrabold text-2xl text-gray-800 dark:text-gray-100">
              LearnSphere
            </h1>
          </Link>
        </div>

        {/* Right side */}
        <div className="flex items-center gap-6">
          {user ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Avatar className="cursor-pointer ring-2 ring-transparent hover:ring-teal-500 transition-all duration-300">
                  <AvatarImage
                    src={user?.photoUrl || "https://github.com/shadcn.png"}
                    alt="User"
                  />
                  <AvatarFallback>U</AvatarFallback>
                </Avatar>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-56 rounded-xl shadow-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800">
                <DropdownMenuLabel className="font-semibold text-teal-600 dark:text-teal-400">
                  My Account
                </DropdownMenuLabel>
                <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                <DropdownMenuGroup>
                  <DropdownMenuItem>
                    <Link to="my-learning" className="w-full text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition">
                      My Learning
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem>
                    <Link to="profile" className="w-full text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition">
                      Edit Profile
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem onClick={logoutHandler} className="text-gray-800 dark:text-gray-200 hover:text-red-500 transition cursor-pointer">
                    Log out
                  </DropdownMenuItem>
                </DropdownMenuGroup>

                {user?.role === "instructor" && (
                  <>
                    <DropdownMenuSeparator className="bg-gray-200 dark:bg-gray-700" />
                    <DropdownMenuItem>
                      <Link to="/admin/dashboard" className="w-full text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition">
                        Dashboard
                      </Link>
                    </DropdownMenuItem>
                  </>
                )}
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-3">
              <Button
                variant="outline"
                onClick={() => navigate("/login", { state: { tab: "login" } })}
                className="rounded-full px-5 border-gray-300 text-gray-900 hover:bg-gray-100 dark:border-gray-700 dark:text-gray-100 dark:hover:bg-gray-800 transition-colors duration-300"
              >
                Login
              </Button>

              <Button
                onClick={() => navigate("/login", { state: { tab: "signup" } })}
                className="rounded-full px-6 bg-teal-600 text-white hover:bg-teal-700 transition-colors duration-300 shadow-sm hover:shadow-md"
              >
                Signup
              </Button>
            </div>
          )}

          {/* Dark mode toggle */}
          <DarkMode />
        </div>
      </div>

      {/* Mobile Navbar */}
      <div className="flex md:hidden items-center justify-between px-4 h-full w-full">
        <Link to="/">
          <h1 className="font-extrabold text-xl text-gray-800 dark:text-gray-100">
            LearnSphere
          </h1>
        </Link>
        <MobileNavbar user={user} />
      </div>
    </div>
  );
};

export default Navbar;

const MobileNavbar = ({ user }) => {
  const navigate = useNavigate();
  const [logoutUser] = useLogoutUserMutation();

  const handleLogoutAndClose = async () => {
    await logoutUser();
    navigate("/login");
  };

  return (
    <Sheet>
      <SheetTrigger asChild>
        <Button
          size="icon"
          variant="outline"
          className="rounded-full border-gray-300 dark:border-gray-700 hover:bg-gray-100 dark:hover:bg-gray-800 transition"
        >
          <Menu />
        </Button>
      </SheetTrigger>

      <SheetContent
        side="right"
        className="w-64 sm:w-72 bg-white dark:bg-gray-950 p-6 flex flex-col rounded-l-2xl shadow-2xl border-l border-gray-200 dark:border-gray-800"
      >
        <SheetHeader>
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white">Menu</h3>
            <DarkMode />
          </div>
        </SheetHeader>

        <Separator className="mb-6 bg-gray-200 dark:bg-gray-700 h-px" />

        {/* Navigation Links */}
        <nav className="flex flex-col space-y-4 text-lg font-medium flex-1">
          <SheetClose asChild>
            <Link
              to="/my-learning"
              className="text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
            >
              My Learning
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <Link
              to="/profile"
              className="text-gray-800 dark:text-gray-200 hover:text-teal-600 dark:hover:text-teal-400 transition py-2"
            >
              Edit Profile
            </Link>
          </SheetClose>
          <SheetClose asChild>
            <button
              onClick={handleLogoutAndClose}
              className="text-gray-800 dark:text-gray-200 hover:text-red-500 transition text-left py-2"
            >
              Log out
            </button>
          </SheetClose>
        </nav>

        {/* Instructor Dashboard */}
        {user?.role === "instructor" && (
          <SheetClose asChild>
            <Button className="w-full rounded-full bg-teal-600 text-white hover:bg-teal-700 transition shadow-sm hover:shadow-md mt-auto">
              Dashboard
            </Button>
          </SheetClose>
        )}
      </SheetContent>
    </Sheet>
  );
};
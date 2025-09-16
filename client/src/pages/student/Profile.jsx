import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import Course from "./Course";
import { useLoadUserQuery, useUpdateUserMutation } from "@/features/api/authApi";
import { toast } from "sonner";

const Profile = () => {
  const [name, setName] = useState("");
  const [profilePhoto, setProfilePhoto] = useState("");
  const [isDialogOpen, setIsDialogOpen] = useState(false);

  const { data, isLoading, refetch } = useLoadUserQuery();
  const [
    updateUser,
    { isLoading: updateUserIsLoading, isError, error, isSuccess },
  ] = useUpdateUserMutation();

  const onChangeHandler = (e) => {
    const file = e.target.files?.[0];
    if (file) setProfilePhoto(file);
  };

  const updateUserHandler = async () => {
    const formData = new FormData();
    if (name) formData.append("name", name);
    if (profilePhoto) formData.append("profilePhoto", profilePhoto);
    await updateUser(formData);
  };

  useEffect(() => {
    refetch();
  }, [refetch]);

  useEffect(() => {
    if (isSuccess) {
      refetch();
      toast.success("Profile updated successfully!");
      setIsDialogOpen(false); // Close dialog on success
      setName("");
      setProfilePhoto("");
    }
    if (isError) {
      toast.error(error?.message || "Failed to update profile");
    }
  }, [isSuccess, isError, error, refetch]);

  if (isLoading) return <h1 className="text-center text-lg text-gray-900 dark:text-gray-100">Loading Profile...</h1>;

  const user = data?.user;

  return (
    <div className="max-w-6xl mx-auto px-6 my-12">
      {/* Profile Header */}
      <h1 className="font-extrabold text-3xl text-center md:text-left text-gray-900 dark:text-gray-100 mb-8">
        <span className="bg-clip-text text-transparent bg-gradient-to-r from-teal-600 to-teal-400">
          Your Profile
        </span>
      </h1>

      {/* Profile Card */}
      <div className="flex flex-col md:flex-row items-center md:items-start gap-8 bg-white/80 dark:bg-gray-950/50 rounded-2xl shadow-xl p-6 border border-gray-200 dark:border-gray-800 backdrop-blur-sm">
        {/* Avatar */}
        <div className="flex flex-col items-center">
          <Avatar className="h-28 w-28 md:h-36 md:w-36 ring-4 ring-teal-500/30">
            <AvatarImage
              src={user?.photoUrl || "https://github.com/shadcn.png"}
              alt={user?.name || "user"}
            />
            <AvatarFallback className="bg-gray-200 dark:bg-gray-700 text-gray-800 dark:text-gray-200">{user?.name?.charAt(0) || "U"}</AvatarFallback>
          </Avatar>
        </div>

        {/* User Info */}
        <div className="flex-1 space-y-4">
          <p className="text-gray-900 dark:text-gray-100 text-lg">
            <span className="font-semibold">Name: </span>
            <span className="font-normal text-gray-700 dark:text-gray-300">{user?.name}</span>
          </p>
          <p className="text-gray-900 dark:text-gray-100 text-lg">
            <span className="font-semibold">Email: </span>
            <span className="font-normal text-gray-700 dark:text-gray-300">{user?.email}</span>
          </p>
          <p className="text-gray-900 dark:text-gray-100 text-lg">
            <span className="font-semibold">Role: </span>
            <span className="font-normal text-gray-700 dark:text-gray-300">{user?.role?.toUpperCase()}</span>
          </p>

          {/* Edit Profile Dialog */}
          <Dialog open={isDialogOpen} onOpenChange={setIsDialogOpen}>
            <DialogTrigger asChild>
              <Button
                size="sm"
                className="mt-4 bg-teal-600 text-white hover:bg-teal-700 transition-all duration-300 shadow-lg"
              >
                Edit Profile
              </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-md bg-white dark:bg-gray-950/90 rounded-2xl border-gray-200 dark:border-gray-800">
              <DialogHeader>
                <DialogTitle className="text-teal-600 dark:text-teal-400">Edit Profile</DialogTitle>
                <DialogDescription className="text-gray-500 dark:text-gray-400">
                  Update your personal details below and save changes.
                </DialogDescription>
              </DialogHeader>
              <div className="grid gap-6 py-4">
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="name" className="text-gray-900 dark:text-gray-300">Name</Label>
                  <Input
                    id="name"
                    type="text"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    placeholder="Enter new name"
                    className="col-span-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200 focus-visible:ring-teal-400"
                  />
                </div>
                <div className="grid grid-cols-4 items-center gap-4">
                  <Label htmlFor="photo" className="text-gray-900 dark:text-gray-300">Profile Photo</Label>
                  <Input
                    id="photo"
                    onChange={onChangeHandler}
                    type="file"
                    accept="image/*"
                    className="col-span-3 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-200"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  disabled={updateUserIsLoading}
                  onClick={updateUserHandler}
                  className="w-full bg-teal-600 hover:bg-teal-700 transition-all duration-300 shadow-lg text-white font-semibold rounded-full"
                >
                  {updateUserIsLoading ? (
                    <>
                      <Loader2 className="mr-2 h-4 w-4 animate-spin inline-block" />
                      Save Changes
                    </>
                  ) : (
                    "Save Changes"
                  )}
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
      </div>

      {/* Enrolled Courses */}
      <div className="mt-10">
        <h2 className="font-bold text-2xl text-gray-900 dark:text-gray-100 mb-6">
          Courses You're Enrolled In
        </h2>
        {user?.enrolledCourses?.length === 0 ? (
          <p className="text-gray-600 dark:text-gray-400 text-lg">
            You haven't enrolled in any course yet.
          </p>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
            {user.enrolledCourses.map((course) => (
              <Course key={course._id} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default Profile;
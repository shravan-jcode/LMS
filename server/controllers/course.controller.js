import { Course } from "../models/course.model.js";
import { Lecture } from "../models/lecture.model.js";
import { deleteMediaFromCloudinary, deletePDFFromCloudinary, deleteVideoFromCloudinary, uploadMedia } from "../utils/cloudinary.js";

export const createCourse = async (req, res) => {
    try {
        const { courseTitle, category } = req.body;
        if (!courseTitle || !category) {
            return res.status(400).json({
                message: "Course title and category is required."
            })
        }

        const course = await Course.create({
            courseTitle,
            category,
            creator: req.id
        });

        return res.status(201).json({
            course,
            message: "Course created."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}
export const getEnrolledUsersByCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { search = "", sort = "name" } = req.query;

        const course = await Course.findById(courseId)
            .populate({
                path: "enrolledStudents",
                select: "name email photoUrl createdAt",
            })
            .lean();

        if (!course) {
            return res.status(404).json({ success: false, message: "Course not found" });
        }

        let users = course.enrolledStudents;

        if (search) {
            const regex = new RegExp(search, "i");
            users = users.filter(
                (u) => regex.test(u.name) || regex.test(u.email)
            );
        }

        if (sort === "name") {
            users.sort((a, b) => a.name.localeCompare(b.name));
        } else if (sort === "recent") {
            users.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        }

        return res.status(200).json({
            success: true,
            course: { _id: course._id, courseTitle: course.courseTitle }, // add this
            enrolledUsers: users,
            totalEnrolled: users.length,
        });

    } catch (error) {
        console.error("Error fetching enrolled users:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to fetch enrolled users",
        });
    }
};


// ✅ Remove a user from a specific course
export const removeUserFromCourse = async (req, res) => {
    try {
        const { courseId, userId } = req.params;

        // Remove user from Course.enrolledStudents
        await Course.findByIdAndUpdate(courseId, {
            $pull: { enrolledStudents: userId },
        });

        // Remove course from User.enrolledCourses
        await User.findByIdAndUpdate(userId, {
            $pull: { enrolledCourses: courseId },
        });

        // (Optional) You can also remove their purchase record if you want:
        await CoursePurchase.findOneAndDelete({ courseId, userId });

        return res.status(200).json({
            success: true,
            message: "User removed from the course successfully.",
        });
    } catch (error) {
        console.error("Error removing user:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to remove user from course",
        });
    }
};

export const searchCourse = async (req, res) => {
    try {
        let { query = "", categories = [], sortByPrice = "" } = req.query;

        // Ensure categories is always an array
        if (typeof categories === "string") {
            categories = [categories];
        }

        // Base filter
        const baseFilter = { isPublished: true };

        // Text search filter
        const textSearch = {
            $or: [
                { courseTitle: { $regex: query, $options: "i" } },
                { subTitle: { $regex: query, $options: "i" } },
                { category: { $regex: query, $options: "i" } },
            ],
        };

        // Combine filters
        let searchCriteria = { ...baseFilter };

        if (query && query.trim() !== "") {
            searchCriteria.$and = [textSearch];
        }

        if (categories.length > 0) {
            // If $and already exists, push new condition
            if (!searchCriteria.$and) searchCriteria.$and = [];
            searchCriteria.$and.push({ category: { $in: categories } });
        }

        // Define sort options
        const sortOptions = {};
        if (sortByPrice === "low") sortOptions.coursePrice = 1;
        else if (sortByPrice === "high") sortOptions.coursePrice = -1;

        // Fetch courses with creator info
        const courses = await Course.find(searchCriteria)
            .populate({ path: "creator", select: "name photoUrl" })
            .sort(sortOptions);

        return res.status(200).json({
            success: true,
            courses: courses || [],
        });
    } catch (error) {
        console.error("Error searching courses:", error.message);
        return res.status(500).json({
            success: false,
            message: "Failed to search courses",
            courses: [],
        });
    }
};



export const getPublishedCourse = async (_, res) => {
    try {
        const courses = await Course.find({ isPublished: true }).populate({ path: "creator", select: "name photoUrl" });
        if (!courses) {
            return res.status(404).json({
                message: "Course not found"
            })
        }
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to get published courses"
        })
    }
}
export const getCreatorCourses = async (req, res) => {
    try {
        const userId = req.id;
        const courses = await Course.find({ creator: userId });
        if (!courses) {
            return res.status(404).json({
                courses: [],
                message: "Course not found"
            })
        };
        return res.status(200).json({
            courses,
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}
export const editCourse = async (req, res) => {
    try {
        const courseId = req.params.courseId;
        const { courseTitle, subTitle, description, category, courseLevel, coursePrice } = req.body;
        const thumbnail = req.file;

        let course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            })
        }
        let courseThumbnail;
        if (thumbnail) {
            if (course.courseThumbnail) {
                const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
                await deleteMediaFromCloudinary(publicId); // delete old image
            }
            // upload a thumbnail on clourdinary
            courseThumbnail = await uploadMedia(thumbnail.path);
        }


        const updateData = { courseTitle, subTitle, description, category, courseLevel, coursePrice, courseThumbnail: courseThumbnail?.secure_url };

        course = await Course.findByIdAndUpdate(courseId, updateData, { new: true });

        return res.status(200).json({
            course,
            message: "Course updated successfully."
        })

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create course"
        })
    }
}
export const removeCourse = async (req, res) => {
    try {
        const { courseId } = req.params;

        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found",
            });
        }

        // Delete thumbnail from Cloudinary (if exists)
        if (course.courseThumbnail) {
            const publicId = course.courseThumbnail.split("/").pop().split(".")[0];
            await deleteMediaFromCloudinary(publicId);
        }

        // Delete all related lectures
        if (course.lectures?.length > 0) {
            await Lecture.deleteMany({ _id: { $in: course.lectures } });
        }

        // Finally delete the course itself
        await Course.findByIdAndDelete(courseId);

        return res.status(200).json({
            message: "Course deleted successfully",
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove course",
        });
    }
};


export const getCourseById = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    // check if the user has purchased the course
    const purchased = await CoursePurchase.findOne({ courseId, userId, status: "completed" });
    if (!purchased) {
      return res.status(403).json({
        message: "You have not purchased this course.",
        success: false,
      });
    }

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({
        message: "Course not found!",
      });
    }

    return res.status(200).json({ course });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get course by id" });
  }
};

export const createLecture = async (req, res) => {
    try {
        const { lectureTitle } = req.body;
        const { courseId } = req.params;

        if (!lectureTitle || !courseId) {
            return res.status(400).json({
                message: "Lecture title is required"
            })
        };

        // create lecture
        const lecture = await Lecture.create({ lectureTitle });

        const course = await Course.findById(courseId);
        if (course) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(201).json({
            lecture,
            message: "Lecture created successfully."
        });

    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to create lecture"
        })
    }
}
export const getCourseLecture = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id;

    const purchased = await CoursePurchase.findOne({ courseId, userId, status: "completed" });
    if (!purchased) {
      return res.status(403).json({ message: "You have not purchased this course." });
    }

    const course = await Course.findById(courseId).populate("lectures");
    if (!course) {
      return res.status(404).json({ message: "Course not found" });
    }

    return res.status(200).json({ lectures: course.lectures });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get lectures" });
  }
};

export const editLecture = async (req, res) => {
    try {
        const { lectureTitle, videoInfo, isPreviewFree } = req.body;
        const { courseId, lectureId } = req.params;

        const lecture = await Lecture.findById(lectureId);
        if (!lecture) {
            return res.status(404).json({ message: "Lecture not found!" });
        }

        // Update basic lecture info
        if (lectureTitle) lecture.lectureTitle = lectureTitle;
        if (videoInfo?.videoUrl) lecture.videoUrl = videoInfo.videoUrl;
        if (videoInfo?.publicId) lecture.publicId = videoInfo.publicId;
        lecture.isPreviewFree = isPreviewFree;

        // Handle PDF notes
        if (req.body.notesInfo) {
            // Delete old PDF from Cloudinary if it exists
            if (lecture.notes?.publicId) {
                await deletePDFFromCloudinary(lecture.notes.publicId); // ensure delete uses {resource_type:"raw"} for PDF
            }

            // Save new PDF info
            lecture.notes = {
                pdfUrl: req.body.notesInfo.pdfUrl,
                publicId: req.body.notesInfo.publicId,
                fileName: req.body.notesInfo.fileName,
            };
        }

        await lecture.save();

        // Ensure the course still has the lecture id if not already added
        const course = await Course.findById(courseId);
        if (course && !course.lectures.includes(lecture._id)) {
            course.lectures.push(lecture._id);
            await course.save();
        }

        return res.status(200).json({
            lecture,
            message: "Lecture updated successfully."
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({ message: "Failed to edit lecture" });
    }
};

export const removeLecture = async (req, res) => {
    try {
        const { lectureId } = req.params;
        const lecture = await Lecture.findByIdAndDelete(lectureId);
        if (!lecture) {
            return res.status(404).json({
                message: "Lecture not found!"
            });
        }
        // delete the lecture from couldinary as well
        if (lecture.publicId) {
            await deleteVideoFromCloudinary(lecture.publicId);
        }

        // Remove the lecture reference from the associated course
        await Course.updateOne(
            { lectures: lectureId }, // find the course that contains the lecture
            { $pull: { lectures: lectureId } } // Remove the lectures id from the lectures array
        );

        return res.status(200).json({
            message: "Lecture removed successfully."
        })
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to remove lecture"
        })
    }
}
export const getLectureById = async (req, res) => {
  try {
    const { lectureId } = req.params;
    const userId = req.id;

    // find course containing this lecture
    const course = await Course.findOne({ lectures: lectureId });
    if (!course) return res.status(404).json({ message: "Lecture not found" });

    const purchased = await CoursePurchase.findOne({ courseId: course._id, userId, status: "completed" });
    if (!purchased) return res.status(403).json({ message: "You have not purchased this course." });

    const lecture = await Lecture.findById(lectureId);
    if (!lecture) return res.status(404).json({ message: "Lecture not found!" });

    return res.status(200).json({ lecture });
  } catch (error) {
    console.log(error);
    return res.status(500).json({ message: "Failed to get lecture by id" });
  }
};



// publich unpublish course logic

export const togglePublishCourse = async (req, res) => {
    try {
        const { courseId } = req.params;
        const { publish } = req.query; // true, false
        const course = await Course.findById(courseId);
        if (!course) {
            return res.status(404).json({
                message: "Course not found!"
            });
        }
        // publish status based on the query paramter
        course.isPublished = publish === "true";
        await course.save();

        const statusMessage = course.isPublished ? "Published" : "Unpublished";
        return res.status(200).json({
            message: `Course is ${statusMessage}`
        });
    } catch (error) {
        console.log(error);
        return res.status(500).json({
            message: "Failed to update status"
        })
    }
}
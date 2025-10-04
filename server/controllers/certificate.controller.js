import { User } from "../models/user.model.js";
import { Course } from "../models/course.model.js";
import { CourseProgress } from "../models/courseProgress.js";
import { generateCertificate } from "../utils/generateCertificate.js";

export const issueCertificate = async (req, res) => {
  try {
    const { courseId } = req.params;
    const userId = req.id || req.user._id; // Auth middleware should provide req.id

    // Check if user completed the course
    const progress = await CourseProgress.findOne({ userId, courseId });
    if (!progress || !progress.completed) {
      return res.status(400).json({ message: "Course not completed yet!" });
    }

    const user = await User.findById(userId);
    const course = await Course.findById(courseId).populate("creator", "name");

    if (!user || !course) {
      return res.status(404).json({ message: "User or Course not found" });
    }

    // Pass creator name separately
    const creatorName = course.creator ? course.creator.name : "LearnSphere";

    // Generate and send PDF directly
    generateCertificate(user, course, res, creatorName);

  } catch (error) {
    console.log(error);
    res.status(500).json({ message: "Failed to generate certificate" });
  }
};

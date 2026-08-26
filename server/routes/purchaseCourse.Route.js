import express from "express";
import isAuthenticated from "../middlewares/isAuthenticated.js";
import {
  createCheckoutSession,
  getAllPurchasedCourse,
  getCourseDetailWithPurchaseStatus,
  verifyPayment
} from "../controllers/coursePurchase.controller.js";

const router = express.Router();

// Create Razorpay order
router.route("/checkout/create-checkout-session").post(isAuthenticated, createCheckoutSession);

// Verify Razorpay payment
router.route("/checkout/verify-payment").post(isAuthenticated, verifyPayment);

// Get course details + purchase status
router.route("/course/:courseId/detail-with-status").get(isAuthenticated, getCourseDetailWithPurchaseStatus);

// Get all purchased courses
router.route("/").get(isAuthenticated, getAllPurchasedCourse);

export default router;

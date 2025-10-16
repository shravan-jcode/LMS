import mongoose from "mongoose";

const certificateSchema = new mongoose.Schema({
  certificateId: { type: String, required: true, unique: true },
  userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
  courseId: { type: mongoose.Schema.Types.ObjectId, ref: "Course", required: true },
  issuedBy: { type: String, required: true }, // Creator Name
  issuedAt: { type: Date, default: Date.now }
});

const Certificate = mongoose.model("Certificate", certificateSchema);

export default Certificate;

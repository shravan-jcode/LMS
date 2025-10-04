import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { Switch } from "@/components/ui/switch";
import {
  useEditLectureMutation,
  useGetLectureByIdQuery,
  useRemoveLectureMutation,
} from "@/features/api/courseApi";
import axios from "axios";
import { Loader2 } from "lucide-react";
import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { toast } from "sonner";

const MEDIA_API = "http://localhost:8080/api/v1/media";

const LectureTab = () => {
  const [lectureTitle, setLectureTitle] = useState("");
  const [uploadVideoInfo, setUploadVideoInfo] = useState(null);
  const [uploadPdfInfo, setUploadPdfInfo] = useState(null);
  const [isFree, setIsFree] = useState(false);
  const [mediaProgress, setMediaProgress] = useState(false);
  const [uploadProgress, setUploadProgress] = useState(0);
  const navigate = useNavigate();

  const { courseId, lectureId } = useParams();

  const { data: lectureData } = useGetLectureByIdQuery(lectureId);
  const lecture = lectureData?.lecture;

  useEffect(() => {
    if (lecture) {
      setLectureTitle(lecture.lectureTitle);
      setIsFree(lecture.isPreviewFree);
      setUploadVideoInfo(lecture.videoInfo);
      setUploadPdfInfo(lecture.notes);
    }
  }, [lecture]);

  const [editLecture, { data, isLoading, error, isSuccess }] =
    useEditLectureMutation();
  const [
    removeLecture,
    { data: removeData, isLoading: removeLoading, isSuccess: removeSuccess },
  ] = useRemoveLectureMutation();

  const fileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-video`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadVideoInfo({
            videoUrl: res.data.data.secure_url,
            publicId: res.data.data.public_id,
          });
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error("Video upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const pdfFileChangeHandler = async (e) => {
    const file = e.target.files[0];
    if (file) {
      const formData = new FormData();
      formData.append("file", file);
      setMediaProgress(true);
      try {
        const res = await axios.post(`${MEDIA_API}/upload-pdf`, formData, {
          onUploadProgress: ({ loaded, total }) => {
            setUploadProgress(Math.round((loaded * 100) / total));
          },
        });

        if (res.data.success) {
          setUploadPdfInfo({
            pdfUrl: res.data.data.secure_url,
            publicId: res.data.data.public_id,
            fileName: file.name,
          });
          toast.success(res.data.message);
        }
      } catch (error) {
        toast.error("PDF upload failed");
      } finally {
        setMediaProgress(false);
      }
    }
  };

  const editLectureHandler = async () => {
    await editLecture({
      lectureTitle,
      videoInfo: uploadVideoInfo,
      notesInfo: uploadPdfInfo, // ✅ include PDF info here
      isPreviewFree: isFree,
      courseId,
      lectureId,

    });

  };

  const removeLectureHandler = async () => {
    await removeLecture(lectureId);
  };

  useEffect(() => {
    if (isSuccess) {
      toast.success(data?.message || "Lecture updated.");
    }
    if (error) {
      toast.error(error?.data?.message || "Failed to update lecture.");
    }
  }, [isSuccess, error, data]);

  useEffect(() => {
    if (removeSuccess) {
      toast.success(removeData?.message || "Lecture removed.");
      navigate(`/admin/course/${courseId}/lecture`);
    }
  }, [removeSuccess, navigate, removeData, courseId]);

  return (
    <Card className="shadow-lg border border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-950/50">
      <CardHeader className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
        <div>
          <CardTitle className="text-xl font-bold text-gray-900 dark:text-gray-100">
            Edit Lecture
          </CardTitle>
          <CardDescription className="text-gray-600 dark:text-gray-400">
            Make changes and click save when done.
          </CardDescription>
        </div>
        <Button
          disabled={removeLoading}
          variant="destructive"
          className="bg-red-600 hover:bg-red-700 text-white"
          onClick={removeLectureHandler}
        >
          {removeLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Remove Lecture"
          )}
        </Button>
      </CardHeader>

      <CardContent className="space-y-5">
        <div>
          <Label className="text-gray-800 dark:text-gray-200">Title</Label>
          <Input
            value={lectureTitle}
            onChange={(e) => setLectureTitle(e.target.value)}
            type="text"
            placeholder="Ex. Introduction to Javascript"
            className="mt-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200 focus:ring-teal-500"
          />
        </div>

        <div>
          <Label className="text-gray-800 dark:text-gray-200">
            Video <span className="text-red-500 dark:text-red-400">*</span>
          </Label>
          <Input
            type="file"
            accept="video/*"
            onChange={fileChangeHandler}
            className="w-fit mt-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
          {uploadVideoInfo && (
            <p className="text-xs mt-1 text-green-600 dark:text-green-400">
              Video uploaded successfully
            </p>
          )}
        </div>

        <div className="mt-4">
          <Label className="text-gray-800 dark:text-gray-200">Notes (PDF)</Label>
          <Input
            type="file"
            accept="application/pdf"
            onChange={pdfFileChangeHandler}
            className="w-fit mt-2 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-200"
          />
          {uploadPdfInfo && (
            <p className="text-xs mt-1 text-green-600 dark:text-green-400">
              PDF uploaded successfully
            </p>
          )}
        </div>

        <div className="flex items-center space-x-2">
          <Switch
            checked={isFree}
            onCheckedChange={setIsFree}
            id="is-free"
            className="data-[state=checked]:bg-teal-600"
          />
          <Label htmlFor="is-free" className="text-gray-800 dark:text-gray-200">
            Is this video FREE
          </Label>
        </div>

        {mediaProgress && (
          <div>
            <Progress
              value={uploadProgress}
              className="h-2 bg-gray-200 dark:bg-gray-700 [&>div]:bg-teal-600 dark:[&>div]:bg-teal-500"
            />
            <p className="text-sm mt-1 text-gray-600 dark:text-gray-400">
              {uploadProgress}% uploaded
            </p>
          </div>
        )}

        <Button
          disabled={isLoading || !uploadVideoInfo}
          onClick={editLectureHandler}
          className="bg-teal-600 hover:bg-teal-700 text-white dark:bg-teal-500 dark:hover:bg-teal-600"
        >
          {isLoading ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Please wait
            </>
          ) : (
            "Update Lecture"
          )}
        </Button>
      </CardContent>
    </Card>
  );
};

export default LectureTab;

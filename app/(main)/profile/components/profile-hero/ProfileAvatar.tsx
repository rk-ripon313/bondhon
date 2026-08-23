"use client";

import { updateUserField } from "@/app/actions/profile/update-user.action";
import { uploadFileToCloudinary } from "@/lib/helpers/cloudinary-upload";
import { getErrorMessage } from "@/lib/helpers/error";

import imageCompression from "browser-image-compression";
import { Camera, ImageIcon, Upload, X } from "lucide-react";
import Image from "next/image";
import { useRef, useState } from "react";
import Cropper, { Area, Point } from "react-easy-crop";

import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useSession } from "next-auth/react";
import { toast } from "sonner";

interface ProfileAvatarProps {
  image?: string;
  name?: string;
  isAvailableForDonate?: boolean;
}

type Step = "select" | "crop" | "preview";

const MAX_FILE_SIZE = 5 * 1024 * 1024;

const ACCEPTED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

function createImage(url: string): Promise<HTMLImageElement> {
  return new Promise((resolve, reject) => {
    const image = new window.Image();

    image.onload = () => resolve(image);
    image.onerror = reject;
    image.src = url;
  });
}

async function getCroppedImage(imageSrc: string, crop: Area): Promise<File> {
  const image = await createImage(imageSrc);

  const canvas = document.createElement("canvas");
  const context = canvas.getContext("2d");

  if (!context) {
    throw new Error("Could not create canvas context.");
  }

  canvas.width = crop.width;
  canvas.height = crop.height;

  context.drawImage(
    image,
    crop.x,
    crop.y,
    crop.width,
    crop.height,
    0,
    0,
    crop.width,
    crop.height,
  );

  return new Promise((resolve, reject) => {
    canvas.toBlob(
      (blob) => {
        if (!blob) {
          reject(new Error("Failed to create cropped image."));
          return;
        }

        resolve(
          new File([blob], "profile-photo.jpg", {
            type: "image/jpeg",
            lastModified: Date.now(),
          }),
        );
      },
      "image/jpeg",
      0.9,
    );
  });
}

export default function ProfileAvatar({
  image,
  name,
  isAvailableForDonate = false,
}: ProfileAvatarProps) {
  const { update } = useSession();

  const fileInputRef = useRef<HTMLInputElement>(null);

  const [viewOpen, setViewOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const [step, setStep] = useState<Step>("select");

  const [selectedImage, setSelectedImage] = useState<string | null>(null);

  const [croppedFile, setCroppedFile] = useState<File | null>(null);

  const [previewUrl, setPreviewUrl] = useState<string | null>(null);

  const [crop, setCrop] = useState<Point>({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);

  const [croppedArea, setCroppedArea] = useState<Area | null>(null);

  const [error, setError] = useState<string | null>(null);

  const [isProcessing, setIsProcessing] = useState(false);

  const resetUpload = () => {
    if (selectedImage) {
      URL.revokeObjectURL(selectedImage);
    }

    if (previewUrl) {
      URL.revokeObjectURL(previewUrl);
    }

    setStep("select");
    setSelectedImage(null);
    setCroppedFile(null);
    setPreviewUrl(null);
    setError(null);

    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);
    setCroppedArea(null);

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleUploadOpenChange = (open: boolean) => {
    if (!open) {
      resetUpload();
    }

    setUploadOpen(open);
  };

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];

    if (!file) return;

    setError(null);

    if (!ACCEPTED_IMAGE_TYPES.includes(file.type)) {
      toast.error("Please select a JPG, PNG, or WebP image.");
      setError("Please select a JPG, PNG, or WebP image.");
      return;
    }

    if (file.size > MAX_FILE_SIZE) {
      toast.error("Image size must be smaller than 5MB.");
      setError("Image size must be smaller than 5MB.");
      return;
    }

    const imageUrl = URL.createObjectURL(file);

    setSelectedImage(imageUrl);

    setCrop({
      x: 0,
      y: 0,
    });

    setZoom(1);

    setStep("crop");
  };

  const handleCropComplete = (_croppedArea: Area, croppedAreaPixels: Area) => {
    setCroppedArea(croppedAreaPixels);
  };

  const handleCrop = async () => {
    if (!selectedImage || !croppedArea) {
      return;
    }

    try {
      setIsProcessing(true);
      setError(null);

      const file = await getCroppedImage(selectedImage, croppedArea);

      const url = URL.createObjectURL(file);

      setCroppedFile(file);
      setPreviewUrl(url);
      setStep("preview");
    } catch (error) {
      console.error("Crop failed:", error);

      setError("Could not crop the image. Please try again.");
    } finally {
      setIsProcessing(false);
    }
  };

  const handleSave = async () => {
    if (!croppedFile) return;

    try {
      setIsProcessing(true);
      setError(null);

      //  Compress image
      const compressedFile = await imageCompression(croppedFile, {
        maxSizeMB: 1,
        useWebWorker: true,
      });

      //  Upload to Cloudinary
      const uploadedImageUrl = await uploadFileToCloudinary({
        files: compressedFile,
        fileType: "image",
        subFolder: "Profile",
      });

      if (!uploadedImageUrl) {
        throw new Error("Image upload failed.");
      }

      // Update database
      const dbRes = await updateUserField({
        image: uploadedImageUrl as string,
      });

      if (!dbRes.success) {
        throw new Error(dbRes.message || "Failed to save image.");
      }

      //  Update NextAuth session
      await update({
        image: uploadedImageUrl as string,
      });

      toast.success("Profile image updated!");

      //  Close dialog
      handleUploadOpenChange(false);
    } catch (error) {
      console.error("Failed to save profile image:", error);
      const message = getErrorMessage(error);

      toast.error(message);
      setError(message);
    } finally {
      setIsProcessing(false);
    }
  };
  return (
    <>
      {/* PROFILE AVATAR */}
      <div className="relative shrink-0">
        <button
          type="button"
          onClick={() => setViewOpen(true)}
          aria-label="View profile photo"
          className="group relative rounded-2xl bg-gradient-to-br from-app-primary/30 via-border to-app-secondary/20 p-[2px]"
        >
          <Image
            src={image || "/avatars/default.png"}
            alt={name || "User avatar"}
            width={112}
            height={112}
            className="cursor-pointer h-24 w-24 rounded-[14px] border border-border bg-background object-cover transition-transform duration-200 group-hover:scale-[1.02] sm:h-28 sm:w-28"
          />

          {/* Hover view indicator */}
          <span className="pointer-events-none absolute inset-[2px] flex items-center justify-center rounded-[12px] bg-black/0 text-white opacity-0 transition-all group-hover:bg-black/35 group-hover:opacity-100">
            <ImageIcon className="h-5 w-5" />
          </span>
        </button>

        {/* Upload button */}
        <button
          type="button"
          onClick={() => setUploadOpen(true)}
          aria-label="Change profile photo"
          className="absolute -bottom-1.5 -left-1.5 flex h-7 w-7 items-center justify-center rounded-full border-2 border-app-card bg-app-primary text-white shadow-sm transition-transform hover:scale-105"
        >
          <Camera className="h-3.5 w-3.5" />
        </button>

        {/* Donor availability */}
        {isAvailableForDonate && (
          <span className="absolute -bottom-1.5 -right-1.5 flex h-5 w-5 items-center justify-center rounded-full border-2 border-app-card bg-emerald-500">
            <span className="h-1.5 w-1.5 rounded-full bg-white" />
          </span>
        )}
      </div>

      {/* VIEW IMAGE */}
      <Dialog open={viewOpen} onOpenChange={setViewOpen}>
        <DialogContent className="border-border bg-app-card sm:max-w-2xl">
          <DialogHeader>
            <DialogTitle className="text-app-foreground">
              Profile Photo
            </DialogTitle>

            <DialogDescription className="text-app-muted">
              {name || "User"}
              {`'s`} profile photo
            </DialogDescription>
          </DialogHeader>

          <div className="flex items-center justify-center overflow-hidden rounded-xl border border-border bg-app-background p-2">
            <Image
              src={image || "/avatars/default.png"}
              alt={name || "User avatar"}
              width={500}
              height={500}
              className="max-h-[60vh] w-full rounded-lg object-contain "
            />
          </div>

          <div className="flex justify-end">
            <Button
              type="button"
              variant="outline"
              onClick={() => setViewOpen(false)}
            >
              Close
            </Button>
          </div>
        </DialogContent>
      </Dialog>

      {/* UPLOAD IMAGE */}
      <Dialog open={uploadOpen} onOpenChange={handleUploadOpenChange}>
        <DialogContent className="border-border bg-app-card sm:max-w-lg">
          {/* SELECT */}
          {step === "select" && (
            <>
              <DialogHeader>
                <DialogTitle className="text-app-foreground">
                  Upload Profile Photo
                </DialogTitle>

                <DialogDescription className="text-app-muted">
                  Choose a clear photo for your BondhOn profile.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div className="flex justify-center">
                  <div className="overflow-hidden rounded-full border border-border">
                    <Image
                      src={image || "/avatars/default.png"}
                      alt={name || "Profile photo"}
                      width={160}
                      height={160}
                      className="h-40 w-40 object-cover"
                    />
                  </div>
                </div>

                <input
                  ref={fileInputRef}
                  type="file"
                  accept="image/jpeg,image/png,image/webp"
                  onChange={handleFileSelect}
                  className="hidden"
                />

                <Button
                  type="button"
                  className="w-full"
                  onClick={() => fileInputRef.current?.click()}
                >
                  <Upload className="mr-2 h-4 w-4" />
                  Choose Photo
                </Button>

                <p className="text-center text-[11px] text-app-muted">
                  JPG, PNG or WebP · Maximum 5MB
                </p>
              </div>
            </>
          )}

          {/* CROP */}
          {step === "crop" && selectedImage && (
            <>
              <DialogHeader>
                <DialogTitle className="text-app-foreground">
                  Crop Your Photo
                </DialogTitle>

                <DialogDescription className="text-app-muted">
                  Drag the image and adjust the zoom.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div className="relative h-[320px] w-full overflow-hidden rounded-xl border border-border bg-black sm:h-[380px]">
                  <Cropper
                    image={selectedImage}
                    crop={crop}
                    zoom={zoom}
                    aspect={1}
                    cropShape="rect"
                    showGrid
                    minZoom={1}
                    maxZoom={4}
                    onCropChange={setCrop}
                    onZoomChange={setZoom}
                    onCropComplete={handleCropComplete}
                  />
                </div>

                {/* Zoom */}
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span className="text-app-muted">Zoom</span>

                    <span className="font-medium text-app-foreground">
                      {zoom.toFixed(1)}x
                    </span>
                  </div>

                  <input
                    type="range"
                    min={1}
                    max={4}
                    step={0.1}
                    value={zoom}
                    onChange={(event) => setZoom(Number(event.target.value))}
                    className="w-full accent-app-primary"
                    aria-label="Zoom image"
                  />
                </div>

                <div className="flex justify-end gap-2 border-t border-border pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isProcessing}
                    onClick={() => {
                      setStep("select");
                      setError(null);
                    }}
                  >
                    <X className="mr-2 h-4 w-4" />
                    Cancel
                  </Button>

                  <Button
                    type="button"
                    disabled={isProcessing || !croppedArea}
                    onClick={handleCrop}
                  >
                    {isProcessing ? "Processing..." : "Crop Photo"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* PREVIEW */}
          {step === "preview" && previewUrl && (
            <>
              <DialogHeader>
                <DialogTitle className="text-app-foreground">
                  Preview Photo
                </DialogTitle>

                <DialogDescription className="text-app-muted">
                  Your cropped photo is ready.
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-5">
                <div className="flex justify-center">
                  <div className="overflow-hidden rounded-xl border border-border bg-app-background">
                    <Image
                      src={previewUrl}
                      alt="Cropped profile preview"
                      width={300}
                      height={300}
                      className="h-64 w-64 object-contain"
                    />
                  </div>
                </div>

                <div className="flex justify-between border-t border-border pt-4">
                  <Button
                    type="button"
                    variant="ghost"
                    disabled={isProcessing}
                    onClick={() => setStep("crop")}
                  >
                    Adjust
                  </Button>

                  <Button
                    type="button"
                    disabled={isProcessing}
                    onClick={handleSave}
                  >
                    {isProcessing ? "Saving..." : "Save Photo"}
                  </Button>
                </div>
              </div>
            </>
          )}

          {/* ERROR */}
          {error && (
            <p className="text-center text-xs text-destructive">{error}</p>
          )}
        </DialogContent>
      </Dialog>
    </>
  );
}

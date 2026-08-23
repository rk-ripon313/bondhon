import {
  v2 as cloudinary,
  UploadApiOptions,
  UploadApiResponse,
} from "cloudinary";
import { NextResponse } from "next/server";
cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export async function POST(req: Request) {
  try {
    const formData = await req.formData();

    const files = formData.getAll("file");
    const subFolder = formData.get("subFolder");
    const fileType = formData.get("fileType");

    if (files.length === 0) {
      return NextResponse.json(
        {
          success: false,
          message: "No file provided.",
        },
        { status: 400 },
      );
    }

    const uploadedUrls: string[] = [];

    for (const file of files) {
      if (!(file instanceof File)) {
        return NextResponse.json(
          {
            success: false,
            message: "Invalid file.",
          },
          { status: 400 },
        );
      }

      const buffer = Buffer.from(await file.arrayBuffer());

      const result = await new Promise<UploadApiResponse>((resolve, reject) => {
        const uploadOptions: UploadApiOptions = {
          folder: `BondhOn${
            typeof subFolder === "string" && subFolder ? `/${subFolder}` : ""
          }`,
          resource_type: fileType === "pdf" ? "raw" : "auto",
        };

        if (fileType === "video") {
          Object.assign(uploadOptions, {
            eager: [
              {
                width: 1280,
                height: 720,
                format: "mp4",
              },
            ],
            eager_async: true,
          });
        }

        cloudinary.uploader
          .upload_stream(uploadOptions, (error, result) => {
            if (error) {
              reject(error);
              return;
            }

            if (!result) {
              reject(new Error("Cloudinary upload returned no result."));
              return;
            }

            resolve(result);
          })
          .end(buffer);
      });

      uploadedUrls.push(result.secure_url);
    }

    return NextResponse.json({
      success: true,
      urls: uploadedUrls.length === 1 ? uploadedUrls[0] : uploadedUrls,
    });
  } catch (error) {
    console.error("Cloudinary upload error:", error);

    return NextResponse.json(
      {
        success: false,
        message: "Cloudinary upload failed.",
      },
      { status: 500 },
    );
  }
}

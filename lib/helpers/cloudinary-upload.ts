type UploadFile = File | Blob;

interface UploadOptions {
  files: UploadFile | UploadFile[];
  fileType: string;
  subFolder?: string;
}

interface UploadResponse {
  success: boolean;
  urls: string | string[];
  message?: string;
}

export async function uploadFileToCloudinary({
  files,
  fileType,
  subFolder = "",
}: UploadOptions): Promise<string | string[]> {
  const filesArray = Array.isArray(files) ? files : [files];

  const uploadedUrls: string[] = [];

  for (const file of filesArray) {
    const formData = new FormData();

    formData.append("file", file);
    formData.append("fileType", fileType);
    formData.append("subFolder", subFolder);

    const response = await fetch("/api/upload-files", {
      method: "POST",
      body: formData,
    });

    const data: UploadResponse = await response.json();

    if (!response.ok || !data.success) {
      throw new Error(data.message || "File upload failed.");
    }

    if (Array.isArray(data.urls)) {
      uploadedUrls.push(...data.urls);
    } else {
      uploadedUrls.push(data.urls);
    }
  }

  return filesArray.length === 1 ? uploadedUrls[0] : uploadedUrls;
}

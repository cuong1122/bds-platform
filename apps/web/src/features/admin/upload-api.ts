import { apiClient } from "@/lib/api-client";

export async function uploadImage(file: File): Promise<string> {
  const formData = new FormData();
  formData.append("file", file);

  // apiClient mặc định set Content-Type: application/json cho mọi request.
  // Với FormData, phải xóa header này để axios tự thêm multipart/form-data + boundary đúng.
  const { data } = await apiClient.post<{ url: string }>(
    "/admin/upload/image",
    formData,
    { headers: { "Content-Type": undefined } }
  );

  return data.url;
}

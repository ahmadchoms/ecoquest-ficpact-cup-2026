import { supabaseAdmin } from "./supabase.js";

export const STORAGE_BUCKETS = {
  EVENT_ASSETS: "event-assets",
  SHOP_ASSETS: "shop-assets",
  GENERAL_ASSETS: "general-assets",
};

export const STORAGE_FOLDERS = {
  EVENT_BANNERS: "banners",
  SHOP_BANNERS: "banners",
  SHOP_BORDERS: "borders",
  USER_PROFILES: "users",
};

export const getShopItemFolder = (type) => {
  return type === "BANNER"
    ? STORAGE_FOLDERS.SHOP_BANNERS
    : STORAGE_FOLDERS.SHOP_BORDERS;
};

export async function uploadToStorage(file, bucket, folder = "") {
  try {
    if (!file || !(file instanceof File)) {
      return { success: false, message: "Tidak ada file yang diunggah." };
    }

    const maxSizeInBytes = 5 * 1024 * 1024; // 5MB
    if (file.size > maxSizeInBytes) {
      return { success: false, message: "Ukuran file melebihi batas 5MB." };
    }

    const fileExt = file.name.split(".").pop();
    const uniqueSuffix = `${Date.now()}-${Math.round(Math.random() * 1e9)}`;
    const fileName = `${uniqueSuffix}.${fileExt}`;
    const filePath = folder ? `${folder}/${fileName}` : fileName;

    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const { data, error } = await supabaseAdmin.storage
      .from(bucket)
      .upload(filePath, buffer, {
        cacheControl: "3600",
        upsert: false,
        contentType: file.type,
      });

    if (error) {
      console.error("Error uploading file:", error);
      return { success: false, message: error.message };
    }

    const { data: urlData } = supabaseAdmin.storage
      .from(bucket)
      .getPublicUrl(filePath);
    return { success: true, url: urlData.publicUrl, path: filePath };
  } catch (error) {
    console.error("Error uploading file:", error);
    return {
      success: false,
      message: "Terjadi kesalahan saat mengunggah file.",
    };
  }
}

export async function deleteFromStorage(fileUrl, bucket) {
  try {
    if (!fileUrl) {
      return { success: true };
    }

    const url = new URL(fileUrl);
    // Parsing untuk mendapatkan path file dari Public URL
    const pathParts = url.pathname.split(
      `/storage/v1/object/public/${bucket}/`,
    );

    if (pathParts.length < 2) {
      const altParts = url.pathname.split(`/${bucket}/`);
      if (altParts.length < 2) {
        console.warn("Could not extract file path from URL:", fileUrl);
        return { success: true };
      }
      const filePath = decodeURIComponent(altParts[1]);

      const { error } = await supabaseAdmin.storage
        .from(bucket)
        .remove([filePath]);
      if (error) {
        console.error("Supabase delete error:", error);
        return { success: false, error: error.message };
      }
      return { success: true };
    }

    const filePath = decodeURIComponent(pathParts[1]);

    const { error } = await supabaseAdmin.storage
      .from(bucket)
      .remove([filePath]);

    if (error) {
      console.error("Supabase delete error:", error);
      return { success: false, error: error.message };
    }

    return { success: true };
  } catch (error) {
    console.error("Delete error:", error);
    return { success: false, error: error.message || "Gagal hapus file" };
  }
}

export async function emptyBucket(bucket) {
  try {
    const { data: list, error: listError } = await supabaseAdmin.storage
      .from(bucket)
      .list("", { limit: 1000 });

    if (listError) throw listError;
    if (!list || list.length === 0) return { success: true };

    const filesToRemove = list.map((x) => x.name);
    
    // Also try to get files in subfolders up to 1 level deep
    for (const folder of list) {
        if (!folder.id) { // It's a folder
            const { data: subList } = await supabaseAdmin.storage
              .from(bucket)
              .list(folder.name, { limit: 1000 });
              
            if (subList && subList.length > 0) {
                const subFiles = subList.map(item => `${folder.name}/${item.name}`);
                filesToRemove.push(...subFiles);
            }
        }
    }

    if (filesToRemove.length > 0) {
        const { error: deleteError } = await supabaseAdmin.storage
          .from(bucket)
          .remove(filesToRemove);
    
        if (deleteError) throw deleteError;
    }

    return { success: true };
  } catch (error) {
    console.error(`Error emptying bucket ${bucket}:`, error);
    return { success: false, message: error.message };
  }
}

import { motion, AnimatePresence } from "framer-motion";
import { useState, useEffect, useTransition, useRef } from "react";
import { X, ChevronDown, Loader, Upload, Trash2 } from "lucide-react";
import { useUserItems, useUpdateUserItems } from "@/hooks/useUserItems";
import { useUpdateUserProfile } from "@/hooks/useUpdateUserProfile";
import { toast } from "@/lib/toast";
import ImageCropper from "./ImageCropper";
import { set } from "zod";

export default function EditProfileModal({ isOpen, explorerName, explorerBio, explorerImage, onClose }) {
  // Mengambil state dari zustand store kamu
  const [name, setName] = useState("");
  const [bio, setBio] = useState("");
  const [profileImageFile, setProfileImageFile] = useState(null);
  const [profileImagePreview, setProfileImagePreview] = useState(null);
  const [cropMode, setCropMode] = useState(false);
  const [tempImageSrc, setTempImageSrc] = useState(null);
  const [originalImageSrc, setOriginalImageSrc] = useState(null); // Store original full image
  const [cropPending, setCropPending] = useState(false); // Track if crop is in progress
  const [croppedBlob, setCroppedBlob] = useState(null); // Store cropped blob for re-editing
  const fileInputRef = useRef(null);
  const scrollRef = useRef(null);
  const [, startTransition] = useTransition();
  const [activeTab, setActiveTab] = useState("profile"); // "profile" | "banner" | "border"
  const [selectedBannerId, setSelectedBannerId] = useState(null);
  const [selectedBorderId, setSelectedBorderId] = useState(null);

  // Fetch user items
  const { data: items, isLoading: itemsLoading } = useUserItems();
  const updateProfileMutation = useUpdateUserProfile();
  const updateItemsMutation = useUpdateUserItems();

  // Sync nama saat modal dibuka
  useEffect(() => {
    if (isOpen) {
      startTransition(() => setName(explorerName || ""));
      setBio(explorerBio || "");
      setProfileImagePreview(explorerImage || null);
      setActiveTab("profile");
      setCroppedBlob(null);
      setOriginalImageSrc(null);
    }
  }, [isOpen, explorerName]);

  // Set current selections when items load
  useEffect(() => {
    if (items && isOpen) {
      setSelectedBannerId(items.activeSelection?.bannerId || null);
      setSelectedBorderId(items.activeSelection?.borderId || null);
    }
  }, [items, isOpen]);

  useEffect(() => {
  if (scrollRef.current) {
    scrollRef.current.scrollTo({
      top: 0,
      behavior: "smooth", // opsional (hapus kalau gak mau animasi)
    });
  }
}, [activeTab]);

  const handleSubmit = (e) => {
    e.preventDefault();
    
    // Guard against submitting while in crop mode
    if (cropMode || cropPending) {
      return;
    }
    
    if (!name.trim()) {
      toast.error("Error", "Nama tidak boleh kosong!");
      return;
    }

    // Only send fields that have content
    const updateData = {
      name: name.trim(),
      bio: bio.trim() || "", // Allow empty bio
    };

    if (profileImageFile) {
      updateData.profileImageFile = profileImageFile;
    }

    updateProfileMutation.mutate(
      updateData,
      {
        onSuccess: (result) => {
          toast.success(
            "Berhasil diperbarui!",
            "Profil berhasil diperbarui!",
          );
          setProfileImageFile(null);
          setProfileImagePreview(null);
          setCroppedBlob(null);
          setOriginalImageSrc(null);
          onClose();
        },
        onError: (err) => {
          toast.error("Gagal diperbarui!", `Terjadi kesalahan: ${err.message}`);
        },
      },
    );
  };

  const handleProfileFormSubmit = () => {
    const form = document.getElementById("profile-form");
    if (form) {
      form.dispatchEvent(new Event("submit", { bubbles: true }));
    }
  };

  const handleFileSelect = (e) => {
    const file = e.target.files?.[0];
    if (!file) return;

    // Validate file type
    if (!["image/jpeg", "image/png", "image/webp", "image/gif"].includes(file.type)) {
      toast.error("Hanya file gambar yang didukung (JPEG, PNG, WebP, GIF)");
      return;
    }

    // Validate file size (5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error("Ukuran file maksimal 5MB");
      return;
    }

    // Buat preview untuk cropper
    setCropPending(true); // Mark crop as pending
    const reader = new FileReader();
    reader.onload = (e) => {
      const src = e.target?.result;
      setOriginalImageSrc(src); // Store original full image
      setTempImageSrc(src);
      setCropMode(true);
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = (blob) => {
    // Convert blob ke File
    const file = new File([blob], "profile-crop.jpg", { type: "image/jpeg" });
    setProfileImageFile(file);

    // Preview dari blob
    const url = URL.createObjectURL(blob);
    setProfileImagePreview(url);

    // Store blob for potential re-editing
    setCroppedBlob(blob);

    // Keluar dari crop mode
    setCropMode(false);
    setCropPending(false);
    setTempImageSrc(null);
  };

  const handleCancelCrop = () => {
    setCropPending(false);
    setCropMode(false);
    setTempImageSrc(null);
    setCroppedBlob(null);
    setOriginalImageSrc(null);
    setProfileImageFile(null);
    setProfileImagePreview(null);
  };

  const handleEditCrop = () => {
    // Use original full image for re-editing instead of cropped blob
    if (originalImageSrc) {
      setTempImageSrc(originalImageSrc);
      setCropMode(true);
    }
  };

  const handleSaveItems = () => {
    updateItemsMutation.mutate(
      {
        activeBannerId: selectedBannerId,
        activeBorderId: selectedBorderId,
      },
      {
        onSuccess: () => {
          if (activeTab === "banner") {
            toast.success(
              "Berhasil diperbarui!",
              "Banner berhasil diperbarui!",
            );
          }
          if (activeTab === "border") {
            toast.success(
              "Berhasil diperbarui!",
              "Border berhasil diperbarui!",
            );
          }
        },
        onError: (err) =>
          toast.error("Gagal diperbarui!", `Terjadi kesalahan: ${err.message}`),
      },
    );
  };

  const banners = items?.banners || [];
  const borders = items?.borders || [];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm">
          {/* Backdrop Overlay */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0"
          />

          {/* Modal Content */}
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="eco-card relative w-full max-w-2xl h-[90vh] flex flex-col bg-white bg-grid-pattern z-10 overflow-hidden"
          >
            {/* Dekorasi Blob */}
            <div className="absolute -top-10 -right-10 w-32 h-32 bg-yellow rounded-full animate-blob opacity-50 pointer-events-none border-3 border-black shadow-hard" />

            <div className="flex justify-between items-center p-6 sm:p-8 pb-0 relative z-10">
              <h2 className="text-2xl font-display font-bold text-black uppercase tracking-wider">
                Edit Profil
              </h2>
              <button
                onClick={onClose}
                className="p-2 border-3 border-black rounded-xl bg-pink hover:bg-orange transition-colors shadow-hard active:translate-x-1 active:translate-y-1 active:shadow-none"
              >
                <X size={20} className="text-black" strokeWidth={3} />
              </button>
            </div>

            {/* Tabs Navigation */}
            <div className="flex gap-2 px-6 sm:px-8 pb-6 relative z-10 border-b-3 border-black">
              <button
                onClick={() => setActiveTab("profile")}
                className={`px-4 py-2 font-bold uppercase text-sm transition-all ${
                  activeTab === "profile"
                    ? "bg-green border-b-4 border-b-black text-black"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Profil
              </button>
              <button
                onClick={() => setActiveTab("banner")}
                className={`px-4 py-2 font-bold uppercase text-sm transition-all ${
                  activeTab === "banner"
                    ? "bg-orange border-b-4 border-b-black text-black"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Banner
              </button>
              <button
                onClick={() => setActiveTab("border")}
                className={`px-4 py-2 font-bold uppercase text-sm transition-all ${
                  activeTab === "border"
                    ? "bg-pink border-b-4 border-b-black text-black"
                    : "text-slate-600 hover:text-black"
                }`}
              >
                Border
              </button>
            </div>

            {/* Tab Content - Scrollable */}
            <div className="relative z-10 flex-1 overflow-y-auto p-6 sm:p-8 pt-4" ref={scrollRef}>
              {/* Profile Tab */}
              {activeTab === "profile" && (
                <form id="profile-form" onSubmit={handleSubmit} className="space-y-6">
                  <div className="space-y-2">
                    <label className="block font-bold text-black uppercase text-sm">
                      Nama Explorer
                    </label>
                    <input
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-body text-black placeholder-slate-400 focus:outline-none focus:ring-0 shadow-hard focus:bg-mint transition-colors"
                      placeholder="Masukkan nama barumu..."
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-black uppercase text-sm">
                      Bio / Tentang Kamu
                    </label>
                    <textarea
                      value={bio}
                      onChange={(e) => setBio(e.target.value)}
                      maxLength={500}
                      rows={3}
                      className="w-full px-4 py-3 bg-white border-3 border-black rounded-2xl font-body text-black placeholder-slate-400 focus:outline-none focus:ring-0 shadow-hard focus:bg-mint transition-colors resize-none"
                      placeholder="Ceritakan tentang dirimu... (max 500 karakter)"
                    />
                    <p className="text-xs text-slate-600 font-medium">
                      {bio.length} / 500
                    </p>
                  </div>

                  <div className="space-y-2">
                    <label className="block font-bold text-black uppercase text-sm">
                      Foto Profil
                    </label>
                    
                    {/* Image Cropper */}
                    {cropMode && tempImageSrc && (
                      <div className="mb-4">
                        <ImageCropper
                          imageSrc={tempImageSrc}
                          onCropComplete={handleCropComplete}
                          onCancel={handleCancelCrop}
                        />
                      </div>
                    )}
                    
                    {/* Image Preview - Circular (with Edit/Reset buttons only for cropped images) */}
                    {profileImagePreview && !cropMode && (
                      <div className="flex flex-col items-center gap-4 mb-4">
                        <div className="w-32 h-32 rounded-full border-4 border-black shadow-hard overflow-hidden bg-white">
                          <img
                            src={profileImagePreview}
                            alt="Preview"
                            className="w-full h-full object-cover"
                          />
                        </div>
                        {/* Reset & Edit Buttons - Only show after crop, not for existing profile image */}
                        {croppedBlob && (
                          <div className="flex gap-2 w-full">
                            <button
                              type="button"
                              onClick={handleCancelCrop}
                              className="flex-1 px-3 py-2 bg-white border-3 border-black text-black font-bold uppercase rounded-xl shadow-hard hover:bg-gray-100 transition-all text-sm"
                            >
                              Reset
                            </button>
                            <button
                              type="button"
                              onClick={handleEditCrop}
                              className="flex-1 px-3 py-2 bg-yellow border-3 border-black text-black font-bold uppercase rounded-xl shadow-hard hover:bg-orange transition-all text-sm"
                            >
                              Edit
                            </button>
                          </div>
                        )}
                      </div>
                    )}
                    
                    {/* Upload Button */}
                    {!profileImageFile && !cropMode && (
                      <button
                        type="button"
                        onClick={() => fileInputRef.current?.click()}
                        className="w-full flex items-center justify-center gap-2 px-4 py-4 bg-blue border-3 border-black border-dashed text-black bg-yellow hover:bg-orange backdrop-blur-xl bg font-bold uppercase rounded-2xl shadow-hard hover:bg-cyan transition-all"
                      >
                        <Upload size={20} />
                        Pilih Foto Profil
                      </button>
                    )}

                    {/* Hidden File Input */}
                    <input
                      ref={fileInputRef}
                      type="file"
                      accept="image/*"
                      onChange={handleFileSelect}
                      className="hidden"
                    />
                    
                    {/* <p className="text-xs text-slate-600 font-medium">
                      Format: JPG, PNG, GIF (Max 5MB) • Foto akan dipotong menjadi lingkaran
                    </p> */}

                    {/* Delete Profile Image Button */}
                    {explorerImage && !profileImageFile && (
                      <button
                        type="button"
                        onClick={() => {
                          // Delete profile image with name and bio to keep them
                          const updateData = {
                            name: name.trim(),
                            bio: bio.trim() || "",
                            profileImageFile: null, // Signal to delete
                          };
                          
                          updateProfileMutation.mutate(
                            updateData,
                            {
                              onSuccess: () => {
                                setProfileImagePreview(null);
                                toast.success(
                                  "Berhasil dihapus!",
                                  "Foto profil kembali ke default!",
                                );
                              },
                              onError: (err) => {
                                toast.error("Gagal dihapus!", `Terjadi kesalahan: ${err.message}`);
                              },
                            },
                          );
                        }}
                        disabled={updateProfileMutation.isPending}
                        className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-red-500 hover:bg-red-600 border-3 border-black text-white font-bold uppercase rounded-2xl shadow-hard disabled:opacity-50 transition-all"
                      >
                        {updateProfileMutation.isPending ? (
                          <>
                            <Loader className="w-4 h-4 animate-spin" />
                            Menghapus...
                          </>
                        ) : (
                          <>
                            <Trash2 size={18} />
                            Hapus Foto Profil (Kembali ke Default)
                          </>
                        )}
                      </button>
                    )}
                  </div>
                </form>
              )}

              {/* Banner Tab */}
              {activeTab === "banner" && (
                <div className="space-y-6">
                  {itemsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-8 h-8 animate-spin text-black" />
                      <span className="ml-3 font-bold text-black">
                        Memuat Banner...
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Default Banner Option */}
                      <motion.button
                        onClick={() => setSelectedBannerId(null)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-2xl border-3 transition-all text-left ${
                          selectedBannerId === null
                            ? "border-black bg-orange/80 shadow-hard"
                            : "border-black bg-white hover:bg-slate-50 shadow-hard"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-black uppercase">
                              📸 Default Banner
                            </h3>
                            <p className="text-xs text-slate-600 mt-1">
                              Tampilan banner standar
                            </p>
                          </div>
                          {selectedBannerId === null && (
                            <span className="text-xs font-bold bg-orange-300 text-black px-3 py-1 rounded-lg whitespace-nowrap ml-2">
                              ✓ Dipilih
                            </span>
                          )}
                        </div>
                      </motion.button>

                      {/* Custom Banners */}
                      {banners.length === 0 ? (
                        <div className="text-center py-8 border-3 border-dashed border-slate-300 rounded-2xl">
                          <p className="font-bold text-slate-500">
                            Kamu belum memiliki banner custom
                          </p>
                          <p className="text-sm text-slate-400 mt-2">
                            Mainkan misi atau beli dari shop untuk koleksi banner!
                          </p>
                        </div>
                      ) : (
                        <div
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-full overflow-y-auto p-2"
                        >
                          {banners.map((banner) => (
                            <motion.button
                              key={banner.id}
                              onClick={() => setSelectedBannerId(banner.id)}
                              whileHover={{ scale: 1.01 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-4 rounded-2xl border-3 transition-all text-left ${
                                selectedBannerId === banner.id
                                  ? "border-black bg-orange/80 shadow-hard"
                                  : "border-black bg-white hover:bg-slate-50 shadow-hard"
                              }`}
                            >
                              {banner.content && (
                                <img
                                  src={banner.content}
                                  alt={banner.name}
                                  className="w-full h-24 object-cover rounded-lg mb-3 border-2 border-black"
                                />
                              )}
                              <h3 className="font-bold text-black uppercase">
                                {banner.name}
                              </h3>
                              <p className="text-xs text-slate-600 mt-1">
                                {banner.description}
                              </p>
                              <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded-lg">
                                  {banner.rarity}
                                </span>
                                {selectedBannerId === banner.id && (
                                  <span className="text-xs font-bold bg-orange-300 text-black px-2 py-1 rounded-lg">
                                    ✓ Dipilih
                                  </span>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}

              {/* Border Tab */}
              {activeTab === "border" && (
                <div className="space-y-6">
                  {itemsLoading ? (
                    <div className="flex items-center justify-center py-8">
                      <Loader className="w-8 h-8 animate-spin text-black" />
                      <span className="ml-3 font-bold text-black">
                        Memuat Border...
                      </span>
                    </div>
                  ) : (
                    <>
                      {/* Default Border Option */}
                      <motion.button
                        onClick={() => setSelectedBorderId(null)}
                        whileHover={{ scale: 1.01 }}
                        whileTap={{ scale: 0.98 }}
                        className={`w-full p-4 rounded-2xl border-3 transition-all text-left ${
                          selectedBorderId === null
                            ? "border-black bg-pink/80 shadow-hard"
                            : "border-black bg-white hover:bg-slate-50 shadow-hard"
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <h3 className="font-bold text-black uppercase">
                              ⭐ Default Border
                            </h3>
                            <p className="text-xs text-slate-600 mt-1">
                              Tampilan border standar (garis hitam)
                            </p>
                          </div>
                          {selectedBorderId === null && (
                            <span className="text-xs font-bold bg-pink-300 text-black px-3 py-1 rounded-lg whitespace-nowrap ml-2">
                              ✓ Dipilih
                            </span>
                          )}
                        </div>
                      </motion.button>

                      {/* Custom Borders */}
                      {borders.length === 0 ? (
                        <div className="text-center py-8 border-3 border-dashed border-slate-300 rounded-2xl">
                          <p className="font-bold text-slate-500">
                            Kamu belum memiliki border custom
                          </p>
                          <p className="text-sm text-slate-400 mt-2">
                            Mainkan misi atau beli dari shop untuk koleksi border!
                          </p>
                        </div>
                      ) : (
                        <div
                          className="grid grid-cols-1 sm:grid-cols-2 gap-4 max-h-full overflow-y-auto p-2"
                        >
                          {borders.map((border) => (
                            <motion.button
                              key={border.id}
                              onClick={() => setSelectedBorderId(border.id)}
                              whileHover={{ scale: 1.02 }}
                              whileTap={{ scale: 0.98 }}
                              className={`p-4 rounded-2xl border-3 transition-all text-left ${
                                selectedBorderId === border.id
                                  ? "border-black bg-pink/80 shadow-hard"
                                  : "border-black bg-white hover:bg-slate-50 shadow-hard"
                              }`}
                            >
                              {border.content && (
                                <img
                                  src={border.content}
                                  alt={border.name}
                                  className="w-24 h-24 object-cover rounded-lg mb-3 mx-auto border-2 border-black"
                                />
                              )}
                              <h3 className="font-bold text-black uppercase">
                                {border.name}
                              </h3>
                              <p className="text-xs text-slate-600 mt-1">
                                {border.description}
                              </p>
                              <div className="mt-3 flex items-center justify-between">
                                <span className="text-xs font-bold bg-slate-200 px-2 py-1 rounded-lg">
                                  {border.rarity}
                                </span>
                                {selectedBorderId === border.id && (
                                  <span className="text-xs font-bold bg-pink-300 text-black px-2 py-1 rounded-lg">
                                    ✓ Dipilih
                                  </span>
                                )}
                              </div>
                            </motion.button>
                          ))}
                        </div>
                      )}
                    </>
                  )}
                </div>
              )}
            </div>

            {/* Buttons - Fixed at Bottom */}
            <div className="shrink-0 border-t-3 border-black p-6 sm:p-8 relative z-10">
              {/* Profile Tab Buttons */}
              {activeTab === "profile" && !cropMode && (
                <div className="flex gap-4">
                  <button
                    type="button"
                    onClick={onClose}
                    disabled={updateProfileMutation.isPending || cropPending}
                    className="flex-1 py-3 px-4 bg-white border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-gray-100 disabled:opacity-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  >
                    Batal
                  </button>
                  <button
                    type="button"
                    onClick={handleProfileFormSubmit}
                    disabled={updateProfileMutation.isPending || cropPending}
                    className="flex-1 py-3 px-4 bg-green border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-mint disabled:opacity-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {updateProfileMutation.isPending ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : cropPending ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Tunggu Crop...
                      </>
                    ) : (
                      "Simpan Profil"
                    )}
                  </button>
                </div>
              )}

              {/* Banner Tab Buttons */}
              {activeTab === "banner" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="flex-1 py-3 px-4 bg-white border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleSaveItems}
                    disabled={updateItemsMutation.isPending}
                    className="flex-1 py-3 px-4 bg-orange border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-orange-300 disabled:opacity-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {updateItemsMutation.isPending ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Pilihan"
                    )}
                  </button>
                </div>
              )}

              {/* Border Tab Buttons */}
              {activeTab === "border" && (
                <div className="flex gap-4">
                  <button
                    onClick={() => setActiveTab("profile")}
                    className="flex-1 py-3 px-4 bg-white border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-gray-100 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all"
                  >
                    Kembali
                  </button>
                  <button
                    onClick={handleSaveItems}
                    disabled={updateItemsMutation.isPending}
                    className="flex-1 py-3 px-4 bg-pink border-3 border-black text-black font-bold uppercase rounded-2xl shadow-hard hover:bg-pink-300 disabled:opacity-50 active:translate-x-1 active:translate-y-1 active:shadow-none transition-all flex items-center justify-center gap-2"
                  >
                    {updateItemsMutation.isPending ? (
                      <>
                        <Loader className="w-4 h-4 animate-spin" />
                        Menyimpan...
                      </>
                    ) : (
                      "Simpan Pilihan"
                    )}
                  </button>
                </div>
              )}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}

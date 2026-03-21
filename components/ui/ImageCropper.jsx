"use client";

import { useState, useRef, useCallback } from "react";
import Crop from "react-easy-crop";
import { ChevronLeft, Check, RotateCw, ZoomIn, ZoomOut } from "lucide-react";

/**
 * Image cropper using react-easy-crop for circular profile pictures
 * Allows user to position, zoom, and rotate the image
 */
export default function ImageCropper({ imageSrc, onCropComplete, onCancel }) {
  const [crop, setCrop] = useState({ x: 0, y: 0 });
  const [zoom, setZoom] = useState(1);
  const [rotation, setRotation] = useState(0);
  // Store the exact pixel area reported by the library
  const croppedAreaPixelsRef = useRef(null);

  const onCropChange = (location) => {
    setCrop(location);
  };

  // react-easy-crop calls this whenever the crop/zoom/rotation changes
  // croppedAreaPixels = { x, y, width, height } in the *natural* image pixel space
  const onCropCompleteCallback = useCallback((_croppedArea, croppedAreaPixels) => {
    croppedAreaPixelsRef.current = croppedAreaPixels;
  }, []);

  const createCircularCrop = useCallback(async () => {
    try {
      const pixelCrop = croppedAreaPixelsRef.current;
      if (!pixelCrop) return;

      const image = new Image();
      // Allow reading cross-origin images when the server sends the header
      image.crossOrigin = "anonymous";
      image.src = imageSrc;

      image.onload = () => {
        const SIZE = 512;
        const canvas = document.createElement("canvas");
        canvas.width = SIZE;
        canvas.height = SIZE;
        const ctx = canvas.getContext("2d");
        ctx.clearRect(0, 0, SIZE, SIZE);

        // ── Step 1: render the rotated source onto an offscreen canvas ──────
        // We need to account for rotation first so we can derive correct
        // source coordinates.  react-easy-crop's croppedAreaPixels is already
        // in the rotated image coordinate space when rotation !== 0, but the
        // simplest approach is to rotate the whole source image on a temp
        // canvas and then cut the rect from that.

        const radians = (rotation * Math.PI) / 180;
        const sin = Math.abs(Math.sin(radians));
        const cos = Math.abs(Math.cos(radians));
        const rotW = Math.round(image.width * cos + image.height * sin);
        const rotH = Math.round(image.width * sin + image.height * cos);

        const rotCanvas = document.createElement("canvas");
        rotCanvas.width = rotW;
        rotCanvas.height = rotH;
        const rotCtx = rotCanvas.getContext("2d");
        rotCtx.translate(rotW / 2, rotH / 2);
        rotCtx.rotate(radians);
        rotCtx.drawImage(image, -image.width / 2, -image.height / 2);

        // ── Step 2: cut the exact crop rectangle from the rotated canvas ────
        ctx.drawImage(
          rotCanvas,
          pixelCrop.x,
          pixelCrop.y,
          pixelCrop.width,
          pixelCrop.height,
          0,
          0,
          SIZE,
          SIZE
        );

        // ── Step 3: apply a circular mask ───────────────────────────────────
        ctx.globalCompositeOperation = "destination-in";
        ctx.beginPath();
        ctx.arc(SIZE / 2, SIZE / 2, SIZE / 2, 0, Math.PI * 2);
        ctx.fill();

        // ── Step 4: export ──────────────────────────────────────────────────
        canvas.toBlob(
          (blob) => {
            onCropComplete(blob);
          },
          "image/jpeg",
          0.95
        );
      };

      image.onerror = () => {};
    } catch (error) {
      console.error(error);
    }
  }, [imageSrc, rotation, onCropComplete]);

  const handleReset = () => {
    setCrop({ x: 0, y: 0 });
    setZoom(1);
    setRotation(0);
  };

  return (
    <div className="space-y-6 p-2">
      {/* Crop Area */}
      <div className="relative bg-white border-4 border-black rounded-3xl overflow-hidden shadow-hard w-full md:h-95 h-70">
        <Crop
          image={imageSrc}
          crop={crop}
          zoom={zoom}
          rotation={rotation}
          aspect={1}
          cropShape="round"
          showGrid={false}
          onCropChange={onCropChange}
          onCropComplete={onCropCompleteCallback}
          onZoomChange={setZoom}
          onRotationChange={setRotation}
          restrictPosition={false}
        />
      </div>

      {/* Controls */}
      <div className="space-y-4">
        {/* Zoom Controls */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-black uppercase">
              Zoom
            </label>
            <span className="text-sm font-bold text-black">
              {Math.round(zoom * 100)}%
            </span>
          </div>
          <input
            type="range"
            min="1"
            max="3"
            step="0.1"
            value={zoom}
            onChange={(e) => setZoom(parseFloat(e.target.value))}
            className="w-full"
          />
          <div className="flex gap-2 mt-2">
            <button
              onClick={() => setZoom(Math.max(1, zoom - 0.2))}
              className="flex-1 px-2 py-2 bg-white border-2 border-black text-black font-bold rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-1"
            >
              <ZoomOut size={16} />
              <span className="text-xs">-</span>
            </button>
            <button
              onClick={() => setZoom(Math.min(3, zoom + 0.2))}
              className="flex-1 px-2 py-2 bg-white border-2 border-black text-black font-bold rounded-lg hover:bg-gray-100 transition-all flex items-center justify-center gap-1"
            >
              <ZoomIn size={16} />
              <span className="text-xs">+</span>
            </button>
          </div>
        </div>

        {/* Rotation Slider */}
        <div>
          <div className="flex items-center justify-between mb-2">
            <label className="block text-sm font-bold text-black uppercase">
              Rotate
            </label>
            <span className="text-sm font-bold text-black">{rotation}°</span>
          </div>
          <input
            type="range"
            min="0"
            max="360"
            step="1"
            value={rotation}
            onChange={(e) => setRotation(parseInt(e.target.value))}
            className="w-full"
          />
        </div>

        {/* Reset Button */}
        <button
          onClick={handleReset}
          className="w-full flex items-center justify-center gap-2 px-4 py-2 bg-yellow border-3 border-black text-black font-bold uppercase rounded-xl shadow-hard hover:bg-orange transition-all text-sm"
        >
          <RotateCw size={16} />
          Reset
        </button>
      </div>

      {/* Action Buttons */}
      <div className="flex gap-4">
        <button
          onClick={onCancel}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-white border-3 border-black text-black font-bold uppercase rounded-xl shadow-hard hover:bg-gray-100 transition-all"
        >
          <ChevronLeft size={18} />
          Kembali
        </button>
        <button
          onClick={createCircularCrop}
          className="flex-1 flex items-center justify-center gap-2 px-4 py-3 bg-green border-3 border-black text-black font-bold uppercase rounded-xl shadow-hard hover:bg-mint transition-all"
        >
          <Check size={18} />
          Gunakan
        </button>
      </div>

      {/* Info */}
      <p className="text-xs text-slate-600 font-medium text-center">
        Drag untuk memposisikan • Gunakan slider untuk zoom dan rotasi
      </p>
    </div>
  );
}

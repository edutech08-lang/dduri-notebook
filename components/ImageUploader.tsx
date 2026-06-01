"use client";

import { useRef, useState } from "react";

interface ImageUploaderProps {
  onImageSelect: (file: File) => void;
  preview: string | null;
}

/**
 * 이미지 업로드 컴포넌트 (드래그 앤 드롭 지원)
 */
export default function ImageUploader({ onImageSelect, preview }: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState(false);

  /** 파일 선택 처리 */
  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) onImageSelect(file);
  }

  /** 드래그 오버 처리 */
  function handleDragOver(e: React.DragEvent) {
    e.preventDefault();
    setDragging(true);
  }

  /** 드래그 리브 처리 */
  function handleDragLeave() {
    setDragging(false);
  }

  /** 드롭 처리 */
  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file && file.type.startsWith("image/")) {
      onImageSelect(file);
    }
  }

  return (
    <div
      onClick={() => inputRef.current?.click()}
      onDragOver={handleDragOver}
      onDragLeave={handleDragLeave}
      onDrop={handleDrop}
      className={`relative cursor-pointer rounded-2xl border-4 border-dashed transition-all duration-200 flex flex-col items-center justify-center min-h-48 overflow-hidden
        ${dragging
          ? "border-yellow-500 bg-yellow-100"
          : "border-yellow-300 bg-yellow-50 hover:bg-yellow-100"
        }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={handleFileChange}
      />

      {preview ? (
        <div className="relative w-full">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={preview}
            alt="업로드된 문제"
            className="w-full max-h-72 object-contain rounded-xl"
          />
          <div className="absolute inset-0 flex items-center justify-center bg-black/30 opacity-0 hover:opacity-100 transition-opacity rounded-xl">
            <p className="text-white font-bold text-sm">클릭하여 변경</p>
          </div>
        </div>
      ) : (
        <div className="flex flex-col items-center gap-3 p-8">
          <span className="text-5xl">🐹</span>
          <p className="font-bold text-yellow-700 text-center">
            문제 사진을 여기에 드래그하거나
            <br />
            클릭하여 업로드하세요
          </p>
          <p className="text-yellow-500 text-xs">JPG, PNG, WEBP 지원</p>
        </div>
      )}
    </div>
  );
}

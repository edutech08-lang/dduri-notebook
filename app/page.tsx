"use client";

import { useState } from "react";
import SubjectSelector from "@/components/SubjectSelector";
import ImageUploader from "@/components/ImageUploader";
import ProblemCountSelector from "@/components/ProblemCountSelector";
import ResultsDisplay, { AnalysisResult } from "@/components/ResultsDisplay";

/**
 * 뚜리의 오답노트 메인 페이지
 */
export default function Home() {
  const [subject, setSubject] = useState("");
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [count, setCount] = useState(5);
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<AnalysisResult | null>(null);
  const [error, setError] = useState<string | null>(null);

  /** 이미지 선택 처리 */
  function handleImageSelect(file: File) {
    setImageFile(file);
    setResult(null);
    setError(null);
    const reader = new FileReader();
    reader.onload = (e) => setImagePreview(e.target?.result as string);
    reader.readAsDataURL(file);
  }

  /** 문제 생성 요청 */
  async function handleGenerate() {
    if (!imageFile) {
      setError("문제 사진을 업로드해주세요! 🐹");
      return;
    }
    if (!subject) {
      setError("과목을 선택해주세요! 🐹");
      return;
    }

    setLoading(true);
    setError(null);
    setResult(null);

    try {
      const formData = new FormData();
      formData.append("image", imageFile);
      formData.append("subject", subject);
      formData.append("count", String(count));

      const res = await fetch("/api/analyze", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? "오류가 발생했습니다.");
      }

      setResult(data);
      setTimeout(() => {
        document.getElementById("results")?.scrollIntoView({ behavior: "smooth" });
      }, 100);
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : "알 수 없는 오류가 발생했습니다.";
      setError(message);
    } finally {
      setLoading(false);
    }
  }

  return (
    <main className="min-h-screen bg-yellow-50 pb-16">
      {/* 헤더 */}
      <header className="bg-yellow-400 shadow-md py-5 px-4 text-center">
        <div className="flex items-center justify-center gap-3">
          <span className="text-4xl">🐹</span>
          <div>
            <h1 className="text-2xl font-extrabold text-yellow-900">뚜리의 오답노트</h1>
            <p className="text-yellow-800 text-xs mt-0.5">문제 사진으로 AI가 유사 문제를 만들어드려요</p>
          </div>
          <span className="text-4xl">🐹</span>
        </div>
      </header>

      <div className="max-w-2xl mx-auto px-4 mt-8 space-y-8">
        {/* 과목 선택 */}
        <section className="bg-white rounded-2xl border-2 border-yellow-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🐹</span>
            <h2 className="font-bold text-yellow-800">과목 선택</h2>
          </div>
          <SubjectSelector selected={subject} onChange={setSubject} />
        </section>

        {/* 이미지 업로드 */}
        <section className="bg-white rounded-2xl border-2 border-yellow-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">📸</span>
            <h2 className="font-bold text-yellow-800">문제 사진 업로드</h2>
          </div>
          <ImageUploader onImageSelect={handleImageSelect} preview={imagePreview} />
        </section>

        {/* 문제 개수 선택 */}
        <section className="bg-white rounded-2xl border-2 border-yellow-200 p-6 shadow-sm">
          <div className="flex items-center gap-2 mb-4">
            <span className="text-xl">🔢</span>
            <h2 className="font-bold text-yellow-800">유사 문제 개수 선택</h2>
          </div>
          <ProblemCountSelector count={count} onChange={setCount} />
          <p className="text-center text-xs text-yellow-500 mt-3">
            * 빈칸 채우기 문제는 항상 10개 생성됩니다
          </p>
        </section>

        {/* 에러 메시지 */}
        {error && (
          <div className="bg-red-50 border-2 border-red-200 rounded-2xl p-4 text-center">
            <p className="text-red-600 font-bold text-sm">{error}</p>
          </div>
        )}

        {/* 생성 버튼 */}
        <button
          onClick={handleGenerate}
          disabled={loading}
          className={`w-full py-4 rounded-2xl font-extrabold text-lg shadow-lg transition-all duration-200
            ${
              loading
                ? "bg-yellow-200 text-yellow-400 cursor-not-allowed"
                : "bg-yellow-400 hover:bg-yellow-500 text-yellow-900 hover:scale-[1.02] active:scale-100"
            }`}
        >
          {loading ? (
            <span className="flex items-center justify-center gap-2">
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24" fill="none">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8z" />
              </svg>
              기니피그가 문제를 만들고 있어요...
            </span>
          ) : (
            <span>🐹 문제 생성하기 🐹</span>
          )}
        </button>

        {/* 결과 */}
        {result && (
          <div id="results" className="pt-2">
            <div className="flex items-center gap-2 mb-5">
              <span className="text-2xl">🎉</span>
              <h2 className="text-xl font-extrabold text-yellow-800">생성 완료!</h2>
            </div>
            <ResultsDisplay result={result} />
          </div>
        )}
      </div>

      {/* 푸터 */}
      <footer className="text-center mt-16 text-yellow-400 text-xs">
        🐹 뚜리의 오답노트 · 중학교 5과목 AI 문제 생성
      </footer>
    </main>
  );
}

"use client";

import { useState } from "react";

interface SimilarProblem {
  question: string;
  options?: string[];
  answer: string;
  explanation: string;
}

interface BlankProblem {
  question: string;
  answer: string;
}

export interface AnalysisResult {
  topic: string;
  conceptSummary: string;
  similarProblems: SimilarProblem[];
  blankProblems: BlankProblem[];
}

interface ResultsDisplayProps {
  result: AnalysisResult;
}

/**
 * AI 분석 결과 표시 컴포넌트
 */
export default function ResultsDisplay({ result }: ResultsDisplayProps) {
  const [revealedAnswers, setRevealedAnswers] = useState<Set<string>>(new Set());

  /** 정답 공개/숨기기 토글 */
  function toggleAnswer(key: string) {
    setRevealedAnswers((prev) => {
      const next = new Set(prev);
      if (next.has(key)) next.delete(key);
      else next.add(key);
      return next;
    });
  }

  return (
    <div className="space-y-8">
      {/* 주제 및 개념 요약 */}
      <div className="bg-white rounded-2xl border-2 border-yellow-300 p-6 shadow-sm">
        <div className="flex items-center gap-2 mb-3">
          <span className="text-2xl">🐹</span>
          <h2 className="text-lg font-bold text-yellow-800">핵심 주제</h2>
        </div>
        <p className="font-bold text-yellow-900 text-base mb-4">{result.topic}</p>
        <div className="flex items-center gap-2 mb-2">
          <span className="text-xl">📚</span>
          <h3 className="font-bold text-yellow-700 text-sm">중점 개념 요약</h3>
        </div>
        <p className="text-gray-700 text-sm leading-relaxed whitespace-pre-line">
          {result.conceptSummary}
        </p>
      </div>

      {/* 유사 문제 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">📝</span>
          <h2 className="text-lg font-bold text-yellow-800">
            유사 문제 ({result.similarProblems.length}개)
          </h2>
        </div>
        <div className="space-y-4">
          {result.similarProblems.map((problem, idx) => (
            <div
              key={idx}
              className="bg-white rounded-2xl border-2 border-yellow-200 p-5 shadow-sm"
            >
              <p className="font-bold text-yellow-900 text-sm mb-1 text-yellow-500">
                문제 {idx + 1}
              </p>
              <p className="text-gray-800 text-sm mb-3 leading-relaxed">{problem.question}</p>

              {problem.options && problem.options.length > 0 && (
                <ul className="space-y-1 mb-3">
                  {problem.options.map((opt, i) => (
                    <li key={i} className="text-gray-700 text-sm pl-2">
                      {opt}
                    </li>
                  ))}
                </ul>
              )}

              <button
                onClick={() => toggleAnswer(`sim-${idx}`)}
                className="text-xs px-3 py-1.5 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 font-bold hover:bg-yellow-200 transition-colors"
              >
                {revealedAnswers.has(`sim-${idx}`) ? "정답 숨기기" : "정답 보기"} 🐹
              </button>

              {revealedAnswers.has(`sim-${idx}`) && (
                <div className="mt-3 p-3 bg-yellow-50 rounded-xl border border-yellow-200">
                  <p className="text-sm font-bold text-yellow-800">
                    정답: <span className="text-yellow-600">{problem.answer}</span>
                  </p>
                  <p className="text-xs text-gray-600 mt-1 leading-relaxed">
                    {problem.explanation}
                  </p>
                </div>
              )}
            </div>
          ))}
        </div>
      </div>

      {/* 빈칸 채우기 */}
      <div>
        <div className="flex items-center gap-2 mb-4">
          <span className="text-2xl">✏️</span>
          <h2 className="text-lg font-bold text-yellow-800">빈칸 채우기 (10개)</h2>
        </div>
        <div className="bg-white rounded-2xl border-2 border-yellow-200 p-5 shadow-sm space-y-4">
          {result.blankProblems.map((problem, idx) => (
            <div key={idx} className="border-b border-yellow-100 last:border-0 pb-3 last:pb-0">
              <p className="text-gray-800 text-sm leading-relaxed mb-2">
                <span className="font-bold text-yellow-600 mr-1">{idx + 1}.</span>
                {problem.question}
              </p>
              <button
                onClick={() => toggleAnswer(`blank-${idx}`)}
                className="text-xs px-3 py-1 rounded-full bg-yellow-100 border border-yellow-300 text-yellow-800 font-bold hover:bg-yellow-200 transition-colors"
              >
                {revealedAnswers.has(`blank-${idx}`) ? "숨기기" : "정답"} 🐹
              </button>
              {revealedAnswers.has(`blank-${idx}`) && (
                <span className="ml-2 text-sm font-bold text-yellow-700">
                  → {problem.answer}
                </span>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

"use client";

/** 선택 가능한 문제 개수 */
const COUNTS = [3, 5, 7, 10];

interface ProblemCountSelectorProps {
  count: number;
  onChange: (count: number) => void;
}

/**
 * 생성할 유사 문제 개수 선택 컴포넌트
 */
export default function ProblemCountSelector({ count, onChange }: ProblemCountSelectorProps) {
  return (
    <div className="flex items-center gap-3 flex-wrap justify-center">
      <span className="font-bold text-yellow-800 text-sm">유사 문제 개수:</span>
      {COUNTS.map((n) => (
        <button
          key={n}
          onClick={() => onChange(n)}
          className={`w-10 h-10 rounded-full font-bold text-sm border-2 transition-all duration-200
            ${
              count === n
                ? "bg-yellow-400 border-yellow-500 text-yellow-900 scale-110 shadow-md"
                : "bg-white border-yellow-300 text-yellow-700 hover:bg-yellow-100"
            }`}
        >
          {n}
        </button>
      ))}
    </div>
  );
}

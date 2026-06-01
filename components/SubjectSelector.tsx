"use client";

/** 과목 목록 */
const SUBJECTS = [
  { id: "korean", label: "국어", emoji: "📖" },
  { id: "english", label: "영어", emoji: "🔤" },
  { id: "math", label: "수학", emoji: "📐" },
  { id: "science", label: "과학", emoji: "🔬" },
  { id: "history", label: "역사", emoji: "🏛️" },
];

interface SubjectSelectorProps {
  selected: string;
  onChange: (subject: string) => void;
}

/**
 * 과목 선택 버튼 컴포넌트
 */
export default function SubjectSelector({ selected, onChange }: SubjectSelectorProps) {
  return (
    <div className="flex flex-wrap gap-3 justify-center">
      {SUBJECTS.map((subject) => (
        <button
          key={subject.id}
          onClick={() => onChange(subject.id)}
          className={`flex items-center gap-2 px-5 py-3 rounded-full font-bold text-sm border-2 transition-all duration-200 shadow-sm
            ${
              selected === subject.id
                ? "bg-yellow-400 border-yellow-500 text-yellow-900 scale-105 shadow-md"
                : "bg-white border-yellow-300 text-yellow-800 hover:bg-yellow-100 hover:scale-105"
            }`}
        >
          <span className="text-lg">{subject.emoji}</span>
          {subject.label}
        </button>
      ))}
    </div>
  );
}

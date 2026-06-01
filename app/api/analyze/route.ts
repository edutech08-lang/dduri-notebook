import { NextRequest, NextResponse } from "next/server";
import OpenAI from "openai";

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

/** 과목별 한국어 이름 */
const SUBJECT_NAMES: Record<string, string> = {
  korean: "국어",
  english: "영어",
  math: "수학",
  science: "과학",
  history: "역사",
};

/**
 * 이미지를 분석하고 유사 문제 및 빈칸 문제를 생성하는 API
 * @route POST /api/analyze
 */
export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData();
    const imageFile = formData.get("image") as File | null;
    const subject = formData.get("subject") as string;
    const count = parseInt(formData.get("count") as string, 10) || 5;

    if (!imageFile) {
      return NextResponse.json({ error: "이미지가 없습니다." }, { status: 400 });
    }
    if (!subject || !SUBJECT_NAMES[subject]) {
      return NextResponse.json({ error: "과목을 선택해주세요." }, { status: 400 });
    }

    // 이미지를 base64로 변환
    const arrayBuffer = await imageFile.arrayBuffer();
    const base64 = Buffer.from(arrayBuffer).toString("base64");
    const mimeType = imageFile.type || "image/jpeg";

    const subjectName = SUBJECT_NAMES[subject];

    const prompt = `당신은 중학교 ${subjectName} 선생님입니다. 아래 문제 이미지를 분석하고 다음 형식으로 JSON을 반환하세요.

응답은 반드시 아래 JSON 형식만 반환하고, 다른 텍스트는 포함하지 마세요:

{
  "topic": "문제의 핵심 주제 (한 문장)",
  "conceptSummary": "관련 단원의 중점 개념 요약 (3~5문장)",
  "similarProblems": [
    {
      "question": "문제",
      "options": ["①선택지1", "②선택지2", "③선택지3", "④선택지4", "⑤선택지5"],
      "answer": "정답 (예: ③)",
      "explanation": "해설"
    }
  ],
  "blankProblems": [
    {
      "question": "빈칸이 포함된 문장 (빈칸은 ___로 표시)",
      "answer": "빈칸 정답"
    }
  ]
}

규칙:
- similarProblems는 정확히 ${count}개 생성
- blankProblems는 정확히 10개 생성
- 업로드한 문제와 유사한 유형과 난이도로 출제
- 중학교 수준에 맞게 작성
- 모든 내용은 한국어로 작성`;

    const response = await openai.chat.completions.create({
      model: "gpt-4o",
      messages: [
        {
          role: "user",
          content: [
            {
              type: "image_url",
              image_url: {
                url: `data:${mimeType};base64,${base64}`,
                detail: "high",
              },
            },
            {
              type: "text",
              text: prompt,
            },
          ],
        },
      ],
      max_tokens: 4000,
    });

    const content = response.choices[0]?.message?.content ?? "";

    // JSON 파싱
    const jsonMatch = content.match(/\{[\s\S]*\}/);
    if (!jsonMatch) {
      return NextResponse.json(
        { error: "AI 응답을 파싱할 수 없습니다. 다시 시도해주세요." },
        { status: 500 }
      );
    }

    const result = JSON.parse(jsonMatch[0]);
    return NextResponse.json(result);
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : "알 수 없는 오류";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

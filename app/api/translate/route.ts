import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const { texts, targetLang, targetLangName } = await req.json() as {
    texts: string[];
    targetLang: string;
    targetLangName: string;
  };

  if (!texts?.length) return NextResponse.json({ translations: [] });

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    return NextResponse.json({ error: "Translation service not configured" }, { status: 503 });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        response_format: { type: "json_object" },
        messages: [
          {
            role: "system",
            content: `You are a professional medical website translator. Translate the given texts to ${targetLangName} (language code: ${targetLang}).

Rules:
- Preserve capitalization style (ALL CAPS stays ALL CAPS, Title Case stays Title Case)
- Keep medical/technical terms accurate
- Keep numbers, symbols, URLs, and email addresses unchanged
- Keep punctuation style consistent
- Respond ONLY with JSON in this exact format: { "t": ["translation1", "translation2", ...] }
- The output array must have the EXACT same length as the input array
- Preserve any leading/trailing whitespace in each string`,
          },
          {
            role: "user",
            content: JSON.stringify({ texts }),
          },
        ],
        max_tokens: 4000,
        temperature: 0.1,
      }),
    });

    if (!response.ok) {
      const err = await response.text();
      console.error("OpenAI translate error:", err);
      return NextResponse.json({ error: "Translation failed" }, { status: 500 });
    }

    const data = await response.json();
    const raw: string = data.choices?.[0]?.message?.content ?? "{}";
    const parsed = JSON.parse(raw);
    const translations: string[] = parsed.t ?? [];

    // Safety: ensure same length
    while (translations.length < texts.length) translations.push(texts[translations.length]);

    return NextResponse.json({ translations });
  } catch (err) {
    console.error("Translate route error:", err);
    return NextResponse.json({ error: "Internal error" }, { status: 500 });
  }
}

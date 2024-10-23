import { extractJSON } from '@/lib/utils';
import { GoogleGenerativeAI } from '@google/generative-ai';
import { kv } from '@vercel/kv';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction: process.env.GEMINI_PROMPT!,
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function POST(req: NextRequest) {
  const { genres, keys } = await req.json();

  const isAuraExist = await kv.hgetall(keys);
  if (isAuraExist) {
    return NextResponse.json({
      message: isAuraExist
    })
  }

  const session = model.startChat({
    generationConfig,
  });

  const result = await session.sendMessage(genres);

  const cleanedJson = extractJSON(result.response.text())
  await kv.hset(keys, cleanedJson)

  return NextResponse.json({
    message: cleanedJson
  });
}

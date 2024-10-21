import { GoogleGenerativeAI } from '@google/generative-ai';
import { NextRequest, NextResponse } from 'next/server';

const apiKey = process.env.GEMINI_API_KEY;
const genAI = new GoogleGenerativeAI(apiKey!);

const model = genAI.getGenerativeModel({
  model: 'gemini-1.5-pro',
  systemInstruction:
    "Generate a Spotify aura description based on a list of genres from a user's playlists. The result should always follow this structure:\n\nKey Point: Start with a bold, one-sentence summary that captures the essence of the listener's musical personality. This should appear in the first line.\nAura Description: Write a 2-3 sentence paragraph expanding on the key point. Use casual language and include 2-3 relevant emojis. Blend the vibes and emotions of the combined genres to paint a picture of the listener's musical soul.\nAura Color: Suggest a color or color combination that represents the overall mood of the genres.\nMusic Nickname: Create a playful, music-related nickname for the listener based on their genre mix.\n\nProvide all of the above in both English and Indonesian.\nExample output structure:\n[Key Point in bold]\n[Aura Description with emojis]\nAura Color: [Color suggestion]\nMusic Nickname: [Nickname]\nIf i don't include \"Use Bahasa Indonesia\" you don't need Indonesian translation of all the above",
});

const generationConfig = {
  temperature: 1,
  topP: 0.95,
  topK: 64,
  maxOutputTokens: 8192,
  responseMimeType: 'text/plain',
};

export async function POST(req: NextRequest) {
  const { genres } = await req.json();

  const session = model.startChat({
    generationConfig,
  });

  const result = await session.sendMessage(genres);

  return NextResponse.json({
    message: result.response.text(),
  });
}

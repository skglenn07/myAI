import { NextRequest, NextResponse } from "next/server";
import { OpenAI } from "openai";
import pdfParse from "pdf-parse";
import { Pinecone } from "@pinecone-database/pinecone";

export async function POST(req: NextRequest) {
  const formData = await req.formData();
  const file = formData.get("resume") as File;

  if (!file) {
    return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
  }

  const buffer = await file.arrayBuffer();
  const text = await pdfParse(Buffer.from(buffer));

  const openai = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });
  const response = await openai.chat.completions.create({
    model: "gpt-4",
    messages: [
      { role: "system", content: "You are a professional career coach. Analyze the resume content and provide ATS optimization feedback." },
      { role: "user", content: text.text }
    ],
  });

  return NextResponse.json({ feedback: response.choices[0].message.content });
}

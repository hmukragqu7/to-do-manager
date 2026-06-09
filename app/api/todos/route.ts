import { NextResponse } from "next/server";
import connectToDatabase from "@/app/lib/db";
import Todo from "@/app/models/Todo";

export async function GET() {
  try {
    await connectToDatabase();
    const tasks = await Todo.find().sort({ createdAt: -1 }); 
    return NextResponse.json(tasks);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    await connectToDatabase();
    const body = await request.json(); 
    const newTask = await Todo.create({ text: body.text });
    return NextResponse.json(newTask);
  } catch (error: any) {
    return NextResponse.json({ error: error.message, stack: error.stack }, { status: 500 });
  }
}

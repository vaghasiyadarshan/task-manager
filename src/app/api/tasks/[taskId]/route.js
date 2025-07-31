import { NextResponse } from "next/server";
import { doc, updateDoc, deleteDoc } from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function PUT(request, { params }) {
  try {
    const { taskId } = params;
    const updates = await request.json();

    const taskRef = doc(db, "tasks", taskId);
    await updateDoc(taskRef, updates);

    return NextResponse.json({ id: taskId, ...updates });
  } catch (err) {
    console.error("Failed to update task:", err);
    return NextResponse.json(
      { message: err.message || "Failed to update task" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const { taskId } = params;
    const taskRef = doc(db, "tasks", taskId);
    await deleteDoc(taskRef);

    return NextResponse.json({ success: true });
  } catch (err) {
    console.error("Failed to delete task:", err);
    return NextResponse.json(
      { message: err.message || "Failed to delete task" },
      { status: 500 }
    );
  }
}

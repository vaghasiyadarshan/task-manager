import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  doc,
  updateDoc,
  deleteDoc,
  query,
  where,
} from "firebase/firestore";
import { db } from "@/lib/firebase";

export async function GET(request) {
  try {
    const { searchParams } = new URL(request.url);
    const projectId = searchParams.get("projectId");

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const tasksRef = collection(db, "tasks");
    const q = query(tasksRef, where("projectId", "==", projectId));
    const snapshot = await getDocs(q);

    const tasks = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(tasks);
  } catch (err) {
    console.error("Failed to fetch tasks:", err);
    return NextResponse.json(
      { message: err.message || "Failed to fetch tasks" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { projectId, title, status, dueDate } = await request.json();

    const tasksRef = collection(db, "tasks");

    const newTask = {
      projectId,
      userId: token,
      title,
      status: status || "todo",
      dueDate: dueDate || null,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(tasksRef, newTask);
    return NextResponse.json({ id: docRef.id, ...newTask });
  } catch (err) {
    console.error("Failed to create task:", err);
    return NextResponse.json(
      { message: err.message || "Failed to create task" },
      { status: 500 }
    );
  }
}

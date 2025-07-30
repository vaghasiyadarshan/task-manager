import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  addDoc,
  query,
  where,
  doc,
  updateDoc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../lib/firebase";

export async function GET(request) {
  try {
    const token = request.headers.get("Authorization")?.split(" ")[1];

    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const projectsRef = collection(db, "projects");
    const q = query(projectsRef, where("userId", "==", token));
    const snapshot = await getDocs(q);
    const projects = snapshot.docs.map((doc) => ({
      id: doc.id,
      ...doc.data(),
    }));

    return NextResponse.json(projects);
  } catch (error) {
    console.log(error);
    return NextResponse.json(
      { message: error.message || "Failed to fetch projects" },
      { status: 500 }
    );
  }
}

export async function POST(request) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();
    const projectsRef = collection(db, "projects");
    const newProject = {
      name,
      description,
      userId: token,
      createdAt: new Date().toISOString(),
    };

    const docRef = await addDoc(projectsRef, newProject);
    return NextResponse.json({ id: docRef.id, ...newProject });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to create project" },
      { status: 500 }
    );
  }
}

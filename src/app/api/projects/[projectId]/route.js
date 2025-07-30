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
import { db } from "../../../lib/firebase";

export async function PUT(request, { params }) {
  try {
    const { projectId } = params;
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }

    const { name, description } = await request.json();

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    const projectRef = doc(db, "projects", projectId);
    const updateData = {
      name,
      description,
      updatedAt: new Date().toISOString(),
    };

    await updateDoc(projectRef, updateData);

    return NextResponse.json({
      projectId,
      ...updateData,
      userId: token,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to update project" },
      { status: 500 }
    );
  }
}

export async function DELETE(request, { params }) {
  try {
    const token = request.headers.get("authorization")?.split(" ")[1];
    if (!token) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    const { projectId } = params;

    if (!projectId) {
      return NextResponse.json(
        { message: "Project ID is required" },
        { status: 400 }
      );
    }

    // Create a batch to perform multiple operations atomically
    const batch = writeBatch(db);

    // Delete the project
    const projectRef = doc(db, "projects", projectId);
    batch.delete(projectRef);

    // Delete all tasks associated with this project
    const tasksRef = collection(db, "tasks");
    const tasksQuery = query(tasksRef, where("projectId", "==", projectId));
    const tasksSnapshot = await getDocs(tasksQuery);

    tasksSnapshot.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });

    // Commit the batch
    await batch.commit();

    return NextResponse.json({
      message: "Project and associated tasks deleted successfully",
      deletedProjectId: projectId,
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Failed to delete project" },
      { status: 500 }
    );
  }
}

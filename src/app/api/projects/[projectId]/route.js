import { NextResponse } from "next/server";
import {
  collection,
  getDocs,
  query,
  where,
  doc,
  writeBatch,
} from "firebase/firestore";
import { db } from "../../../../lib/firebase";

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

    const batch = writeBatch(db);

    const projectRef = doc(db, "projects", projectId);
    batch.delete(projectRef);

    const tasksRef = collection(db, "tasks");
    const tasksQuery = query(tasksRef, where("projectId", "==", projectId));
    const tasksSnapshot = await getDocs(tasksQuery);

    tasksSnapshot.forEach((taskDoc) => {
      batch.delete(taskDoc.ref);
    });

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

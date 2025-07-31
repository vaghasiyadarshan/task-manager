import { NextResponse } from "next/server";
import { auth } from "../../../../lib/firebase";
import { createUserWithEmailAndPassword } from "firebase/auth";
import { cookies } from "next/headers";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    const userCredential = await createUserWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7,
      path: "/",
      sameSite: "strict",
    });

    return NextResponse.json({
      user: {
        uid: userCredential.user.uid,
        email: userCredential.user.email,
        token,
      },
    });
  } catch (error) {
    return NextResponse.json(
      { message: error.message || "Registration failed" },
      { status: 400 }
    );
  }
}

import { NextResponse } from "next/server";
import { signInWithEmailAndPassword } from "firebase/auth";
import { cookies } from "next/headers";
import { auth } from "../../../../lib/firebase";

export async function POST(request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json(
        { message: "Email and password are required" },
        { status: 400 }
      );
    }

    const userCredential = await signInWithEmailAndPassword(
      auth,
      email,
      password
    );
    const token = await userCredential.user.getIdToken();

    const cookieStore = await cookies();
    cookieStore.set("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      maxAge: 60 * 60 * 24 * 7
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
    console.error("Login error:", error);
    return NextResponse.json(
      { message: error?.message || "Login failed. Check your credentials." },
      { status: 401 }
    );
  }
}

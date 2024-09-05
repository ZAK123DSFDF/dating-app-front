import Image from "next/image";
import Link from "next/link";
import { getAuthData } from "./actions/getAuth";
import { redirect } from "next/navigation";
export default async function Page() {
  const auth = await getAuthData();
  if (auth.isAuthenticated) {
    redirect("/chat");
  }
  return (
    <div className="relative w-screen h-screen flex items-center justify-center">
      <Image
        src="/hands.jpg"
        layout="fill"
        objectFit="cover"
        alt="Background Image"
        className="z-0"
      />
      <div className="absolute top-0 left-0 w-full h-full bg-pink-500 opacity-30 z-10"></div>
      <div className="absolute z-20 flex  items-center gap-4">
        <Link
          href="/login"
          className="bg-blue-500 w-20 flex justify-center text-white px-4 py-2 rounded-md"
        >
          Login
        </Link>
        <Link
          href="/signup"
          className="bg-green-500 w-20 flex justify-center text-white px-4 py-2 rounded-md"
        >
          Signup
        </Link>
      </div>
    </div>
  );
}

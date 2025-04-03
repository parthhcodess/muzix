import Image from "next/image";
import { Appbar } from "./components/Appbar";
import { useSession } from "next-auth/react";

export default function Home() {
  return (
    <main>
      <Appbar />
    </main>
  );
}

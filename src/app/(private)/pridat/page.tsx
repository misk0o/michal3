//src/app/pridat/page.tsx

import { Metadata } from "next";
import CreatePostView from "@/sections/CreatePostView";

export const metadata: Metadata = {
  title: "Pridať príspevok",
  description: "Zdieľajte svoje najlepšie momenty s ostatnými",
};

export default function CreatePostPage() {
  return <CreatePostView />;
}



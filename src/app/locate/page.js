// src/app/locate/page.js
import LocateClient from "@/components/LocateClient";

export const metadata = {
  title: "Locate Emergency Services — Lagos Emergency Reporter",
  description: "Find the nearest police, fire, and medical facilities in Lagos on a map.",
};

export default function LocatePage() {
  return <LocateClient />;
}

// src/app/queue/page.js
import QueueClient from "@/components/QueueClient";

export const metadata = {
  title: "Queued Alerts — Lagos Emergency Reporter",
  description: "View and manage offline-queued emergency alerts pending sync.",
};

export default function QueuePage() {
  return <QueueClient />;
}

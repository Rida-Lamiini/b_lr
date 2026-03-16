import { Timer } from "@/components/focus/Timer";
import { FocusStats } from "@/components/focus/FocusStats";

export default function FocusPage() {
  return (
    <div className="h-full flex flex-col md:flex-row gap-8 py-8 px-4 items-start max-w-6xl mx-auto w-full">
      <div className="flex-1 w-full flex flex-col items-center justify-center min-h-[500px]">
        <Timer />
      </div>
      <div className="w-full md:w-80 shrink-0">
        <FocusStats />
      </div>
    </div>
  );
}
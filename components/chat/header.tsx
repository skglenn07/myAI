import { Button } from "@/components/ui/button";
import { EraserIcon, BriefcaseIcon } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { CHAT_HEADER, CLEAR_BUTTON_TEXT } from "@/configuration/ui";
import { AI_NAME } from "@/configuration/identity";

export const AILogo = () => (
  <div className="w-12 h-12 relative">
    <Image src="/resume_icon.png" alt={AI_NAME} width={48} height={48} />
    <div className="w-2 h-2 rounded-full bg-green-500 absolute -bottom-0.5 -right-0.5"></div>
  </div>
);

export default function ChatHeader({
  clearMessages,
}: {
  clearMessages: () => void;
}) {
  return (
    <div className="z-10 flex justify-between items-center fixed top-0 w-full p-5 bg-white shadow-[0_10px_15px_-3px_rgba(255,255,255,1)]">
      <div className="flex-0">
        <Link href="/job-matcher">
          <Button className="gap-2 shadow-sm bg-green-600 text-white hover:bg-green-700" size="sm">
            <BriefcaseIcon className="w-4 h-4" />
            <span>Try Job Matcher</span>
          </Button>
        </Link>
      </div>
      <div className="flex-1 flex justify-center items-center gap-4">
        <AILogo />
        <p>{CHAT_HEADER}</p>
      </div>
      <div className="flex-0">
        <Button
          onClick={clearMessages}
          className="gap-2 shadow-sm"
          variant="outline"
          size="sm"
        >
          <EraserIcon className="w-4 h-4" />
          <span>{CLEAR_BUTTON_TEXT}</span>
        </Button>
      </div>
    </div>
  );
}

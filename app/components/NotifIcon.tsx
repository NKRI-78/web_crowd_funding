import Tippy from "@tippyjs/react";
import { BellRing } from "lucide-react";
import Link from "next/link";

export const NotifIcon: React.FC<{
  className?: string;
  badgeCount: number;
}> = ({ className, badgeCount = 0 }) => {
  return (
    <Tippy
      content="Inbox"
      className="bg-black/50 text-sm font-medium backdrop-blur-md px-4 py-1 rounded-md"
    >
      <Link href="/inbox" className="relative inline-block">
        <BellRing size={18} className={className} />
        {badgeCount > 0 && (
          <span className="absolute -top-2 -right-1 bg-red-500 text-white text-[10px] min-w-[14px] h-[14px] rounded-full flex items-center justify-center">
            {badgeCount}
          </span>
        )}
      </Link>
    </Tippy>
  );
};

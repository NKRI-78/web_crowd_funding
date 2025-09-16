import { useState } from "react";
import { BellRing, ChevronLeft, ChevronRight } from "lucide-react";
import clsx from "clsx";
import { DashboardMenu } from "./IDashboardMenu";
import Tippy from "@tippyjs/react";
import Link from "next/link";
import { NotifIcon } from "../NotifIcon";

type DashboardSidebarProps = {
  menuItems: DashboardMenu[];
  expand: boolean;
  headerTitle?: string;
  toggleExpand: (expand: boolean) => void;
  menuOnChanged: (currentMenuIndex: number) => void;
  setActive: (currentMenuIndex: number) => boolean;
  className?: string;
};

export default function DashboardSidebar({
  menuItems,
  expand = true,
  headerTitle,
  toggleExpand,
  menuOnChanged,
  setActive,
  className,
}: DashboardSidebarProps) {
  return (
    <div
      className={clsx(
        className,
        "fixed top-0 left-0 h-screen z-60 bg-white text-gray-900 shadow-xl flex flex-col transition-all duration-300",
        "hidden md:flex",
        expand ? "w-60 md:w-52" : "w-20"
      )}
    >
      <div className="space-y-2 px-4 pb-4 border-b border-gray-700">
        {/* Header */}
        <div
          className={clsx(
            "flex",
            expand ? "justify-between" : "justify-center"
          )}
        >
          <span className={clsx("font-bold text-lg", !expand && "hidden")}>
            {headerTitle ?? "-"}
          </span>

          <button
            onClick={() => toggleExpand(!expand)}
            className="p-1 rounded hover:bg-gray-100"
          >
            {expand ? (
              <ChevronLeft className="w-5 h-5" />
            ) : (
              <ChevronRight className="w-5 h-5" />
            )}
          </button>
        </div>

        {/* Inbox */}
        <div
          className={clsx(
            "flex items-center px-1 py-3 gap-x-4 cursor-pointer text-sm hover:bg-gray-100 ",
            expand ? "justify-start" : "justify-center"
          )}
        >
          <NotifIcon badgeCount={2} />

          {expand && <p>Inbox</p>}
        </div>
      </div>

      {/* Menu */}
      <nav
        className={clsx(
          "flex flex-col flex-1 mt-4",
          !expand ? "items-center" : ""
        )}
      >
        {menuItems.map((item, idx) => {
          const active = setActive(idx);

          return (
            <div
              key={idx}
              className={`flex items-center gap-3 px-4 py-3 text-sm hover:bg-gray-100 transition-colors ${
                active ? "bg-gray-100 font-semibold" : "bg-white"
              } cursor-pointer`}
              onClick={() => {
                menuOnChanged(idx);
              }}
            >
              {item.icon && <item.icon className="w-5 h-5" />}
              {expand && <span>{item.title}</span>}
            </div>
          );
        })}
      </nav>
    </div>
  );
}

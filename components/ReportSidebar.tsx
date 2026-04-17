"use client";

import { useState } from "react";
import { Network, History, Brain, LayoutDashboard, HelpCircle, MessageSquare, Plus, ChevronLeft } from "lucide-react";
import { useRouter } from "next/navigation";

const navItems = [
  { id: "overall", icon: LayoutDashboard, label: "Overall" },
  { id: "file-tree", icon: Network, label: "File Tree" },
  { id: "activity", icon: History, label: "Activity" },
  { id: "insights", icon: Brain, label: "Insights" },
];

export function ReportSidebar({
  activeTab = "overall",
  onTabChange,
}: {
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);
  const router = useRouter();

  return (
    <aside
      className={`fixed left-0 top-[76px] z-40 hidden h-[calc(100vh-76px)] flex-col border-r border-frame bg-paper/85 py-6 backdrop-blur-xl transition-all duration-300 md:flex ${
        collapsed ? "w-[72px]" : "w-60"
      }`}
    >
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 flex h-7 w-7 items-center justify-center rounded-full border border-frame bg-panel text-muted shadow-md transition-colors hover:text-ink"
        aria-label="Toggle sidebar"
      >
        <ChevronLeft className={`h-3.5 w-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
      </button>

      {!collapsed && (
        <div className="mb-8 px-5">
          <p className="mb-1 text-[10px] font-black uppercase tracking-[0.25em] text-accent">Repository</p>
          <p className="text-[10px] uppercase tracking-wider text-muted">Field report mode</p>
        </div>
      )}

      <nav className="flex-1 space-y-1 px-3">
        {navItems.map(({ icon: Icon, label, id }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={label}
              onClick={() => onTabChange?.(id)}
              title={collapsed ? label : undefined}
              className={`group relative flex w-full items-center gap-3 rounded-xl border px-3 py-2.5 text-left transition-all duration-200 ${
                isActive ? "border-ink bg-ink text-paper shadow-sm" : "border-transparent text-muted hover:bg-panel hover:text-ink"
              }`}
            >
              <Icon className={`h-[18px] w-[18px] shrink-0 transition-colors ${isActive ? "text-paper" : "group-hover:text-ink"}`} />
              {!collapsed && <span className="truncate text-[11px] font-bold uppercase tracking-[0.15em]">{label}</span>}
              {isActive && !collapsed && <span className="ml-auto h-1.5 w-1.5 shrink-0 rounded-full bg-accent"></span>}
            </button>
          );
        })}
      </nav>

      <div className={`mb-4 px-3 ${collapsed ? "flex justify-center" : ""}`}>
        <button
          onClick={() => router.push("/")}
          className={`flex items-center justify-center gap-2 rounded-xl border border-frame bg-panel font-bold text-ink transition-all hover:-translate-y-0.5 active:scale-95 ${
            collapsed ? "h-10 w-10" : "w-full py-2.5 text-[11px] uppercase tracking-[0.15em]"
          }`}
          title={collapsed ? "New Analysis" : undefined}
        >
          <Plus className="h-4 w-4 shrink-0" />
          {!collapsed && "New Analysis"}
        </button>
      </div>

      <div className={`space-y-1 border-t border-frame px-3 pt-4 ${collapsed ? "flex flex-col items-center" : ""}`}>
        {[
          { icon: HelpCircle, label: "Support" },
          { icon: MessageSquare, label: "Feedback" },
        ].map(({ icon: Icon, label }) => (
          <a
            key={label}
            href="#"
            title={collapsed ? label : undefined}
            className="group flex items-center gap-3 rounded-lg px-3 py-2 text-[11px] text-muted transition-colors hover:text-ink"
          >
            <Icon className="h-4 w-4 shrink-0 transition-colors group-hover:text-accent" />
            {!collapsed && label}
          </a>
        ))}
      </div>
    </aside>
  );
}

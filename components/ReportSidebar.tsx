"use client";

import { useState } from "react";
import { Network, History, Brain, LayoutDashboard, HelpCircle, MessageSquare, Plus, ChevronLeft } from "lucide-react";

const navItems = [
  { id: "overall", icon: LayoutDashboard, label: "Overall" },
  { id: "file-tree", icon: Network, label: "File Tree" },
  { id: "activity", icon: History, label: "Activity" },
  { id: "insights", icon: Brain, label: "Insights" },
];

export function ReportSidebar({ 
  activeTab = "overall", 
  onTabChange 
}: { 
  activeTab?: string;
  onTabChange?: (tab: string) => void;
}) {
  const [collapsed, setCollapsed] = useState(false);

  return (
    <aside
      className={`hidden md:flex flex-col h-[calc(100vh-64px)] fixed left-0 top-16 bg-[#12151b] border-r border-white/[0.06] py-6 z-40 transition-all duration-300 ${
        collapsed ? "w-[72px]" : "w-60"
      }`}
    >
      {/* Collapse toggle */}
      <button
        onClick={() => setCollapsed(!collapsed)}
        className="absolute -right-3 top-8 w-6 h-6 bg-surface-container-high border border-outline-variant/20 rounded-full flex items-center justify-center text-on-surface-variant hover:text-primary transition-colors shadow-md"
        aria-label="Toggle sidebar"
      >
        <ChevronLeft className={`w-3.5 h-3.5 transition-transform duration-300 ${collapsed ? "rotate-180" : ""}`} />
      </button>

      {/* Brand label */}
      {!collapsed && (
        <div className="px-5 mb-8">
          <p className="text-[10px] font-black tracking-[0.25em] uppercase text-primary mb-0.5">Repository</p>
          <p className="text-[10px] text-on-surface-variant/50 uppercase tracking-wider">Analysis Mode</p>
        </div>
      )}

      {/* Nav links */}
      <nav className="flex-1 px-3 space-y-1">
        {navItems.map(({ icon: Icon, label, id }) => {
          const isActive = activeTab === id;
          return (
            <button
              key={label}
              onClick={() => onTabChange?.(id)}
              title={collapsed ? label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 w-full text-left rounded-xl transition-all duration-200 group relative
                ${
                  isActive
                    ? "bg-primary/10 text-primary border border-primary/15 shadow-sm shadow-primary/10"
                    : "text-on-surface-variant hover:bg-white/5 hover:text-white border border-transparent"
                }`}
            >
              <Icon
                className={`w-[18px] h-[18px] shrink-0 transition-colors ${
                  isActive ? "text-primary" : "group-hover:text-white"
                }`}
              />
              {!collapsed && (
                <span className="text-[11px] font-bold uppercase tracking-[0.15em] truncate">{label}</span>
              )}
              {isActive && !collapsed && (
                <span className="ml-auto w-1.5 h-1.5 rounded-full bg-primary shrink-0"></span>
              )}
            </button>
          );
        })}
      </nav>

      {/* New Analysis CTA */}
      <div className={`px-3 mb-4 ${collapsed ? "flex justify-center" : ""}`}>
        <button
          className={`flex items-center justify-center gap-2 bg-primary/10 hover:bg-primary/20 border border-primary/20 text-primary font-bold rounded-xl transition-all active:scale-95 ${
            collapsed ? "w-10 h-10" : "w-full py-2.5 text-[11px] uppercase tracking-[0.15em]"
          }`}
          title={collapsed ? "New Analysis" : undefined}
        >
          <Plus className="w-4 h-4 shrink-0" />
          {!collapsed && "New Analysis"}
        </button>
      </div>

      {/* Footer links */}
      <div className={`px-3 pt-4 border-t border-white/[0.06] space-y-1 ${collapsed ? "flex flex-col items-center" : ""}`}>
        {[
          { icon: HelpCircle, label: "Support" },
          { icon: MessageSquare, label: "Feedback" },
        ].map(({ icon: Icon, label }) => (
          <a
            key={label}
            href="#"
            title={collapsed ? label : undefined}
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-on-surface-variant/60 hover:text-white transition-colors text-[11px] group"
          >
            <Icon className="w-4 h-4 shrink-0 group-hover:text-primary transition-colors" />
            {!collapsed && label}
          </a>
        ))}
      </div>
    </aside>
  );
}
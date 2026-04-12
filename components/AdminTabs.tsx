"use client";

import React from "react";

type Tab = {
  id: string;
  label: string;
  icon: React.ReactNode;
};

type AdminTabsProps = {
  activeTab: string;
  setActiveTab: (id: string) => void;
  tabs: Tab[];
};

export default function AdminTabs({ activeTab, setActiveTab, tabs }: AdminTabsProps) {
  return (
    <div className="mx-auto mb-8 flex w-fit flex-wrap items-center justify-center gap-1 rounded-2xl border border-slate-200 bg-white p-1 shadow-sm">
      {tabs.map((tab) => (
        <button
          key={tab.id}
          onClick={() => setActiveTab(tab.id)}
          className={`flex items-center gap-2 px-6 py-2.5 rounded-xl text-sm font-bold transition-all duration-300 ${activeTab === tab.id
              ? "bg-amber-400 text-slate-900 shadow-md shadow-amber-400/20"
              : "text-slate-500 hover:text-slate-900 hover:bg-slate-50"
            }`}
        >
          {tab.icon}
          {tab.label}
        </button>
      ))}
    </div>
  );
}

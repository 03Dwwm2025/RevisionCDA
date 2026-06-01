import { useState } from 'react';
import { Outlet } from 'react-router-dom';
import Sidebar from './Sidebar';
import { useCoursIndex } from '../hooks/useCours';

export default function Layout() {
  const { chapitres } = useCoursIndex();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  return (
    <div className="flex h-screen overflow-hidden bg-gray-50 dark:bg-gray-950">
      {/* Sidebar desktop */}
      <aside className="hidden lg:flex flex-col w-72 shrink-0 border-r border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800">
          <h1 className="text-lg font-bold text-purple-700 dark:text-purple-400">
            Révision CDA
          </h1>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Promo 2026</p>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar chapitres={chapitres} />
        </div>
      </aside>

      {/* Mobile overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 z-30 bg-black/40 lg:hidden"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar mobile */}
      <aside
        className={`fixed inset-y-0 left-0 z-40 w-72 bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-800 transform transition-transform duration-200 lg:hidden ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        }`}
      >
        <div className="px-4 py-4 border-b border-gray-200 dark:border-gray-800 flex items-center justify-between">
          <h1 className="text-lg font-bold text-purple-700 dark:text-purple-400">
            Révision CDA
          </h1>
          <button
            onClick={() => setSidebarOpen(false)}
            className="text-gray-500 hover:text-gray-700 dark:hover:text-gray-300"
          >
            ✕
          </button>
        </div>
        <div className="flex-1 overflow-y-auto">
          <Sidebar chapitres={chapitres} onClose={() => setSidebarOpen(false)} />
        </div>
      </aside>

      {/* Main content */}
      <main className="flex-1 flex flex-col overflow-hidden">
        {/* Mobile header */}
        <div className="lg:hidden flex items-center gap-3 px-4 py-3 border-b border-gray-200 dark:border-gray-800 bg-white dark:bg-gray-900">
          <button
            onClick={() => setSidebarOpen(true)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100"
          >
            ☰
          </button>
          <span className="font-semibold text-purple-700 dark:text-purple-400">
            Révision CDA
          </span>
        </div>

        <div className="flex-1 overflow-y-auto">
          <Outlet />
        </div>
      </main>
    </div>
  );
}

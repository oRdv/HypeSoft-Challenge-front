import { Home, Package, BarChart, LogOut } from "lucide-react";

export const Sidebar = () => {
  return (
    <aside className="w-64 bg-white shadow-md flex flex-col">
      <div className="h-16 flex items-center justify-center font-bold text-xl border-b">
        Hypesoft
      </div>
      <nav className="flex-1 p-4 space-y-2">
        <a href="/dashboard" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Home className="w-5 h-5" /> Dashboard
        </a>
        <a href="/products" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <Package className="w-5 h-5" /> Produtos
        </a>
        <a href="/reports" className="flex items-center gap-2 p-2 hover:bg-gray-100 rounded">
          <BarChart className="w-5 h-5" /> Relatórios
        </a>
      </nav>
      <button className="p-4 border-t flex items-center gap-2 hover:bg-gray-100">
        <LogOut className="w-5 h-5" /> Sair
      </button>
    </aside>
  );
};

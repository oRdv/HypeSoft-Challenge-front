import { useMemo, useState } from "react";
import {
  Bell,
  Search,
  Settings,
  Package,
  Users,
  FileText,
  MessageSquare,
  Home,
  BarChart,
  ShoppingBag,
  HelpCircle,
  ChevronDown,  
  TrendingUp,
  Star,
  AlertTriangle,
  Box,
  Plus,
  Edit3,
  Trash2,
  Minus,
  PlusCircle,
  Image as ImageIcon,
  LogOut
} from "lucide-react";

import { Button } from "../components/ui/Button";
import { Card } from "../components/ui/Card";
import { Input } from "../components/ui/Input";

type Category = { id: string; name: string };

type Product = {
  id: string;
  name: string;
  description: string;
  price: number;
  categoryId: string;
  stock: number;
  rating?: number;
  image: string;
};

// Alterado para as roles que você mencionou
type UserRole = 'admin' | 'manager' | 'user';

type User = {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatar: string;
};

const initialCategories: Category[] = [
  { id: "c1", name: "Shirts" },
  { id: "c2", name: "Pants" },
  { id: "c3", name: "Jackets" },
  { id: "c4", name: "Shoes" },
];

const initialProducts: Product[] = [
  { 
    id: "p1", 
    name: "Linen Shirt", 
    description: "Lightweight and breathable", 
    price: 45, 
    categoryId: "c1", 
    stock: 9, 
    rating: 4.7,
    image: "https://img.ltwebstatic.com/images3_pi/2024/05/20/01/1716194137c94a73f1edce47ecee69de6acc22c60b_thumbnail_405x.webp"
  },
  { 
    id: "p2", 
    name: "Jeans Jacket", 
    description: "Classic denim", 
    price: 65, 
    categoryId: "c3", 
    stock: 70, 
    rating: 4.6,
    image: "https://encrypted-tbn2.gstatic.com/shopping?q=tbn:ANd9GcR6W4YlkHsLIdlPpq2CtZOfgrkSGLdWdr6Kv4dKJJDb-ueeplMrfM31FmSo8VQB-qnUjLZEtA8YDYstIl7fjJPpeG_6zNi7J-dc_Vk29EhszbXJs-U2P6fa"
  },
  { 
    id: "p3", 
    name: "Ankle Pants", 
    description: "Slim fit", 
    price: 55, 
    categoryId: "c2", 
    stock: 80, 
    rating: 4.5,
    image: "https://img.ltwebstatic.com/images3_pi/2024/06/22/5f/1719026179475a3ffd310c9864d1b5ea5b8727f0dc_thumbnail_560x.webp"
  },
  { 
    id: "p4", 
    name: "Slim Fit Jeans", 
    description: "Comfort stretch", 
    price: 59, 
    categoryId: "c2", 
    stock: 4, 
    rating: 4.4,
    image: "http://img.ltwebstatic.com/v4/j/spmp/2025/07/19/d0/17528785576f5bee512f4d2e04705aa9cb42fcf708_thumbnail_560x.webp"
  },
  { 
    id: "p5", 
    name: "White T-Shirt", 
    description: "Soft cotton", 
    price: 19, 
    categoryId: "c1", 
    stock: 50, 
    rating: 4.8,
    image: "https://img.ltwebstatic.com/v4/j/spmp/2025/08/28/ec/1756327626369e5f55578a7c16683c86bed9043f0e_thumbnail_560x.webp"
  },
];

// Função para obter o usuário logado (simulando busca no localStorage)
const getLoggedInUser = (): User => {
  // Em uma aplicação real, você buscaria essas informações do localStorage ou de uma API
  const userData = localStorage.getItem('userData');
  
  if (userData) {
    return JSON.parse(userData);
  }
  
  // Default fallback - em produção, você redirecionaria para login
  return {
    id: "u2",
    name: "Manager",
    email: "manager@gmail.com",
    role: "manager",
    avatar: "https://ui-avatars.com/api/?name=Manager"
  };
};

const currency = (n: number) =>
  n.toLocaleString("en-US", { style: "currency", currency: "USD", maximumFractionDigits: 2 });

// Atualizado para as novas roles
const usePermissions = (userRole: UserRole) => {
  const permissions = useMemo(() => {
    return {
      canEditProducts: ['admin', 'manager'].includes(userRole),
      canDeleteProducts: ['admin'].includes(userRole),
      canCreateProducts: ['admin', 'manager'].includes(userRole),
      canViewSettings: ['admin'].includes(userRole),
      canViewStatistics: ['admin', 'manager', 'user'].includes(userRole),
      canAdjustStock: ['admin', 'manager'].includes(userRole),
    };
  }, [userRole]);

  return permissions;
};

const Sidebar = ({ currentUser }: { currentUser: User }) => {
  const permissions = usePermissions(currentUser.role);
  
  return (
    <aside className="w-64 bg-white shadow-lg flex flex-col">
      <div className="p-6 font-bold text-2xl text-indigo-600 tracking-tight">ShopSense</div>
      <nav className="flex-1 px-4 space-y-1 text-sm">
        <p className="text-xs text-gray-400 mt-4 mb-1">GENERAL</p>
        <a className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
          <Home className="w-5 h-5" /> Dashboard
        </a>
        {permissions.canViewStatistics && (
          <a className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
            <BarChart className="w-5 h-5" /> Statistics
          </a>
        )}

        <p className="text-xs text-gray-400 mt-6 mb-1">SHOP</p>
        <a className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
          <ShoppingBag className="w-5 h-5" /> My Shop
        </a>
        <a className="flex items-center gap-3 py-2.5 px-3 rounded-lg bg-indigo-600 text-white transition-colors cursor-pointer">
          <Package className="w-5 h-5" /> Products
        </a>
        <a className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
          <Users className="w-5 h-5" /> Customers
        </a>
        <a className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
          <FileText className="w-5 h-5" /> Invoice
        </a>
        <a className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer relative">
          <MessageSquare className="w-5 h-5" /> Messages
          <span className="absolute right-4 top-2 bg-indigo-600 text-white text-xs px-2 py-0.5 rounded-full">
            4
          </span>
        </a>

        <p className="text-xs text-gray-400 mt-6 mb-1">SUPPORT</p>
        {permissions.canViewSettings && (
          <a className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
            <Settings className="w-5 h-5" /> Settings
          </a>
        )}
        <a className="flex items-center gap-3 py-2.5 px-3 rounded-lg hover:bg-indigo-50 hover:text-indigo-600 transition-colors cursor-pointer">
          <HelpCircle className="w-5 h-5" /> Help
        </a>
      </nav>
      <div className="p-4 bg-indigo-50 text-center">
        <p className="text-sm">
          Try <b>ShopSense Pro</b>
        </p>
        <Button variant="primary" className="mt-2">
          Upgrade Plan
        </Button>
      </div>
    </aside>
  );
};

const Header = ({ 
  currentUser, 
  onLogout,
  query,
  setQuery,
  setPage
}: { 
  currentUser: User;
  onLogout: () => void;
  query: string;
  setQuery: (query: string) => void;
  setPage: (page: number) => void;
}) => {
  return (
    <header className="flex justify-between items-center mb-8">
      <div className="flex items-center gap-2">
        <span className="font-semibold text-lg">UnitedMen</span>
        <ChevronDown className="w-4 h-4 text-gray-500" />
      </div>
      <div className="flex items-center gap-6">
        <div className="flex items-center bg-white px-3 py-2 rounded-lg shadow-sm">
          <Search className="w-5 h-5 text-gray-400" />
          <input
            type="text"
            placeholder="Search..."
            className="ml-2 outline-none text-sm text-gray-600 w-40"
            value={query}
            onChange={(e) => {
              setQuery(e.target.value);
              setPage(1);
            }}
          />
        </div>
        <div className="relative">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs w-4 h-4 flex items-center justify-center rounded-full">
            3
          </span>
        </div>
        <div className="flex items-center gap-2">
          <img
            src={currentUser.avatar}
            alt="profile"
            className="w-9 h-9 rounded-full shadow-sm"
          />
          <div className="flex flex-col">
            <span className="text-gray-700 text-sm font-medium">{currentUser.name}</span>
            <span className="text-xs text-gray-500 capitalize">{currentUser.role}</span>
            <button 
              onClick={onLogout}
              className="flex items-center gap-1 text-xs text-gray-500 hover:text-red-600 transition-colors"
            >
              <LogOut className="w-3 h-3" /> Sair
            </button>
          </div>
        </div>
      </div>
    </header>
  );
};

const MetricsCards = ({ 
  totalProducts, 
  avgRating, 
  lowStockCount 
}: { 
  totalProducts: number; 
  avgRating: number; 
  lowStockCount: number; 
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
      {[
        {
          title: "Total Products",
          value: totalProducts.toString(),
          sub: "-5 products from last month",
          icon: <Box className="w-6 h-6 text-indigo-600" />,
        },
        {
          title: "Average Rating",
          value: avgRating.toFixed(1),
          sub: "+0.2 star from last month",
          icon: <Star className="w-6 h-6 text-yellow-500" />,
        },
        {
          title: "Sales Trends",
          value: "+16.8%",
          sub: "from last month",
          icon: <TrendingUp className="w-6 h-6 text-green-500" />,
        },
        {
          title: "Low Stock",
          value: lowStockCount.toString(),
          sub: "are under 10 items",
          icon: <AlertTriangle className="w-6 h-6 text-red-500" />,
        },
      ].map((m, i) => (
        <Card key={i}>
          <div className="flex items-center gap-3 mb-2">
            {m.icon}
            <h2 className="text-sm text-gray-500">{m.title}</h2>
          </div>
          <p className="text-2xl font-bold">{m.value}</p>
          <p className="text-xs text-gray-500 mt-1">{m.sub}</p>
        </Card>
      ))}
    </div>
  );
};

const CategoryChart = ({ perCategory }: { perCategory: { category: string; count: number }[] }) => {
  return (
    <Card title="Products per Category">
      {perCategory.map((row) => {
        const max = Math.max(...perCategory.map((r) => r.count)) || 1;
        const pct = Math.round((row.count / max) * 100);
        return (
          <div key={row.category}>
            <div className="flex justify-between text-xs text-gray-500 mb-1">
              <span>{row.category}</span>
              <span>{row.count}</span>
            </div>
            <div className="w-full bg-gray-100 h-2 rounded-full overflow-hidden">
              <div
                className="h-2 bg-indigo-600 rounded-full"
                style={{ width: `${pct}%` }}
              />
            </div>
          </div>
        );
      })}
    </Card>
  );
};

const InventoryValue = ({ totalStockValue }: { totalStockValue: number }) => {
  return (
    <Card title="Inventory Value">
      <p className="text-3xl font-bold">{currency(totalStockValue)}</p>
      <p className="text-xs text-gray-500 mt-1">Current stock × unit price</p>
    </Card>
  );
};

const FiltersAndActions = ({ 
  categories, 
  categoryFilter, 
  setCategoryFilter, 
  setPage, 
  openCreate,
  canCreateProducts 
}: { 
  categories: Category[]; 
  categoryFilter: string; 
  setCategoryFilter: (filter: string) => void; 
  setPage: (page: number) => void; 
  openCreate: () => void;
  canCreateProducts: boolean;
}) => {
  return (
    <Card title="Filters & Actions">
      <div className="flex flex-col sm:flex-row items-center justify-center gap-3">
        <select
          className="border rounded-lg px-3 py-2 text-sm"
          value={categoryFilter}
          onChange={(e) => {
            setCategoryFilter(e.target.value);
            setPage(1);
          }}
        >
          <option value="all">All categories</option>
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.name}
            </option>
          ))}
        </select>
        {canCreateProducts && (
          <Button variant="primary" className="inline-flex items-center gap-2" onClick={openCreate}>
            <Plus className="w-4 h-4" /> New Product
          </Button>
        )}
      </div>
    </Card>
  );
};

const ProductTable = ({ 
  pageData, 
  categories, 
  adjustStock, 
  openEdit, 
  deleteProduct,
  canEditProducts,
  canDeleteProducts,
  canAdjustStock
}: { 
  pageData: Product[]; 
  categories: Category[]; 
  adjustStock: (id: string, delta: number) => void; 
  openEdit: (p: Product) => void; 
  deleteProduct: (id: string) => void;
  canEditProducts: boolean;
  canDeleteProducts: boolean;
  canAdjustStock: boolean;
}) => {
  return (
    <div className="overflow-x-auto">
      <table className="w-full text-sm">
        <thead className="text-left text-gray-400 border-b">
          <tr>
            <th className="pb-3">Image</th>
            <th className="pb-3">Name</th>
            <th className="pb-3">Category</th>
            <th className="pb-3">Price</th>
            <th className="pb-3">Stock</th>
            {(canEditProducts || canDeleteProducts) && <th className="pb-3">Actions</th>}
          </tr>
        </thead>
        <tbody>
          {pageData.map((p) => {
            const cat = categories.find((c) => c.id === p.categoryId)?.name ?? "-";
            const isLow = p.stock < 10;
            return (
              <tr key={p.id} className="border-b last:border-none">
                <td className="py-4">
                  {p.image ? (
                    <img 
                      src={p.image} 
                      alt={p.name}
                      className="w-12 h-12 object-cover rounded"
                      onError={(e) => {
                        const target = e.target as HTMLImageElement;
                        target.style.display = 'none';
                      }}
                    />
                  ) : (
                    <div className="w-12 h-12 bg-gray-100 rounded flex items-center justify-center">
                      <ImageIcon className="w-5 h-5 text-gray-400" />
                    </div>
                  )}
                </td>
                <td className="py-4">
                  <div className="font-medium text-gray-800">{p.name}</div>
                  <div className="text-xs text-gray-500">{p.description}</div>
                </td>
                <td className="py-4">{cat}</td>
                <td className="py-4">{currency(p.price)}</td>
                <td className="py-4">
                  <div className="flex items-center gap-2">
                    {canAdjustStock && (
                      <>
                        <Button
                          variant="secondary"
                          className="px-2 py-1"
                          onClick={() => adjustStock(p.id, -1)}
                        >
                          <Minus className="w-4 h-4" />
                        </Button>
                        <span className={`min-w-[2rem] text-center ${isLow ? "text-red-600 font-semibold" : ""}`}>
                          {p.stock}
                        </span>
                        <Button
                          variant="secondary"
                          className="px-2 py-1"
                          onClick={() => adjustStock(p.id, +1)}
                        >
                          <PlusCircle className="w-4 h-4" />
                        </Button>
                      </>
                    )}
                    {!canAdjustStock && (
                      <span className={`min-w-[2rem] text-center ${isLow ? "text-red-600 font-semibold" : ""}`}>
                        {p.stock}
                      </span>
                    )}
                    {isLow && (
                      <span className="ml-2 bg-red-50 text-red-600 px-2 py-0.5 rounded-full text-xs">
                        Low
                      </span>
                    )}
                  </div>
                </td>
                {(canEditProducts || canDeleteProducts) && (
                  <td className="py-4">
                    <div className="flex items-center gap-2">
                      {canEditProducts && (
                        <Button variant="secondary" className="px-3 py-1.5" onClick={() => openEdit(p)}>
                          <Edit3 className="w-4 h-4" />
                        </Button>
                      )}
                      {canDeleteProducts && (
                        <Button variant="danger" className="px-3 py-1.5" onClick={() => deleteProduct(p.id)}>
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      )}
                    </div>
                  </td>
                )}
              </tr>
            );
          })}
          {pageData.length === 0 && (
            <tr>
              <td colSpan={6} className="py-8 text-center text-gray-500">
                No products found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
    </div>
  );
};

const Pagination = ({ page, totalPages, setPage }: { page: number; totalPages: number; setPage: (page: number) => void }) => {
  return (
    <div className="flex items-center justify-between mt-6">
      <div className="text-xs text-gray-50">
        Page {page} of {totalPages}
      </div>
      <div className="flex gap-2">
        <Button
          variant="secondary"
          disabled={page === 1}
          onClick={() => setPage(Math.max(1, page - 1))}
        >
          Prev
        </Button>
        <Button
          variant="secondary"
          disabled={page === totalPages}
          onClick={() => setPage(Math.min(totalPages, page + 1))}
        >
          Next
        </Button>
      </div>
    </div>
  );
};

const LowStockAlert = ({ lowStock }: { lowStock: Product[] }) => {
  return (
    <Card title="Low Stock (< 10)">
      {lowStock.length > 0 ? (
        <div className="flex flex-wrap gap-2">
          {lowStock.map((p) => (
            <div
              key={p.id}
              className="px-3 py-1.5 bg-red-50 text-red-600 rounded-full text-sm"
            >
              {p.name} ({p.stock})
            </div>
          ))}
        </div>
      ) : (
        <p className="text-gray-500 text-sm">No low stock items</p>
      )}
    </Card>
  );
};

const ProductFormModal = ({ 
  showForm, 
  setShowForm, 
  isEditing, 
  form, 
  setForm, 
  categories, 
  formValid, 
  saveProduct 
}: { 
  showForm: boolean; 
  setShowForm: (show: boolean) => void; 
  isEditing: boolean; 
  form: Omit<Product, "id">; 
  setForm: (form: Omit<Product, "id">) => void; 
  categories: Category[]; 
  formValid: boolean; 
  saveProduct: () => void; 
}) => {
  if (!showForm) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <Card className="w-full max-w-md">
        <h3 className="text-lg font-semibold mb-4">
          {isEditing ? "Edit Product" : "New Product"}
        </h3>
        <div className="flex flex-col gap-3">
          <Input
            label="Image URL"
            value={form.image}
            onChange={(e) => setForm({ ...form, image: e.target.value })}
            placeholder="https://example.com/image.jpg"
          />
          <Input
            label="Name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <Input
            label="Description"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
          />
          <Input
            label="Price"
            type="number"
            value={form.price}
            onChange={(e) => setForm({ ...form, price: parseFloat(e.target.value) || 0 })}
          />
          <select
            className="border rounded-lg px-3 py-2"
            value={form.categoryId}
            onChange={(e) => setForm({ ...form, categoryId: e.target.value })}
          >
            {categories.map((c) => (
              <option key={c.id} value={c.id}>
                {c.name}
              </option>
            ))}
          </select>
          <Input
            label="Stock"
            type="number"
            value={form.stock}
            onChange={(e) => setForm({ ...form, stock: parseInt(e.target.value) || 0 })}
          />
        </div>
        <div className="flex justify-end gap-2 mt-4">
          <Button variant="secondary" onClick={() => setShowForm(false)}>
            Cancel
          </Button>
          <Button variant="primary" disabled={!formValid} onClick={saveProduct}>
            {isEditing ? "Save" : "Create"}
          </Button>
        </div>
      </Card>
    </div>
  );
};

const Tabs = () => {
  return (
    <div className="flex gap-4 mb-6 text-gray-600 border-b">
      {[
        "Overview",
        "Product List",
        "Inventory Management",
        "Sales Performance",
        "Marketing",
        "Customer Feedback",
      ].map((tab, i) => (
        <button
          key={i}
          className={`pb-2 px-2 text-sm font-medium ${
            i === 0 ? "border-b-2 border-indigo-600 text-indigo-600" : "hover:text-indigo-600"
          }`}
        >
          {tab}
        </button>
      ))}
    </div>
  );
};

const AdminDashboard = () => {
  const [showForm, setShowForm] = useState(false);
  const [products, setProducts] = useState<Product[]>(initialProducts);
  const [query, setQuery] = useState("");
  const [categoryFilter, setCategoryFilter] = useState("all");
  const [page, setPage] = useState(1);
  const [editing, setEditing] = useState<Product | null>(null);
  const [form, setForm] = useState<Omit<Product, "id">>({
    name: "",
    description: "",
    price: 0,
    categoryId: "c1",
    stock: 0,
    rating: 4.5,
    image: "",
  });

  // Obtém o usuário logado dinamicamente
  const currentUser = getLoggedInUser();
  const permissions = usePermissions(currentUser.role);
  const isEditing = Boolean(editing);
  const pageSize = 6;

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return products.filter((p) => {
      const byName = !q || p.name.toLowerCase().includes(q);
      const byCat = categoryFilter === "all" || p.categoryId === categoryFilter;
      return byName && byCat;
    });
  }, [products, query, categoryFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
  const pageData = filtered.slice((page - 1) * pageSize, page * pageSize);

  const totalProducts = products.length;
  
  const totalStockValue = useMemo(() => 
    products.reduce((acc, p) => acc + p.price * p.stock, 0), 
    [products]
  );
  
  const lowStock = useMemo(() => 
    products.filter((p) => p.stock < 10), 
    [products]
  );
  
  const avgRating = useMemo(() =>
    products.length > 0
      ? products.reduce((acc, p) => acc + (p.rating || 0), 0) / products.length
      : 0,
    [products]
  );

  const perCategory = useMemo(() => {
    return initialCategories.map((c) => ({
      category: c.name,
      count: products.filter((p) => p.categoryId === c.id).length,
    }));
  }, [products]);

  const formValid = Boolean(
    form.name.trim().length > 1 &&
    form.description.trim().length > 2 &&
    form.price > 0 &&
    form.categoryId &&
    form.stock >= 0
  );

  const openCreate = () => {
    setEditing(null);
    setForm({
      name: "",
      description: "",
      price: 0,
      categoryId: initialCategories[0]?.id || "c1",
      stock: 0,
      rating: 4.5,
      image: "",
    });
    setShowForm(true);
  };

  const openEdit = (p: Product) => {
    setEditing(p);
    const { id, ...rest } = p;
    setForm(rest);
    setShowForm(true);
  };

  const saveProduct = () => {
    if (!formValid) return;
    if (isEditing && editing) {
      setProducts(products.map((p) => (p.id === editing.id ? { ...editing, ...form } : p)));
    } else {
      const newProduct: Product = { id: `p${Date.now()}`, ...form };
      setProducts([newProduct, ...products]);
    }
    setShowForm(false);
    setEditing(null);
  };

  const deleteProduct = (id: string) =>
    setProducts(products.filter((p) => p.id !== id));

  const adjustStock = (id: string, delta: number) =>
    setProducts(products.map((p) => 
      p.id === id ? { ...p, stock: Math.max(0, p.stock + delta) } : p
    ));

  const handleLogout = () => {
    localStorage.removeItem('authToken');
    localStorage.removeItem('userData');
    window.location.href = '/login';
  };

  return (
    <div className="flex h-screen w-screen bg-gray-100">
      <Sidebar currentUser={currentUser} />
      
      <main className="flex-1 p-8 overflow-y-auto">
        <Header 
          currentUser={currentUser} 
          onLogout={handleLogout}
          query={query}
          setQuery={setQuery}
          setPage={setPage}
        />

        <Tabs />

        <MetricsCards 
          totalProducts={totalProducts}
          avgRating={avgRating}
          lowStockCount={lowStock.length}
        />

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
          <CategoryChart perCategory={perCategory} />
          <InventoryValue totalStockValue={totalStockValue} />
          <FiltersAndActions 
            categories={initialCategories}
            categoryFilter={categoryFilter}
            setCategoryFilter={setCategoryFilter}
            setPage={setPage}
            openCreate={openCreate}
            canCreateProducts={permissions.canCreateProducts}
          />
        </div>

        <Card>
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-lg font-semibold">Products</h2>
            <div className="text-sm text-gray-500">
              Showing {pageData.length} of {filtered.length}
            </div>
          </div>

          <ProductTable 
            pageData={pageData}
            categories={initialCategories}
            adjustStock={adjustStock}
            openEdit={openEdit}
            deleteProduct={deleteProduct}
            canEditProducts={permissions.canEditProducts}
            canDeleteProducts={permissions.canDeleteProducts}
            canAdjustStock={permissions.canAdjustStock}
          />

          <Pagination 
            page={page}
            totalPages={totalPages}
            setPage={setPage}
          />
        </Card>

        <LowStockAlert lowStock={lowStock} />

        <ProductFormModal 
          showForm={showForm}
          setShowForm={setShowForm}
          isEditing={isEditing}
          form={form}
          setForm={setForm}
          categories={initialCategories}
          formValid={formValid}
          saveProduct={saveProduct}
        />
      </main>
    </div>
  );
};

export default AdminDashboard;
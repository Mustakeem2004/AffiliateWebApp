import React, { useState, useEffect, useMemo } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import Header from './components/Header';
import ProductList from './components/ProductList';
import ProductForm from './components/ProductForm';
import SearchBar from './components/SearchBar';
import AdminLogin from './components/AdminLogin';
import Toast from './components/Toast';
import { loadProducts, saveProducts, generateId, clearProducts } from './utils/localStorage';

const ADMIN_PASSWORD = import.meta.env.VITE_ADMIN_PASSWORD || 'admin123';

function App() {
  const [products, setProducts] = useState(() => {
    const stored = loadProducts();
    return stored.length > 0 ? stored : [];
  });
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [sortBy, setSortBy] = useState('newest');
  const [editingProduct, setEditingProduct] = useState(null);
  const [showForm, setShowForm] = useState(false);
  const [isAdminAuthenticated, setIsAdminAuthenticated] = useState(() => {
    return sessionStorage.getItem('adminAuth') === 'true';
  });
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });
  const [toast, setToast] = useState(null);

  useEffect(() => {
    saveProducts(products);
  }, [products]);

  useEffect(() => {
    document.documentElement.classList.toggle('dark', darkMode);
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const showToast = (message, type = 'success') => {
    setToast({ message, type });
    setTimeout(() => setToast(null), 3000);
  };

  const categories = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category).filter(Boolean))];
    return cats.sort();
  }, [products]);

  const filteredProducts = useMemo(() => {
    let filtered = products.filter((product) => {
      const searchLower = searchTerm.toLowerCase();
      const matchesSearch =
        !searchTerm ||
        product.name.toLowerCase().includes(searchLower) ||
        (product.description && product.description.toLowerCase().includes(searchLower)) ||
        (product.category && product.category.toLowerCase().includes(searchLower));

      const matchesCategory = !selectedCategory || product.category === selectedCategory;

      return matchesSearch && matchesCategory;
    });

    switch (sortBy) {
      case 'price-low':
        filtered.sort((a, b) => (a.price || 0) - (b.price || 0));
        break;
      case 'price-high':
        filtered.sort((a, b) => (b.price || 0) - (a.price || 0));
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
      default:
        filtered.sort((a, b) => new Date(b.createdAt || 0) - new Date(a.createdAt || 0));
        break;
    }

    return filtered;
  }, [products, searchTerm, selectedCategory, sortBy]);

  const addProduct = (productData) => {
    const newProduct = {
      ...productData,
      id: generateId(),
      createdAt: new Date().toISOString(),
    };
    setProducts([newProduct, ...products]);
    setShowForm(false);
    showToast('Product added!');
  };

  const updateProduct = (updatedProduct) => {
    setProducts(
      products.map((p) =>
        p.id === updatedProduct.id ? { ...updatedProduct, updatedAt: new Date().toISOString() } : p
      )
    );
    setEditingProduct(null);
    setShowForm(false);
    showToast('Product updated!');
  };

  const deleteProduct = (id) => {
    setProducts(products.filter((p) => p.id !== id));
    showToast('Product deleted!', 'info');
  };

  const toggleFeatured = (id) => {
    setProducts(
      products.map((p) =>
        p.id === id ? { ...p, featured: !p.featured } : p
      )
    );
  };

  const handleEdit = (product) => {
    setEditingProduct(product);
    setShowForm(true);
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const cancelEdit = () => {
    setEditingProduct(null);
    setShowForm(false);
  };

  const handleClearAll = () => {
    if (window.confirm('Delete ALL products?')) {
      setProducts([]);
      clearProducts();
      showToast('All products cleared!', 'info');
    }
  };

  const handleExport = () => {
    const dataStr = JSON.stringify(products, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `products-${new Date().toISOString().split('T')[0]}.json`;
    link.click();
    URL.revokeObjectURL(url);
    showToast('Exported!');
  };

  const handleImport = (event) => {
    const file = event.target.files[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const imported = JSON.parse(e.target.result);
        if (Array.isArray(imported)) {
          const withIds = imported.map((p) => ({
            ...p,
            id: p.id || generateId(),
          }));
          setProducts([...withIds, ...products]);
          showToast(`Imported ${imported.length} products!`);
        }
      } catch {
        showToast('Invalid file', 'error');
      }
    };
    reader.readAsText(file);
    event.target.value = '';
  };

  const handleAdminLogin = (password) => {
    if (password === ADMIN_PASSWORD) {
      setIsAdminAuthenticated(true);
      sessionStorage.setItem('adminAuth', 'true');
      return true;
    }
    return false;
  };

  const handleAdminLogout = () => {
    setIsAdminAuthenticated(false);
    sessionStorage.removeItem('adminAuth');
  };

  const clearFilters = () => {
    setSearchTerm('');
    setSelectedCategory('');
    setSortBy('newest');
  };

  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={
          <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
            <Header darkMode={darkMode} setDarkMode={setDarkMode} />
            <main className="container mx-auto px-4 py-6 max-w-6xl">
              
              {products.length > 0 && (
                <div className="mb-6">
                  <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} darkMode={darkMode} />
                </div>
              )}

              {products.length > 5 && (
                <div className="flex flex-wrap gap-3 mb-6">
                  {categories.length > 0 && (
                    <select
                      value={selectedCategory}
                      onChange={(e) => setSelectedCategory(e.target.value)}
                      className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-700 border-gray-200'} border`}
                    >
                      <option value="">All Categories</option>
                      {categories.map((cat) => (
                        <option key={cat} value={cat}>{cat}</option>
                      ))}
                    </select>
                  )}
                  <select
                    value={sortBy}
                    onChange={(e) => setSortBy(e.target.value)}
                    className={`px-4 py-2 rounded-lg text-sm ${darkMode ? 'bg-gray-800 text-white border-gray-700' : 'bg-white text-gray-700 border-gray-200'} border`}
                  >
                    <option value="newest">Newest</option>
                    <option value="price-low">Price: Low to High</option>
                    <option value="price-high">Price: High to Low</option>
                    <option value="name">Name</option>
                  </select>
                  {(searchTerm || selectedCategory) && (
                    <button onClick={clearFilters} className="text-blue-500 text-sm font-medium">
                      Clear
                    </button>
                  )}
                </div>
              )}

              <ProductList products={filteredProducts} isAdmin={false} darkMode={darkMode} />

              {products.length === 0 && (
                <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-6xl mb-4">🛒</p>
                  <p className="text-xl">No products yet</p>
                </div>
              )}

              {products.length > 0 && filteredProducts.length === 0 && (
                <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                  <p className="text-4xl mb-4">🔍</p>
                  <p>No products found</p>
                  <button onClick={clearFilters} className="mt-4 text-blue-500 font-medium">
                    Clear filters
                  </button>
                </div>
              )}
            </main>
          </div>
        } />
        
        <Route path="/admin" element={
          isAdminAuthenticated ? (
            <div className={`min-h-screen ${darkMode ? 'bg-gray-900' : 'bg-gray-50'}`}>
              <Header isAdmin={true} onLogout={handleAdminLogout} darkMode={darkMode} setDarkMode={setDarkMode} />
              <main className="container mx-auto px-4 py-6 max-w-6xl">
                
                <div className="flex flex-wrap gap-3 mb-6">
                  <button
                    onClick={() => { setShowForm(!showForm); setEditingProduct(null); }}
                    className="bg-blue-600 hover:bg-blue-700 text-white px-5 py-2.5 rounded-lg font-medium"
                  >
                    {showForm ? '✕ Close' : '+ Add Product'}
                  </button>
                  <button
                    onClick={handleExport}
                    disabled={products.length === 0}
                    className="bg-green-600 hover:bg-green-700 disabled:bg-gray-400 text-white px-4 py-2.5 rounded-lg font-medium"
                  >
                    Export
                  </button>
                  <label className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2.5 rounded-lg font-medium cursor-pointer">
                    Import
                    <input type="file" accept=".json" onChange={handleImport} className="hidden" />
                  </label>
                  {products.length > 0 && (
                    <button
                      onClick={handleClearAll}
                      className="bg-red-600 hover:bg-red-700 text-white px-4 py-2.5 rounded-lg font-medium"
                    >
                      Clear All
                    </button>
                  )}
                </div>

                {showForm && (
                  <div className="mb-6">
                    <ProductForm
                      key={editingProduct?.id || 'new'}
                      addProduct={addProduct}
                      editingProduct={editingProduct}
                      updateProduct={updateProduct}
                      cancelEdit={cancelEdit}
                      darkMode={darkMode}
                    />
                  </div>
                )}

                {products.length > 0 && (
                  <div className="mb-6">
                    <SearchBar searchTerm={searchTerm} setSearchTerm={setSearchTerm} darkMode={darkMode} />
                  </div>
                )}

                <div className={`mb-6 p-4 rounded-lg ${darkMode ? 'bg-gray-800' : 'bg-white'}`}>
                  <span className={darkMode ? 'text-gray-300' : 'text-gray-600'}>
                    {products.length} products total
                    {filteredProducts.length !== products.length && ` • ${filteredProducts.length} shown`}
                  </span>
                </div>

                <ProductList 
                  products={filteredProducts} 
                  onEdit={handleEdit} 
                  onDelete={deleteProduct} 
                  onToggleFeatured={toggleFeatured}
                  isAdmin={true} 
                  darkMode={darkMode} 
                />

                {products.length === 0 && (
                  <div className={`text-center py-20 ${darkMode ? 'text-gray-400' : 'text-gray-500'}`}>
                    <p className="text-6xl mb-4">📦</p>
                    <p className="text-xl mb-2">No products yet</p>
                    <p className="text-sm">Click "Add Product" to get started</p>
                  </div>
                )}
              </main>
            </div>
          ) : (
            <AdminLogin onLogin={handleAdminLogin} />
          )
        } />
        
        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
      {toast && <Toast message={toast.message} type={toast.type} onClose={() => setToast(null)} />}
    </BrowserRouter>
  );
}

export default App;

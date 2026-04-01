const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

export const api = {
  // Get all products
  async getProducts() {
    const res = await fetch(`${API_URL}/api/products`);
    if (!res.ok) throw new Error('Failed to fetch products');
    return res.json();
  },

  // Add a product
  async addProduct(product) {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to add product');
    return res.json();
  },

  // Update a product
  async updateProduct(id, product) {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    });
    if (!res.ok) throw new Error('Failed to update product');
    return res.json();
  },

  // Delete a product
  async deleteProduct(id) {
    const res = await fetch(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to delete product');
    return res.json();
  },

  // Toggle featured
  async toggleFeatured(id) {
    const res = await fetch(`${API_URL}/api/products/${id}/featured`, {
      method: 'PATCH',
    });
    if (!res.ok) throw new Error('Failed to toggle featured');
    return res.json();
  },

  // Delete all products
  async clearAll() {
    const res = await fetch(`${API_URL}/api/products`, {
      method: 'DELETE',
    });
    if (!res.ok) throw new Error('Failed to clear products');
    return res.json();
  },
};

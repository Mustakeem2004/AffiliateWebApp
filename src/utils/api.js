const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000';

// Fetch with timeout
async function fetchWithTimeout(url, options = {}, timeout = 15000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const res = await fetch(url, { ...options, signal: controller.signal });
    clearTimeout(timeoutId);
    return res;
  } catch (error) {
    clearTimeout(timeoutId);
    throw error;
  }
}

// Retry mechanism for failed requests
async function fetchWithRetry(url, options = {}, retries = 2, timeout = 15000) {
  let lastError;
  for (let i = 0; i <= retries; i++) {
    try {
      const res = await fetchWithTimeout(url, options, timeout);
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      return res;
    } catch (error) {
      lastError = error;
      if (i < retries) {
        // Wait before retrying (exponential backoff)
        await new Promise(resolve => setTimeout(resolve, Math.pow(2, i) * 1000));
      }
    }
  }
  throw lastError;
}

export const api = {
  // Get all products
  async getProducts() {
    // Use 30s timeout for first load (cold start), then 15s for retries
    const res = await fetchWithRetry(`${API_URL}/api/products`, {}, 2, 30000);
    return res.json();
  },

  // Add a product
  async addProduct(product) {
    const res = await fetchWithRetry(`${API_URL}/api/products`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }, 1, 15000);
    return res.json();
  },

  // Update a product
  async updateProduct(id, product) {
    const res = await fetchWithRetry(`${API_URL}/api/products/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(product),
    }, 1, 15000);
    return res.json();
  },

  // Delete a product
  async deleteProduct(id) {
    const res = await fetchWithRetry(`${API_URL}/api/products/${id}`, {
      method: 'DELETE',
    }, 1, 15000);
    return res.json();
  },

  // Toggle featured
  async toggleFeatured(id) {
    const res = await fetchWithRetry(`${API_URL}/api/products/${id}/featured`, {
      method: 'PATCH',
    }, 1, 15000);
    return res.json();
  },

  // Delete all products
  async clearAll() {
    const res = await fetchWithRetry(`${API_URL}/api/products`, {
      method: 'DELETE',
    }, 1, 15000);
    return res.json();
  },
};

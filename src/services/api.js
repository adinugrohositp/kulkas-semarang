const API_URL = import.meta.env.VITE_API_URL || '/api';

export const api = {
    // Get all products
    async getProducts() {
        const response = await fetch(`${API_URL}/products`);
        if (!response.ok) throw new Error('Failed to fetch products');
        return response.json();
    },

    // Create new product
    async createProduct(product) {
        const response = await fetch(`${API_URL}/products`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Failed to create product');
        return response.json();
    },

    // Update product
    async updateProduct(id, product) {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(product)
        });
        if (!response.ok) throw new Error('Failed to update product');
        return response.json();
    },

    // Delete product
    async deleteProduct(id) {
        const response = await fetch(`${API_URL}/products/${id}`, {
            method: 'DELETE'
        });
        if (!response.ok) throw new Error('Failed to delete product');
        return response.json();
    },

    // Upload file to S3
    async uploadFile(file) {
        const formData = new FormData();
        formData.append('image', file);

        const response = await fetch(`${API_URL}/upload/file`, {
            method: 'POST',
            body: formData
        });
        if (!response.ok) throw new Error('Failed to upload file');
        return response.json();
    },

    // Upload from URL to S3
    async uploadFromUrl(url) {
        const response = await fetch(`${API_URL}/upload/url`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ url })
        });
        if (!response.ok) throw new Error('Failed to upload from URL');
        return response.json();
    },

    // Settings API
    async getSettings() {
        const response = await fetch(`${API_URL}/settings`);
        if (!response.ok) throw new Error('Failed to fetch settings');
        return response.json();
    },

    async updateSetting(key, value) {
        const response = await fetch(`${API_URL}/settings/${key}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ value })
        });
        if (!response.ok) throw new Error('Failed to update setting');
        return response.json();
    },

    // Auth
    async login(password) {
        const response = await fetch(`${API_URL}/auth/login`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ password })
        });
        if (!response.ok) throw new Error('Password salah');
        return response.json();
    },

    // Checkout
    async checkout(cart) {
        const response = await fetch(`${API_URL}/checkout`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ cart })
        });
        if (!response.ok) throw new Error('Failed to checkout');
        return response.json();
    },

    // Reports
    async getReports(period) {
        const response = await fetch(`${API_URL}/reports${period ? `?period=${period}` : ''}`);
        if (!response.ok) throw new Error('Failed to fetch reports');
        return response.json();
    },

    // Helper to resolve image URLs
    resolveImage(url) {
        if (!url) return null;
        if (url.startsWith('http')) return url;
        // If it starts with /api/image, make sure it's absolute if API_URL is absolute, 
        // or keep relative if API_URL is relative.
        if (url.startsWith('/api/image')) {
            if (API_URL.startsWith('http')) {
                const baseUrl = API_URL.replace('/api', '');
                return `${baseUrl}${url}`;
            }
            return url; // Keep relative
        }
        return url;
    }
};

const express = require('express');
const router = express.Router();
const db = require('../db');

// GET all products
router.get('/', (req, res) => {
    try {
        const products = db.prepare('SELECT * FROM products ORDER BY created_at DESC').all();

        // Process image URLs to use proxy if they are S3 URLs
        const processedProducts = products.map(p => {
            if (p.image && p.image.startsWith('http') && (p.image.includes('hcp1-djpb.kemenkeu.go.id') || p.image.includes('hitachi'))) {
                // Extract the key part: products/filename.ext
                const parts = p.image.split('/products/');
                if (parts.length > 1) {
                    return { ...p, image: `/api/image/products/${parts[1]}` };
                }
            }
            return p;
        });

        res.json(processedProducts);
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// POST create new product
router.post('/', (req, res) => {
    try {
        const { name, price, category, image, stock, initial_stock } = req.body;

        console.log('Creating product:', { name, price, category, stock });

        if (!name || !price || !category || !image) {
            return res.status(400).json({ error: 'Name, price, category, and image are required' });
        }

        const insert = db.prepare(`
      INSERT INTO products (name, price, category, image, stock, initial_stock) 
      VALUES (?, ?, ?, ?, ?, ?)
    `);

        const result = insert.run(name, price, category, image, stock || 0, initial_stock || 0);
        const newProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(result.lastInsertRowid);

        console.log('Product created successfully:', newProduct.id);

        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error creating product:', error);
        res.status(500).json({ error: 'Failed to create product', details: error.message });
    }
});

// PUT update product
router.put('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const { name, price, category, image, stock, initial_stock } = req.body;

        if (!name || !price || !category || !image) {
            return res.status(400).json({ error: 'Name, price, category, and image are required' });
        }

        const update = db.prepare(`
      UPDATE products 
      SET name = ?, price = ?, category = ?, image = ?, stock = ?, initial_stock = ?
      WHERE id = ?
    `);

        const result = update.run(name, price, category, image, stock || 0, initial_stock || 0, id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        const updatedProduct = db.prepare('SELECT * FROM products WHERE id = ?').get(id);
        res.json(updatedProduct);
    } catch (error) {
        console.error('Error updating product:', error);
        res.status(500).json({ error: 'Failed to update product' });
    }
});

// DELETE product
router.delete('/:id', (req, res) => {
    try {
        const { id } = req.params;
        const deleteStmt = db.prepare('DELETE FROM products WHERE id = ?');
        const result = deleteStmt.run(id);

        if (result.changes === 0) {
            return res.status(404).json({ error: 'Product not found' });
        }

        res.json({ message: 'Product deleted successfully' });
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(500).json({ error: 'Failed to delete product' });
    }
});

module.exports = router;

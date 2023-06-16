const express = require("express");
const ProductManager = require("./ProductManager");
const app = express();
const productManager = new ProductManager("products.json");

const port = 8080;

app.get('/products', async (req, res) => {
    const { limit } = req.query;
    try {
        const products = await productManager.getProducts();
        if (limit) {
            const limitedProducts = products.slice(0, parseInt(limit));
            res.json(limitedProducts);
        } else {
            res.json(products);
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener los productos" });
    }
});

app.get('/products/:pid', async (req, res) => {
    const productId = parseInt(req.params.pid);
    try {
        const product = await productManager.getProductById(productId);
        if (product) {
            res.json(product);
        } else {
            res.status(404).json({ error: "Producto no encontrado" });
        }
    } catch (error) {
        res.status(500).json({ error: "Error al obtener el producto" });
    }
});

app.listen(port, () => {
    console.log(`Servidor Express escuchando en el puerto ${port}`);
});

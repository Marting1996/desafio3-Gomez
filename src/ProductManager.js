const fs = require("fs");

class ProductManager {
    constructor(filename) {
      this.filename = filename;
      this.format = "utf-8";
      this.products = [];
      this.nextId = null; 
      this.path = "./products.json";
      this.archivo();
    }
  
    archivo = async () => {
      try {
        await fs.promises.access(this.filename);
      } catch (error) {
        await fs.promises.writeFile(this.filename, "[]");
      }
    };
  
    addProduct = async (title, description, price, thumbnail, code, stock) => {
      if (!title || !description || !price || !thumbnail || !code || !stock) {
        console.log("Todos los campos son obligatorios");
        return;
      }
      const products = await this.getProducts();
  
      const productoRepetido = products.find((product) => product.code === code);
      if (productoRepetido) {
        console.log("El producto ya existe");
        return;
      }
  
      const product = {
        id: this.nextId || this.getNextId(products), 
        title,
        description,
        price,
        thumbnail,
        code,
        stock,
      };
      this.products.push(product);
      products.push(product);
      await fs.promises.writeFile(this.filename, JSON.stringify(products));
      if (!this.nextId) {
        this.nextId = product.id + 1; 
      }
    };
  
    getNextId = (products) => {
      return products.length > 0 ? Math.max(...products.map((product) => product.id)) + 1 : 1;
    };
  
  
    getProducts = async () => {
        try {
            const data = await fs.promises.readFile(this.filename, this.format);
            const dataObj = JSON.parse(data);
            return dataObj;
        } catch (error) {
            console.log(`Error: ${error}`);
            return [];
        }
    };

    getProductById = async (id) => {
        try {
            const products = await this.getProducts();
            const product = products.find((product) => product.id === id);
            if (product) {
                return product;
            } else {               
                console.log("Product not found");
                return null;
            }
        } catch (error) {
            console.log(`Error: ${error}`);
            return null;
        }
    };
    
    deleteProduct = async (id) => {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex !== -1) {
                products.splice(productIndex, 1);
                await fs.promises.writeFile(this.filename, JSON.stringify(products));
                console.log("El producto se eliminó correctamente");
            } else {
                console.log("Producto a eliminar no encontrado");
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    }

    updateProduct = async (id, updateFields) => {
        try {
            const products = await this.getProducts();
            const productIndex = products.findIndex((product) => product.id === id);
            if (productIndex !== -1) {
                const updatedProduct = { ...products[productIndex], ...updateFields };
                products[productIndex] = updatedProduct;
                await fs.promises.writeFile(this.filename, JSON.stringify(products));
                console.log("El producto se actualizó correctamente");
            } else {
                console.log("Producto a actualizar no encontrado");
            }
        } catch (error) {
            console.log(`Error: ${error}`);
        }
    };
}

module.exports = ProductManager;


// TEST
const testProductManager = async () => {
    const manager = new ProductManager("products.json");
    await manager.addProduct("Moto", "Tiene 2 ruedas", 500, "img", "codigo 1", 13);
    await manager.addProduct("Auto", "Tiene 4 ruedas", 1500, "img", "codigo 2", 3);
    await manager.addProduct("Bici", "Tiene 2 ruedas", 250, "img", "codigo 3", 10);

    console.log("Todos los productos", await  manager.getProducts());
    console.log("---------------------");
    console.log("Buscar producto con ID 1:", await  manager.getProductById(1));
    console.log("---------------------");
    console.log("Buscar producto con ID inexistente:", await  manager.getProductById(4));
    console.log("---------------------");

    const productToUpdate = await manager.getProductById(1);
    if (productToUpdate) {
        await manager.updateProduct(productToUpdate.id, { price: 600 });
    }

    const productToDelete = await manager.getProductById(3);
    if (productToDelete) {
        await manager.deleteProduct(productToDelete.id);
    }

    console.log(await manager.getProducts());
};

//testProductManager();




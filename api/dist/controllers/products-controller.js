const listProducts = async (req, res) => {
    res.send("Product List");
};
const getProductById = async (req, res) => {
    console.log(req.params);
    res.send('A product');
};
const addProduct = async (req, res) => {
    res.send("Product Added");
};
const updateProduct = async (req, res) => {
    res.send("Product updated");
};
const deleteProduct = async (req, res) => {
    res.send("Product deleted");
};
export default {
    listProducts,
    getProductById,
    addProduct,
    updateProduct,
    deleteProduct
};

import { Product } from "../models/Product.js";

export const addProduct = async (req, res) => {
  try {
    const { height, width, material, rate, stock } = req.body;

    const newProduct = new Product({
      seller: req.user.id,

      height,
      width,
      material,
      rate,
      stock,
    });

    await newProduct.save();
    res.status(201).json({ message: "Product added", product: newProduct });
  } catch (err) {
    console.error("❌ Error in addProduct:", err);
    res
      .status(500)
      .json({ message: "Failed to add product", error: err.message });
  }
};

export const getSellerProducts = async (req, res) => {
  try {
    const products = await Product.find({ seller: req.user.id });
    res.status(200).json({ products });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to fetch products", error: err.message });
  }
};

export const markProductSold = async (req, res) => {
  try {
    const { id } = req.params;

    const product = await Product.findOneAndUpdate(
      { _id: id, seller: req.user.id },
      { isSold: true },
      { new: true }
    );

    if (!product) {
      return res
        .status(404)
        .json({ message: "Product not found or not authorized" });
    }

    res.status(200).json({ message: "Product marked as sold", product });
  } catch (err) {
    res
      .status(500)
      .json({ message: "Failed to update product", error: err.message });
  }
};

require("dotenv").config();
const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const dbName = process.env.dbName
const app = express();
// CORS configuration
const corsOptions = {
  origin: ['http://localhost:5000','https://estore-frontend.onrender.com'], // Add allowed origins
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization', 'username', 'imageurl'], // Add any other headers you need
  credentials: true, // Allow cookies and credentials
};

app.use(cors(corsOptions)); // Apply CORS before routes
// Handle preflight requests for CORS
app.options('*', cors(corsOptions));
app.use(express.json());

// Connect to MongoDB
mongoose.connect(`${process.env.MONGO_URI}/${dbName}`)
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error(err));

// Product model
const Product = mongoose.model("Product", new mongoose.Schema({
  name: String,
  price: Number,
  description: String,
  imageUrl: String,
}));

// API routes
app.get("/products", async (req, res) => {
  const products = await Product.find();
  res.json(products);
});

app.post("/products", async (req, res) => {
  const product = new Product(req.body);
  await product.save();
  res.status(201).json(product);
});

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

import express from "express";
import cors from "cors";
import { v4 as uuid } from "uuid";
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 4242;

app.use(cors());
app.use(express.json());

// Ensure `data` directory exists
const dataDir = path.join(__dirname, "data");
if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const productsFile = path.join(dataDir, "supplierProducts.json");
const ordersFile = path.join(dataDir, "orders.json");

// Create products file if missing
if (!fs.existsSync(productsFile)) {
  fs.writeFileSync(
    productsFile,
    JSON.stringify(
      [
        { sku: "sku1", title: "T-shirt", description: "Cotton T-shirt", price: 500 },
        { sku: "sku2", title: "Shoes", description: "Running shoes", price: 1500 },
        { sku: "sku3", title: "Backpack", description: "Stylish backpack", price: 1200 }
      ],
      null,
      2
    )
  );
}

// Create orders file if missing
if (!fs.existsSync(ordersFile)) {
  fs.writeFileSync(ordersFile, JSON.stringify([], null, 2));
}

const products = JSON.parse(fs.readFileSync(productsFile));

// Routes
app.get("/api/dropship/products", (req, res) => {
  res.json(products);
});

app.get("/api/dropship/shipping-options", (req, res) => {
  res.json([
    { id: "standard", label: "Standard (5-7 days)", amount: 50 },
    { id: "express", label: "Express (2-3 days)", amount: 150 }
  ]);
});

app.post("/api/dropship/checkout", (req, res) => {
  const orderId = uuid();
  let orders = [];
  if (fs.existsSync(ordersFile)) {
    orders = JSON.parse(fs.readFileSync(ordersFile));
  }
  orders.push({ id: orderId, ...req.body, status: "processing" });
  fs.writeFileSync(ordersFile, JSON.stringify(orders, null, 2));
  res.json({ orderId, status: "processing" });
});

// Start server
app.listen(PORT, () => console.log(`Dropship server running on http://localhost:${PORT}`));

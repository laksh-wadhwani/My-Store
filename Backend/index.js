const express = require("express");
const mongoose = require("mongoose");
const axios = require("axios");
const cors = require("cors");

const app = express();
app.use(express.json());
app.use(cors());

mongoose.connect("mongodb://localhost:27017/productsDB", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

const pricingSchema = new mongoose.Schema({
  id: Number,
  value: Number,
  currency_code: String,
});

const Pricing = mongoose.model("Pricing", pricingSchema);

// GET product
app.get("/products/:id", async (req, res) => {
  const id = req.params.id;
  try {
    const productRes = await axios.get(`https://fakestoreapi.com/products/${id}`);
    console.log(productRes)
    const pricing = await Pricing.findOne({ id: Number(id) });

    // if (!pricing) return res.status(404).json({ message: "Price not found" });

    res.json({
      id: productRes.data.id,
      title: productRes.data.title,
      current_price: {
        value: pricing?.value || 0,
        currency_code: pricing?.currency_code || "USD",
      },
    });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// PUT price update
app.put("/products/:id", async (req, res) => {
  const id = req.params.id;
  const { value, currency_code } = req.body.current_price;
  try {
    const updated = await Pricing.findOneAndUpdate(
      { id: Number(id) },
      { value, currency_code },
      { new: true, upsert: true }
    );
    res.json(updated);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

app.listen(5000, () => console.log("Server running on port 5000"));

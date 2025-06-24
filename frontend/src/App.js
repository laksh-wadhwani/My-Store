import React, { useEffect, useState } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [products, setProducts] = useState([]);
  const [search, setSearch] = useState("");

  const fetchProducts = async () => {
    const ids = [1, 2, 3, 4, 5];
    const data = await Promise.all(
      ids.map((id) => axios.get(`http://localhost:5000/products/${id}`))
    );
    setProducts(data.map((res) => res.data));
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const updatePrice = async (id, value) => {
    await axios.put(`http://localhost:5000/products/${id}`, {
      current_price: { value: Number(value), currency_code: "USD" },
    });
    fetchProducts();
  };

  return (
    <div className="App">
      <h1>Product List</h1>
      <input
        type="text"
        placeholder="Search by name"
        value={search}
        onChange={(e) => setSearch(e.target.value)}
      />
      <div className="products">
        {products
          .filter((p) => p.title.toLowerCase().includes(search.toLowerCase()))
          .map((product) => (
            <div key={product.id} className="product">
              <h3>{product.title}</h3>
              <p>Price: ${product.current_price.value} {product.current_price.currency_code}</p>
              <input
                type="number"
                placeholder="New Price"
                onBlur={(e) => updatePrice(product.id, e.target.value)}
              />
            </div>
          ))}
      </div>
    </div>
  );
}

export default App;

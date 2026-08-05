import { useCart } from "../../context/CartContext";

export default function ProductCard({ product }) {
  const { addToCart } = useCart();

  return (
    <div className="border p-4 rounded-lg shadow">
      <img src={product.image} className="h-40 w-full object-cover" />

      <h3>{product.name}</h3>
      <p>₹{product.price}</p>

      <button
        onClick={() => addToCart(product)}
        className="bg-pink-500 text-white px-4 py-2 rounded"
      >
        Add to Cart
      </button>
    </div>
  );
}
"use client";

import { useState } from "react";
import { useStore } from "../lib/context/StoreContext";
import { CheckCircle2, ShoppingBag, Heart, MapPin, Zap } from "lucide-react";
import { useRouter } from "next/navigation";

interface ProductActionsProps {
  product: {
    id: string;
    brand: string;
    name: string;
    price: number;
    originalPrice?: number;
    image: string;
  };
}

export default function ProductActions({ product }: ProductActionsProps) {
  const { addToCart, toggleWishlist, isInWishlist } = useStore();
  const [added, setAdded] = useState(false);
  const router = useRouter();
  const isWishlisted = isInWishlist(product.id);

  // Delivery check state
  const [pincode, setPincode] = useState("");
  const [deliveryStatus, setDeliveryStatus] = useState<"idle" | "loading" | "success" | "error">("idle");
  const [deliveryMsg, setDeliveryMsg] = useState("");

  const handleAddToCart = () => {
    addToCart(product);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product);
    router.push("/checkout");
  };

  const handleToggleWishlist = () => {
    toggleWishlist(product.id);
  };

  const checkDelivery = () => {
     if (pincode.length !== 6) {
        setDeliveryStatus("error");
        setDeliveryMsg("Please enter a valid 6-digit Pincode.");
        return;
     }
     setDeliveryStatus("loading");
     setTimeout(() => {
        // Valid Indian pincode validation (approximate)
        if (/^[1-9][0-9]{5}$/.test(pincode)) {
           setDeliveryStatus("success");
           setDeliveryMsg("Delivery available within 3-5 days.");
        } else {
           setDeliveryStatus("error");
           setDeliveryMsg("Sorry, we do not deliver to this pincode.");
        }
     }, 800); // Simulate network latency
  };

  const detectLocation = () => {
     if (!navigator.geolocation) {
         setDeliveryStatus("error");
         setDeliveryMsg("Geolocation is not supported by your browser.");
         return;
     }
     setDeliveryStatus("loading");
     navigator.geolocation.getCurrentPosition(async (position) => {
         try {
             const res = await fetch(`https://nominatim.openstreetmap.org/reverse?lat=${position.coords.latitude}&lon=${position.coords.longitude}&format=json`);
             const data = await res.json();
             if (data && data.address && data.address.postcode) {
                 const code = data.address.postcode.replace(/\s+/g,'');
                 setPincode(code);
                 setDeliveryStatus("success");
                 setDeliveryMsg(`Detected Pincode ${code}. Delivery available within 3-5 days.`);
             } else {
                 setDeliveryStatus("error");
                 setDeliveryMsg("Could not detect exact pincode. Enter manually.");
             }
         } catch(e) {
             setDeliveryStatus("error");
             setDeliveryMsg("Failed to auto-detect location.");
         }
     }, () => {
         setDeliveryStatus("error");
         setDeliveryMsg("Permission denied. Could not access location.");
     });
  };

  return (
    <div className="flex flex-col gap-6 mb-12">
      {/* Delivery Location Checker Widget */}
      <div className="bg-[#0a0a0a] border border-[#222] p-5 flex flex-col gap-4 shadow-sm">
         <div className="flex items-center justify-between text-sm uppercase tracking-widest text-[#d4af37] font-bold">
            <span className="flex items-center gap-2"><MapPin size={16} /> Check Delivery options</span>
            <button onClick={detectLocation} className="text-[10px] text-gray-400 hover:text-white underline decoration-[#333] hover:decoration-white transition-all">Detect My Location</button>
         </div>
         <div className="flex gap-2 h-12">
            <input 
               type="text" 
               placeholder="Enter 6-digit Pincode" 
               value={pincode}
               onChange={(e) => setPincode(e.target.value.replace(/\D/g, '').slice(0, 6))}
               onKeyDown={(e) => e.key === 'Enter' && checkDelivery()}
               className="flex-1 bg-black border border-[#333] px-4 text-sm text-white placeholder-gray-600 focus:outline-none focus:border-[#d4af37] transition-colors"
            />
            <button onClick={checkDelivery} className="bg-[#222] hover:bg-[#333] text-white px-6 text-sm font-bold tracking-widest uppercase transition-colors shrink-0">
               Check
            </button>
         </div>
         {deliveryStatus === "loading" && <span className="text-xs text-gray-400 animate-pulse">Checking availability...</span>}
         {deliveryStatus === "success" && <span className="text-xs text-green-500 font-bold tracking-wide">{deliveryMsg}</span>}
         {deliveryStatus === "error" && <span className="text-xs text-red-500">{deliveryMsg}</span>}
      </div>

      <div className="flex gap-4">
        {/* Buy Now (Primary Action) */}
        <button 
          onClick={handleBuyNow}
          className="flex-1 flex items-center justify-center gap-2 bg-[#d4af37] text-black py-5 uppercase tracking-[0.2em] font-bold text-sm hover:bg-white transition-colors duration-300 shadow-[0_0_15px_rgba(212,175,55,0.2)]"
        >
          <Zap size={18} fill="currentColor" /> Buy Now
        </button>
        {/* Wishlist */}
        <button 
          onClick={handleToggleWishlist}
          title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          className={`px-6 border transition-colors flex items-center justify-center ${
            isWishlisted 
            ? "border-red-500 bg-red-500/10 text-red-500" 
            : "border-[#333] hover:border-[#d4af37] text-white hover:text-[#d4af37]"
          }`}
        >
          <Heart size={20} className={isWishlisted ? "fill-current" : ""} />
        </button>
      </div>
      
      {/* Add To Cart (Secondary Action) */}
      <button 
        onClick={handleAddToCart}
        className="w-full flex items-center justify-center gap-2 bg-black border border-[#d4af37] text-[#d4af37] py-4 uppercase tracking-[0.2em] font-bold text-sm hover:bg-[#111] hover:text-white transition-colors"
      >
        {added ? <><CheckCircle2 size={18} /> Added To Bag</> : <><ShoppingBag size={18} /> Add To Bag</>}
      </button>
    </div>
  );
}

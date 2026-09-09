// localStorage-based data store for ShoeShop

import { Product } from "@/types/product";

export type Order = {
  id: string;
  customer_name: string;
  customer_email: string;
  customer_phone: string;
  address: string;
  city: string;
  province: string;
  postal_code: string;
  payment_method: string;
  total_amount: number;
  status: string;
  created_at: string;
  order_items: OrderItem[];
};

export type OrderItem = {
  id: number;
  product_name: string;
  size: string | null;
  color: string | null;
  price: number;
  quantity: number;
  subtotal: number;
};

const PRODUCTS_KEY = "shoeshop-products";
const ORDERS_KEY   = "shoeshop-all-orders";

const SEED_PRODUCTS: Product[] = [
  // ── SNEAKERS (category_id: 1) ──
  { id: 1,  name: "Nike Air Max 270",        brand: "Nike",         category_id: 1, description: "Lightweight Air-cushioned sneaker with a large heel unit for all-day comfort and bold street style.", price: 7995,  stock: 20, sold_quantity: 45, image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",  rating: 4.8, sizes: ["38","39","40","41","42"], colors: ["Black","White"] },
  { id: 2,  name: "Adidas Superstar",         brand: "Adidas",       category_id: 1, description: "Iconic shell-toe sneaker with a classic leather upper. A timeless streetwear staple since 1969.", price: 5495,  stock: 18, sold_quantity: 60, image_url: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600",  rating: 4.7, sizes: ["37","38","39","40","41","42"], colors: ["White","Black"] },
  { id: 3,  name: "Puma RS-X",                brand: "Puma",         category_id: 1, description: "Retro-inspired chunky sneaker with bold color-blocking and a thick RS cushioning sole.", price: 4999,  stock: 14, sold_quantity: 33, image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",  rating: 4.5, sizes: ["38","39","40","41"], colors: ["White","Red","Blue"] },
  { id: 4,  name: "New Balance 550",          brand: "New Balance",  category_id: 1, description: "Basketball-inspired low-top sneaker with a clean leather upper and vintage court aesthetic.", price: 6295,  stock: 10, sold_quantity: 28, image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600",  rating: 4.6, sizes: ["39","40","41","42","43"], colors: ["White","Green","Gray"] },
  { id: 5,  name: "Converse Chuck Taylor",    brand: "Converse",     category_id: 1, description: "The original canvas high-top sneaker. Effortlessly cool and endlessly versatile for any outfit.", price: 3495,  stock: 30, sold_quantity: 75, image_url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600",  rating: 4.6, sizes: ["36","37","38","39","40","41","42"], colors: ["Black","White","Red"] },

  // ── RUNNING SHOES (category_id: 2) ──
  { id: 6,  name: "Nike Pegasus 40",          brand: "Nike",         category_id: 2, description: "Versatile daily trainer with React foam cushioning and a breathable mesh upper for long-distance runs.", price: 8995,  stock: 16, sold_quantity: 41, image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",  rating: 4.7, sizes: ["39","40","41","42","43"], colors: ["Blue","Black","White"] },
  { id: 7,  name: "Adidas Ultraboost 23",     brand: "Adidas",       category_id: 2, description: "Premium running shoe with responsive Boost midsole and a Primeknit+ upper that moves with your foot.", price: 9500,  stock: 12, sold_quantity: 38, image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",  rating: 4.8, sizes: ["39","40","41","42"], colors: ["White","Blue","Black"] },
  { id: 8,  name: "ASICS Gel-Kayano 30",      brand: "ASICS",        category_id: 2, description: "Stability running shoe with GEL technology and FF BLAST PLUS cushioning for overpronation support.", price: 10500, stock: 9,  sold_quantity: 22, image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600",  rating: 4.7, sizes: ["39","40","41","42","43"], colors: ["Blue","Black"] },
  { id: 9,  name: "New Balance Fresh Foam",   brand: "New Balance",  category_id: 2, description: "Plush Fresh Foam X midsole delivers a cushioned ride for everyday training and long runs.", price: 7495,  stock: 15, sold_quantity: 30, image_url: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600",  rating: 4.6, sizes: ["38","39","40","41","42"], colors: ["Gray","White","Navy"] },
  { id: 10, name: "Puma Velocity Nitro 2",    brand: "Puma",         category_id: 2, description: "Lightweight running shoe with NITRO foam technology for a responsive and energized ride.", price: 6995,  stock: 11, sold_quantity: 19, image_url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600",  rating: 4.5, sizes: ["39","40","41","42"], colors: ["Black","Yellow","White"] },

  // ── BASKETBALL SHOES (category_id: 3) ──
  { id: 11, name: "Nike LeBron 21",           brand: "Nike",         category_id: 3, description: "Signature shoe of LeBron James with Max Air cushioning and a supportive fit for dominant court play.", price: 14995, stock: 8,  sold_quantity: 35, image_url: "https://images.unsplash.com/photo-1579338559194-a162d19bf842?w=600",  rating: 4.9, sizes: ["40","41","42","43","44"], colors: ["Black","Gold","Red"] },
  { id: 12, name: "Adidas Harden Vol. 7",     brand: "Adidas",       category_id: 3, description: "James Harden's signature shoe with Lightstrike Pro cushioning and a wide base for quick cuts.", price: 12500, stock: 7,  sold_quantity: 20, image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",  rating: 4.7, sizes: ["40","41","42","43"], colors: ["Black","White","Red"] },
  { id: 13, name: "Under Armour Curry 11",    brand: "Under Armour", category_id: 3, description: "Stephen Curry's latest signature shoe with UA Flow cushioning for unmatched court feel and traction.", price: 13500, stock: 6,  sold_quantity: 18, image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",  rating: 4.8, sizes: ["39","40","41","42","43"], colors: ["Blue","Gold","White"] },
  { id: 14, name: "Puma MB.03",               brand: "Puma",         category_id: 3, description: "LaMelo Ball's signature shoe with Nitro Elite foam and a bold design for explosive on-court performance.", price: 11995, stock: 10, sold_quantity: 15, image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600",  rating: 4.6, sizes: ["40","41","42","43"], colors: ["White","Purple","Black"] },
  { id: 15, name: "New Balance TWO WXY v4",   brand: "New Balance",  category_id: 3, description: "Performance basketball shoe with FuelCell cushioning and a herringbone outsole for superior grip.", price: 10995, stock: 9,  sold_quantity: 12, image_url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600",  rating: 4.5, sizes: ["40","41","42","43","44"], colors: ["Black","White","Gray"] },

  // ── CASUAL SHOES (category_id: 4) ──
  { id: 16, name: "Converse Chuck 70",        brand: "Converse",     category_id: 4, description: "Elevated version of the classic Chuck Taylor with premium canvas, better cushioning, and retro details.", price: 4295,  stock: 22, sold_quantity: 50, image_url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600",  rating: 4.7, sizes: ["36","37","38","39","40","41"], colors: ["Black","White","Navy"] },
  { id: 17, name: "Vans Old Skool",           brand: "Vans",         category_id: 4, description: "Iconic side-stripe skate shoe with a durable suede and canvas upper. A casual wardrobe essential.", price: 3995,  stock: 25, sold_quantity: 55, image_url: "https://images.unsplash.com/photo-1525966222134-fcfa99b8ae77?w=600",  rating: 4.6, sizes: ["37","38","39","40","41"], colors: ["Black","White","Checkerboard"] },
  { id: 18, name: "Puma Suede Classic",       brand: "Puma",         category_id: 4, description: "Timeless suede sneaker with a clean silhouette and formstrip branding. Casual comfort at its finest.", price: 3795,  stock: 20, sold_quantity: 40, image_url: "https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=600",  rating: 4.5, sizes: ["37","38","39","40","41","42"], colors: ["Navy","Black","Red"] },
  { id: 19, name: "Adidas Stan Smith",        brand: "Adidas",       category_id: 4, description: "Minimalist leather tennis shoe turned streetwear icon. Clean, versatile, and endlessly stylish.", price: 4995,  stock: 18, sold_quantity: 48, image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600",  rating: 4.7, sizes: ["37","38","39","40","41","42"], colors: ["White","Green","Navy"] },
  { id: 20, name: "New Balance 574",          brand: "New Balance",  category_id: 4, description: "Heritage running-inspired sneaker with ENCAP midsole technology. Comfortable and effortlessly cool.", price: 5295,  stock: 16, sold_quantity: 35, image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",  rating: 4.6, sizes: ["38","39","40","41","42"], colors: ["Gray","Navy","Burgundy"] },

  // ── FORMAL SHOES (category_id: 5) ──
  { id: 21, name: "Oxford Leather Shoes",     brand: "Clarks",       category_id: 5, description: "Classic full-brogue Oxford crafted from premium leather with a cushioned footbed for all-day comfort.", price: 5995,  stock: 12, sold_quantity: 28, image_url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?w=600",  rating: 4.6, sizes: ["39","40","41","42","43"], colors: ["Brown","Black"] },
  { id: 22, name: "Derby Dress Shoes",        brand: "Aldo",         category_id: 5, description: "Sleek open-lacing Derby shoes with a polished leather finish. Perfect for the office or formal events.", price: 4995,  stock: 10, sold_quantity: 20, image_url: "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=600",  rating: 4.5, sizes: ["39","40","41","42","43"], colors: ["Black","Dark Brown"] },
  { id: 23, name: "Leather Loafers",          brand: "Cole Haan",    category_id: 5, description: "Slip-on leather loafers with Grand.ØS technology for lightweight cushioning and all-day wearability.", price: 7495,  stock: 8,  sold_quantity: 15, image_url: "https://images.unsplash.com/photo-1606107557195-0e29a4b5b4aa?w=600",  rating: 4.7, sizes: ["39","40","41","42","43","44"], colors: ["Tan","Black","Burgundy"] },
  { id: 24, name: "Formal Lace-Up Shoes",     brand: "Hush Puppies", category_id: 5, description: "Comfortable formal lace-up shoes with Bounce+ cushioning technology and a durable leather upper.", price: 4295,  stock: 14, sold_quantity: 22, image_url: "https://images.unsplash.com/photo-1539185441755-769473a23570?w=600",  rating: 4.4, sizes: ["39","40","41","42","43"], colors: ["Black","Brown"] },
  { id: 25, name: "Premium Oxford Shoes",     brand: "Johnston & Murphy", category_id: 5, description: "Handcrafted cap-toe Oxford with full-grain leather and a leather-lined interior for a refined look.", price: 9995,  stock: 6,  sold_quantity: 10, image_url: "https://images.unsplash.com/photo-1607522370275-f14206abe5d3?w=600",  rating: 4.8, sizes: ["40","41","42","43","44"], colors: ["Black","Cognac"] },

  // ── SANDALS (category_id: 6) ──
  { id: 26, name: "Birkenstock Boston Clog",   brand: "Birkenstock", category_id: 6, description: "Closed-toe suede clog with a single adjustable buckle strap and signature cork-latex footbed for superior arch support.",          price: 6995, stock: 20, sold_quantity: 42, image_url: "https://images.unsplash.com/photo-1512374382149-233c42b6a83b?w=600", rating: 4.8, sizes: ["36","37","38","39","40","41","42"], colors: ["Taupe Suede","Black Suede","Mocha"] },
  { id: 27, name: "Birkenstock Gizeh Thong",   brand: "Birkenstock", category_id: 6, description: "Classic thong-style sandal with a toe post, adjustable buckle, and contoured cork footbed for all-day comfort.",                  price: 5495, stock: 25, sold_quantity: 58, image_url: "https://images.unsplash.com/photo-1603487742131-4160ec999306?w=600", rating: 4.7, sizes: ["36","37","38","39","40","41","42"], colors: ["Black","Brown","White"] },
  { id: 28, name: "Birkenstock Arizona",       brand: "Birkenstock", category_id: 6, description: "Iconic two-strap slide sandal with adjustable buckles and anatomical cork-latex footbed for lasting support.",                    price: 5995, stock: 18, sold_quantity: 65, image_url: "https://images.unsplash.com/photo-1558171813-0c6e5b7e3e3e?w=600", rating: 4.9, sizes: ["36","37","38","39","40","41","42","43"], colors: ["Dark Brown Suede","Black Suede","Mocha"] },
  { id: 29, name: "Birkenstock Papillio Cross", brand: "Birkenstock", category_id: 6, description: "Modern crossover slide with wide leather straps and a cushioned cork footbed. Effortlessly stylish and comfortable.",             price: 5295, stock: 22, sold_quantity: 38, image_url: "https://images.unsplash.com/photo-1543163521-1bf539c55dd2?w=600", rating: 4.6, sizes: ["36","37","38","39","40","41","42"], colors: ["Black","Tan","White"] },
  { id: 30, name: "Birkenstock Mayari",        brand: "Birkenstock", category_id: 6, description: "Three-strap toe-loop sandal with a braided design and contoured cork footbed for a secure, comfortable fit.",                    price: 5795, stock: 16, sold_quantity: 30, image_url: "https://images.unsplash.com/photo-1506629082955-511b1aa562c8?w=600", rating: 4.7, sizes: ["36","37","38","39","40","41","42"], colors: ["Birko-Flor Black","Tobacco Brown","White"] },
];

const SEED_ORDERS: Order[] = [
  { id: "ORD-001", customer_name: "Juan Dela Cruz",  customer_email: "juan@email.com",  customer_phone: "09171234567", address: "123 Rizal St", city: "Cebu City",   province: "Cebu",   postal_code: "6000", payment_method: "Cash on Delivery", total_amount: 7995,  status: "Delivered",  created_at: "2025-01-15T10:00:00Z", order_items: [{ id: 1, product_name: "Nike Air Max 270", size: "41", color: "Black", price: 7995, quantity: 1, subtotal: 7995 }] },
  { id: "ORD-002", customer_name: "Maria Santos",    customer_email: "maria@email.com", customer_phone: "09281234567", address: "456 Mabini Ave", city: "Davao City",  province: "Davao",  postal_code: "8000", payment_method: "GCash",            total_amount: 12500, status: "Shipped",    created_at: "2025-01-14T09:00:00Z", order_items: [{ id: 2, product_name: "Jordan Retro 1 High", size: "42", color: "Red", price: 12500, quantity: 1, subtotal: 12500 }] },
  { id: "ORD-003", customer_name: "Mark Reyes",      customer_email: "mark@email.com",  customer_phone: "09391234567", address: "789 Bonifacio Rd", city: "Manila",     province: "Metro Manila", postal_code: "1000", payment_method: "Bank Transfer",    total_amount: 4999,  status: "Processing", created_at: "2025-01-13T08:00:00Z", order_items: [{ id: 3, product_name: "Vans Old Skool", size: "40", color: "Black", price: 3995, quantity: 1, subtotal: 3995 }] },
  { id: "ORD-004", customer_name: "Ana Gonzales",    customer_email: "ana@email.com",   customer_phone: "09451234567", address: "321 Luna St", city: "Iloilo City", province: "Iloilo", postal_code: "5000", payment_method: "Cash on Delivery", total_amount: 8750,  status: "Pending",    created_at: "2025-01-12T07:00:00Z", order_items: [{ id: 4, product_name: "Adidas Ultraboost 22", size: "41", color: "White", price: 9500, quantity: 1, subtotal: 9500 }] },
  { id: "ORD-005", customer_name: "Carlo Mendoza",   customer_email: "carlo@email.com", customer_phone: "09561234567", address: "654 Aguinaldo Blvd", city: "Quezon City", province: "Metro Manila", postal_code: "1100", payment_method: "GCash",            total_amount: 15200, status: "Delivered",  created_at: "2025-01-11T06:00:00Z", order_items: [{ id: 5, product_name: "Nike React Infinity", size: "42", color: "Blue", price: 8999, quantity: 1, subtotal: 8999 }] },
];

export function getProducts(): Product[] {
  if (typeof window === "undefined") return SEED_PRODUCTS;
  const saved = localStorage.getItem(PRODUCTS_KEY);
  if (!saved) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  const parsed: Product[] = JSON.parse(saved);
  // Re-seed if old data has fewer than 30 products or sandals still have old brands
  const hasOldSandals = parsed.some((p: Product) => p.category_id === 6 && p.brand !== "Birkenstock");
  if (parsed.length < 30 || hasOldSandals) {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
    return SEED_PRODUCTS;
  }
  return parsed;
}

export function resetProducts() {
  if (typeof window !== "undefined") {
    localStorage.setItem(PRODUCTS_KEY, JSON.stringify(SEED_PRODUCTS));
  }
}

export function saveProducts(products: Product[]) {
  localStorage.setItem(PRODUCTS_KEY, JSON.stringify(products));
}

export function getOrders(): Order[] {
  if (typeof window === "undefined") return SEED_ORDERS;
  const saved = localStorage.getItem(ORDERS_KEY);
  if (!saved) {
    localStorage.setItem(ORDERS_KEY, JSON.stringify(SEED_ORDERS));
    return SEED_ORDERS;
  }
  return JSON.parse(saved);
}

export function saveOrders(orders: Order[]) {
  localStorage.setItem(ORDERS_KEY, JSON.stringify(orders));
}

export function getAccounts(): { email: string }[] {
  if (typeof window === "undefined") return [];
  return JSON.parse(localStorage.getItem("shoeshop-accounts") || "[]");
}

export function nextProductId(products: Product[]): number {
  return products.length > 0 ? Math.max(...products.map((p) => p.id)) + 1 : 1;
}

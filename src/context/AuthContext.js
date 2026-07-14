import React, { createContext, useContext, useState } from 'react';

// AuthContext — menyimpan status login, profil mahasiswa (Nama, NPM, NoHP),
// menu penjual (sellerMenu), dan daftar pesanan.
// Data profil otomatis terlampir ke setiap pesanan agar penjual tahu identitas pembeli.

const AuthContext = createContext(null);

// Stok menu awal penjual — ini yang akan mahasiswa lihat pertama kali di Katalog.
// Penjual dapat mengubah data ini lewat ManageMenuScreen (tambah/edit/hapus).
const IMAGES = {
  nasiAyamGoreng: require('../../assets/canteen/nasi_ayam_goreng.png'),
  gorenganMix: require('../../assets/canteen/gorengan_mix.png'),
  kopiSusu: require('../../assets/canteen/kopi_susu.png'),
  mejaVip: require('../../assets/canteen/meja_vip.png'),
  fotokopi: require('../../assets/canteen/fotokopi.png'),
  esTehTawar: require('../../assets/canteen/es_teh_tawar.png'),
  default: require('../../assets/icon.png'),
};
const DEFAULT_ITEM_IMAGE = IMAGES.default;

const INITIAL_SELLER_MENU = [
  {
    id: 'sm-1',
    title: 'Nasi Ayam Goreng',
    price: 12000,
    stock: 20,
    mappedCategory: 'Menu Kantin',
    kantinName: 'Kantin Hijau',
    description: 'Nasi putih dengan ayam goreng renyah, sambal, dan lalapan segar.',
    thumbnail: IMAGES.nasiAyamGoreng,
    images: [IMAGES.nasiAyamGoreng],
    rating: 4.8,
    isSellerItem: true,
  },
  {
    id: 'sm-2',
    title: 'Gorengan Mix (5 pcs)',
    price: 8000,
    stock: 50,
    mappedCategory: 'Menu Kantin',
    kantinName: 'Kantin Hijau',
    description: 'Campuran gorengan: tempe, tahu isi, bakwan, dan pisang goreng.',
    thumbnail: DEFAULT_ITEM_IMAGE,
    images: [DEFAULT_ITEM_IMAGE],
    rating: 4.5,
    isSellerItem: true,
  },
  {
    id: 'sm-3',
    title: 'Kopi Susu Kekinian',
    price: 7000,
    stock: 30,
    mappedCategory: 'Menu Kantin',
    kantinName: 'Kantin Biru',
    description: 'Kopi susu segar dengan es batu, manis pas, cocok untuk belajar.',
    thumbnail: DEFAULT_ITEM_IMAGE,
    images: [DEFAULT_ITEM_IMAGE],
    rating: 4.7,
    isSellerItem: true,
  },
  {
    id: 'sm-4',
    title: 'Meja VIP Kantin A (2 Orang)',
    price: 5000,
    stock: 4,
    mappedCategory: 'Booking Meja',
    kantinName: 'Kantin Utama',
    description: 'Meja eksklusif ber-AC untuk 2 orang, dilengkapi colokan listrik.',
    thumbnail: DEFAULT_ITEM_IMAGE,
    images: [DEFAULT_ITEM_IMAGE],
    rating: 4.9,
    isSellerItem: true,
  },
  {
    id: 'sm-5',
    title: 'Fotokopi Hitam Putih (per lembar)',
    price: 500,
    stock: 999,
    mappedCategory: 'Fotokopi',
    kantinName: 'Koperasi Fotokopi',
    description: 'Fotokopi dokumen HVS A4, hitam putih. Bisa diantar ke kelas.',
    thumbnail: IMAGES.fotokopi,
    images: [IMAGES.fotokopi],
    rating: 4.3,
    isSellerItem: true,
  },
  {
    id: 'sm-6',
    title: 'Es Teh Tawar',
    price: 3000,
    stock: 30,
    mappedCategory: 'Menu Kantin',
    kantinName: 'Kantin Hijau',
    description: 'Es teh tawar segar, cocok untuk melepas haus setelah kuliah.',
    thumbnail: IMAGES.esTehTawar,
    images: [IMAGES.esTehTawar],
    rating: 4.6,
    isSellerItem: true,
  },
];

export function AuthProvider({ children }) {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [user, setUser] = useState(null); // { name, email, npm, phone }
  const [wishlist, setWishlist] = useState([]);

  // sellerMenu: stok/menu yang dikelola penjual.
  // Dibaca oleh CatalogScreen (sisi mahasiswa) dan ManageMenuScreen (sisi penjual).
  const [sellerMenu, setSellerMenu] = useState(INITIAL_SELLER_MENU);

  const [orders, setOrders] = useState([]);

  // ─── Auth ─────────────────────────────────────────────────────────────────
  const login = (userData) => { setUser(userData); setIsLoggedIn(true); };
  const logout = () => { setIsLoggedIn(false); setUser(null); setWishlist([]); };
  const updateProfile = (data) => setUser((prev) => ({ ...prev, ...data }));

  // ─── Seller Menu CRUD ─────────────────────────────────────────────────────

  // Penjual tambah menu baru → langsung muncul di Katalog mahasiswa.
  const addMenuItem = (item) => {
    setSellerMenu((prev) => [
      { ...item, id: `sm-${Date.now()}`, rating: 5.0, isSellerItem: true, images: [item.thumbnail] },
      ...prev,
    ]);
  };

  // Penjual ubah detail item (nama, harga, stok, deskripsi, dll).
  const updateMenuItem = (id, fields) => {
    setSellerMenu((prev) => prev.map((m) => (m.id === id ? { ...m, ...fields } : m)));
  };

  // Penjual hapus item dari menu → langsung hilang di Katalog.
  const deleteMenuItem = (id) => {
    setSellerMenu((prev) => prev.filter((m) => m.id !== id));
  };

  // Stok berkurang otomatis saat pesanan masuk.
  const decreaseStock = (id, qty = 1) => {
    setSellerMenu((prev) =>
      prev.map((m) => (m.id === id ? { ...m, stock: Math.max(0, m.stock - qty) } : m))
    );
  };

  // ─── Wishlist ─────────────────────────────────────────────────────────────
  const isWishlisted = (pid) => wishlist.some((p) => p.id === pid);
  const toggleWishlist = (product) => {
    setWishlist((prev) =>
      prev.some((p) => p.id === product.id)
        ? prev.filter((p) => p.id !== product.id)
        : [...prev, product]
    );
  };

  // ─── Orders ───────────────────────────────────────────────────────────────
  const placeOrder = (order) => {
    const newOrder = {
      id: Date.now(),
      status: 'pending',
      ...order,
      buyer: { name: user?.name || '-', npm: user?.npm || '-', phone: user?.phone || '-' },
    };
    setOrders((prev) => [newOrder, ...prev]);
    if (order.itemId) decreaseStock(order.itemId);
    return newOrder;
  };

  const updateOrderStatus = (orderId, newStatus) => {
    setOrders((prev) => prev.map((o) => (o.id === orderId ? { ...o, status: newStatus } : o)));
  };

  return (
    <AuthContext.Provider
      value={{
        isLoggedIn, user, login, logout, updateProfile,
        sellerMenu, addMenuItem, updateMenuItem, deleteMenuItem,
        wishlist, isWishlisted, toggleWishlist,
        orders, placeOrder, updateOrderStatus,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth harus dipakai di dalam <AuthProvider>');
  return ctx;
}

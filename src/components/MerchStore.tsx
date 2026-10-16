import React, { useState } from 'react';
import { ShoppingBag, Check, Plus, Minus, X } from 'lucide-react';
import { MERCH_ITEMS, MerchItem } from '../data/rockData';

interface CartItem extends MerchItem {
  quantity: number;
  selectedSize?: string;
}

interface MerchStoreProps {
  onAdrenalineBoost: (amount: number) => void;
}

export const MerchStore: React.FC<MerchStoreProps> = ({ onAdrenalineBoost }) => {
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedSizes, setSelectedSizes] = useState<Record<string, string>>({
    'merch-tee': 'L',
  });
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [orderCompleted, setOrderCompleted] = useState(false);

  const addToCart = (item: MerchItem) => {
    const size = item.sizes ? selectedSizes[item.id] || item.sizes[0] : undefined;
    setCart((prev) => {
      const existing = prev.find(
        (i) => i.id === item.id && i.selectedSize === size
      );
      if (existing) {
        return prev.map((i) =>
          i.id === item.id && i.selectedSize === size
            ? { ...i, quantity: i.quantity + 1 }
            : i
        );
      }
      return [...prev, { ...item, quantity: 1, selectedSize: size }];
    });
    setIsDrawerOpen(true);
    onAdrenalineBoost(5);
  };

  const updateQuantity = (id: string, size: string | undefined, delta: number) => {
    setCart((prev) =>
      prev
        .map((item) => {
          if (item.id === id && item.selectedSize === size) {
            const nextQty = item.quantity + delta;
            return nextQty > 0 ? { ...item, quantity: nextQty } : null;
          }
          return item;
        })
        .filter(Boolean) as CartItem[]
    );
  };

  const totalAmount = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

  const handleCheckout = () => {
    setOrderCompleted(true);
    setTimeout(() => {
      setCart([]);
      setOrderCompleted(false);
      setIsDrawerOpen(false);
    }, 2800);
  };

  return (
    <section id="merch" className="relative bg-[#0d0d10] border border-neutral-800 p-4 sm:p-8">
      {/* Section Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8 border-b border-neutral-800 pb-4">
        <div>
          <div className="flex items-center gap-2 text-xs font-punch tracking-widest text-[#ff1744] mb-1">
            <ShoppingBag className="w-4 h-4" />
            <span>TOUR APPAREL & HEAVY GEAR</span>
          </div>
          <h2 className="text-2xl sm:text-4xl font-rock text-white tracking-wide">
            OFFICIAL TOUR MERCH
          </h2>
        </div>

        {/* View Cart Button */}
        <button
          onClick={() => setIsDrawerOpen(true)}
          className="relative px-4 py-2 text-xs font-punch font-bold tracking-wider text-white bg-[#18181f] hover:bg-[#272732] border border-neutral-700 flex items-center gap-2 cursor-pointer transition-colors"
        >
          <ShoppingBag className="w-4 h-4 text-[#ff1744]" />
          <span>VIEW CART</span>
          {cart.length > 0 && (
            <span className="bg-[#ff1744] text-white text-[10px] font-mono px-1.5 py-0.2 rounded-xs">
              {cart.reduce((c, i) => c + i.quantity, 0)}
            </span>
          )}
        </button>
      </div>

      {/* Merch Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {MERCH_ITEMS.map((item) => (
          <div
            key={item.id}
            className="bg-[#121216] border border-neutral-800 hover:border-neutral-700 flex flex-col justify-between overflow-hidden group transition-all"
          >
            {/* Image Box */}
            <div className="relative aspect-4/3 bg-neutral-900 overflow-hidden">
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-300"
                referrerPolicy="no-referrer"
              />
              <div className="absolute top-2.5 left-2.5 bg-black/80 backdrop-blur-xs text-white text-[10px] font-punch font-bold px-2 py-0.5 border border-neutral-700">
                {item.tag}
              </div>
            </div>

            {/* Info */}
            <div className="p-4 flex-1 flex flex-col justify-between">
              <div>
                <div className="text-[10px] font-punch text-neutral-500 uppercase tracking-widest mb-1">
                  {item.category}
                </div>
                <h3 className="font-punch font-extrabold text-base text-white tracking-wide mb-1 leading-snug">
                  {item.name}
                </h3>
                <p className="text-xs text-neutral-400 font-body line-clamp-2 mb-3">
                  {item.description}
                </p>
              </div>

              <div>
                {/* Size selector if available */}
                {item.sizes && (
                  <div className="flex items-center gap-1.5 mb-3">
                    <span className="text-[10px] font-punch text-neutral-500">SIZE:</span>
                    {item.sizes.map((sz) => (
                      <button
                        key={sz}
                        onClick={() =>
                          setSelectedSizes((prev) => ({ ...prev, [item.id]: sz }))
                        }
                        className={`px-2 py-0.5 text-xs font-punch font-bold border transition-colors cursor-pointer ${
                          (selectedSizes[item.id] || 'L') === sz
                            ? 'bg-[#ff1744] text-white border-[#ff1744]'
                            : 'bg-[#1a1a22] text-neutral-400 border-neutral-800 hover:text-white'
                        }`}
                      >
                        {sz}
                      </button>
                    ))}
                  </div>
                )}

                <div className="flex items-center justify-between pt-3 border-t border-neutral-800">
                  <span className="font-punch font-extrabold text-lg text-white tabular-nums">
                    ¥{item.price.toLocaleString()}
                  </span>

                  <button
                    onClick={() => addToCart(item)}
                    className="px-3.5 py-1.5 text-xs font-punch font-bold tracking-wider text-white bg-[#e60026] hover:bg-[#ff1744] active:scale-95 transition-all flex items-center gap-1 cursor-pointer"
                  >
                    <Plus className="w-3.5 h-3.5" />
                    <span>ADD TO CART</span>
                  </button>
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Cart Drawer */}
      {isDrawerOpen && (
        <div className="fixed inset-0 z-50 flex justify-end bg-black/75 backdrop-blur-xs">
          <div className="w-full max-w-md bg-[#101014] border-l border-neutral-800 h-full p-6 flex flex-col justify-between overflow-y-auto">
            <div>
              <div className="flex items-center justify-between border-b border-neutral-800 pb-4 mb-5">
                <div className="flex items-center gap-2">
                  <ShoppingBag className="w-5 h-5 text-[#ff1744]" />
                  <span className="font-rock text-xl text-white">YOUR RIOT CART</span>
                </div>
                <button
                  onClick={() => setIsDrawerOpen(false)}
                  className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              {cart.length === 0 ? (
                <div className="text-center py-16 text-neutral-500 font-punch text-sm">
                  カートは空です // NO MERCH SELECTED
                </div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div
                      key={`${item.id}-${item.selectedSize}`}
                      className="p-3 bg-[#181820] border border-neutral-800 flex items-center justify-between gap-3"
                    >
                      <div className="flex-1">
                        <div className="font-punch font-bold text-sm text-white">
                          {item.name}
                        </div>
                        {item.selectedSize && (
                          <div className="text-xs font-punch text-[#ff1744]">
                            SIZE: {item.selectedSize}
                          </div>
                        )}
                        <div className="text-xs font-mono text-neutral-400">
                          ¥{item.price.toLocaleString()}
                        </div>
                      </div>

                      <div className="flex items-center gap-2 bg-[#101016] p-1 border border-neutral-800">
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, -1)}
                          className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                        >
                          <Minus className="w-3.5 h-3.5" />
                        </button>
                        <span className="font-mono text-xs font-bold text-white px-1">
                          {item.quantity}
                        </span>
                        <button
                          onClick={() => updateQuantity(item.id, item.selectedSize, 1)}
                          className="p-1 text-neutral-400 hover:text-white cursor-pointer"
                        >
                          <Plus className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t border-neutral-800 pt-5 mt-6">
                <div className="flex items-center justify-between mb-4">
                  <span className="font-punch text-sm text-neutral-400">TOTAL AMOUNT</span>
                  <span className="font-punch font-extrabold text-2xl text-white">
                    ¥{totalAmount.toLocaleString()}
                  </span>
                </div>

                {orderCompleted ? (
                  <div className="p-3 bg-emerald-950 border border-emerald-600 text-emerald-200 text-xs font-punch font-bold text-center flex items-center justify-center gap-2">
                    <Check className="w-4 h-4 text-emerald-400" />
                    <span>ORDER CONFIRMED // 会場受取予約が完了しました！</span>
                  </div>
                ) : (
                  <button
                    onClick={handleCheckout}
                    className="w-full py-3.5 bg-[#e60026] hover:bg-[#ff1744] text-white font-punch font-extrabold tracking-widest text-sm uppercase shadow-[0_0_20px_rgba(230,0,38,0.5)] transition-all cursor-pointer"
                  >
                    COMPLETE TOUR PRE-ORDER
                  </button>
                )}
              </div>
            )}
          </div>
        </div>
      )}
    </section>
  );
};

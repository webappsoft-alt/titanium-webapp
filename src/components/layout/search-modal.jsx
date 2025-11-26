"use client";

import { useEffect, useState, useRef, useMemo, useCallback } from "react";
import { Search, X } from "lucide-react";
import { useRouter } from "next/navigation";
import { useSelector } from "react-redux";
import { Input } from "@/components/ui/input";

export function SearchModal({ isOpen, onClose, includedLabels }) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState("");
  const [filteredProducts, setFilteredProducts] = useState([]);
  const inputRef = useRef(null);

  const menuData = useSelector((state) => state.menu.items) || [];

  // Memoize ALL products (prevents recalculation on every keystroke)
  const allProducts = useMemo(() => {
    return menuData
      ?.filter((item) => includedLabels.includes(item?.label))
      ?.flatMap((item) => item?.children)
      ?.flatMap((item) => item?.children) || [];
  }, [menuData, includedLabels]);

  // Debounced search
  const handleSearch = useCallback(
    debounce((query) => {
      if (!query.trim()) {
        setFilteredProducts([]);
        return;
      }

      const lower = query.toLowerCase();

      const results = allProducts.filter(
        (product) =>
          product?.label?.toLowerCase().includes(lower) ||
          product?.description?.toLowerCase().includes(lower) ||
          product?.slug?.toLowerCase().includes(lower)
      );

      setFilteredProducts(results);
    }, 200),
    [allProducts]
  );

  useEffect(() => {
    handleSearch(searchQuery);
  }, [searchQuery, handleSearch]);

  // Focus input when opening
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      setTimeout(() => inputRef.current?.focus(), 50);
    } else {
      document.body.style.overflow = "unset";
    }
  }, [isOpen]);

  // ESC close
  useEffect(() => {
    const listener = (e) => e.key === "Escape" && onClose();
    if (isOpen) document.addEventListener("keydown", listener);
    return () => document.removeEventListener("keydown", listener);
  }, [isOpen, onClose]);

  const chooseProduct = (product) => {
    router.push(`/product/${product.slug}`);
    setSearchQuery("");
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center bg-black/60 backdrop-blur-sm animate-fadeIn">
      <div className="mt-20 w-full max-w-4xl rounded-xl bg-white shadow-xl animate-slideUp overflow-hidden flex flex-col">

        {/* Header */}
        <div className="border-b bg-white px-5 py-4">
          <div className="flex items-center gap-4">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-5 -translate-y-1/2 text-gray-400" />
              <Input
                ref={inputRef}
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="h-12 pl-10 text-lg"
              />
            </div>

            <button
              onClick={onClose}
              className="rounded-full p-2 hover:bg-gray-100 transition"
            >
              <X className="size-6" />
            </button>
          </div>
        </div>

        {/* Results */}
        <div className="flex-1 overflow-y-auto px-5 py-6 max-h-[70vh]">
          {searchQuery.trim() === "" ? (
            <EmptyState />
          ) : filteredProducts.length === 0 ? (
            <NoResults query={searchQuery} />
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {filteredProducts.map((product) => (
                <ProductCard
                  key={product.slug}
                  product={product}
                  onClick={() => chooseProduct(product)}
                />
              ))}
            </div>
          )}
        </div>

        {searchQuery.trim() && filteredProducts.length > 0 && (
          <div className="border-t bg-gray-50 px-5 py-3 text-sm text-gray-600">
            Found {filteredProducts.length} product
            {filteredProducts.length !== 1 ? "s" : ""}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------- Small Reusable Components ------------------------ */

function ProductCard({ product, onClick }) {
  return (
    <button
      onClick={onClick}
      className="group rounded-lg overflow-hidden border border-gray-200 bg-white text-left transition hover:shadow-lg hover:border-blue-400"
    >
      {product.image && (
        <div className="h-40 w-full bg-gray-100 overflow-hidden">
          <img
            src={product.image}
            alt={product.label}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        </div>
      )}

      <div className="p-4">
        <h3 className="line-clamp-2 font-semibold text-gray-900 group-hover:text-blue-600">
          {product.label}
        </h3>
        {product.description && (
          <p className="mt-2 line-clamp-1 text-sm text-gray-600">
            {product.description}
          </p>
        )}
      </div>
    </button>
  );
}

function EmptyState() {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
      <Search className="mb-4 size-12 text-gray-300" />
      Start typing to search products
    </div>
  );
}

function NoResults({ query }) {
  return (
    <div className="flex h-full flex-col items-center justify-center text-center text-gray-500">
      No results found for "<span className="font-medium">{query}</span>"
    </div>
  );
}

/* ------------------------- Utility: Debounce ------------------------ */
function debounce(fn, delay) {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
}

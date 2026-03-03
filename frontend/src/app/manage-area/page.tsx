"use client";

import { useCallback, useEffect, useState } from "react";
import { Product, ProductField } from "@/types/product";
import { Store, StoreField } from "@/types/store";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

const PRODUCTS_API = "/api/products";
const STORES_API = "/api/stores";

export default function ManageAreaPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [checkedProducts, setCheckedProducts] = useState<Set<string>>(
    new Set()
  );
  const [saving, setSaving] = useState(false);

  const fetchStores = useCallback(async () => {
    const response = await fetch(STORES_API);
    const data: Store[] = await response.json();
    setStores(data);
  }, []);

  const fetchProducts = useCallback(async () => {
    const response = await fetch(PRODUCTS_API);
    const data: Product[] = await response.json();
    setProducts(data);
  }, []);

  useEffect(() => {
    fetchStores();
    fetchProducts();
  }, [fetchStores, fetchProducts]);

  useEffect(() => {
    if (!selectedStore) {
      setCheckedProducts(new Set());

      return;
    }

    const assigned = new Set(
      products
        .filter((p) => p[ProductField.StoreCode] === selectedStore)
        .map((p) => p[ProductField.Code])
    );
    setCheckedProducts(assigned);
  }, [selectedStore, products]);

  function handleStoreChange(value: string) {
    setSelectedStore(value);
  }

  function handleCheckboxChange(productCode: string) {
    setCheckedProducts((prev) => {
      const next = new Set(prev);
      if (next.has(productCode)) {
        next.delete(productCode);
      } else {
        next.add(productCode);
      }

      return next;
    });
  }

  async function handleSaveClick() {
    if (!selectedStore) {
      return;
    }

    setSaving(true);

    const updates: Promise<Response>[] = [];

    for (const product of products) {
      const code = product[ProductField.Code];
      const currentlyAssigned = product[ProductField.StoreCode] === selectedStore;
      const shouldBeAssigned = checkedProducts.has(code);

      if (shouldBeAssigned && !currentlyAssigned) {
        updates.push(
          fetch(`${PRODUCTS_API}/${encodeURIComponent(code)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [ProductField.StoreCode]: selectedStore }),
          })
        );
      } else if (!shouldBeAssigned && currentlyAssigned) {
        updates.push(
          fetch(`${PRODUCTS_API}/${encodeURIComponent(code)}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ [ProductField.StoreCode]: "" }),
          })
        );
      }
    }

    await Promise.all(updates);
    await fetchProducts();
    setSaving(false);
  }

  return (
    <div className="flex min-h-full flex-col bg-[#F8F7F4]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5">
        <h1 className="text-xl font-bold text-gray-900">Manage Area</h1>
        <div className="flex size-9 items-center justify-center rounded-full bg-[#B89A5A] text-sm font-medium text-white">
          Ra
        </div>
      </div>

      {/* Content */}
      <div className="flex-1 px-8 pb-8">
        <div className="mx-auto max-w-2xl space-y-6">
          {/* Store Selector */}
          <div className="grid gap-2">
            <Label htmlFor="store-select">Select Store</Label>
            <Select value={selectedStore} onValueChange={handleStoreChange}>
              <SelectTrigger id="store-select" className="w-full">
                <SelectValue placeholder="Select a store" />
              </SelectTrigger>
              <SelectContent>
                {stores.map((store) => (
                  <SelectItem
                    key={store[StoreField.Code]}
                    value={store[StoreField.Code]}
                  >
                    {store[StoreField.Code]} — {store[StoreField.Name]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {/* Product Checklist */}
          {selectedStore && (
            <div className="rounded-lg border bg-white">
              <div className="border-b px-4 py-3">
                <h2 className="text-sm font-medium text-gray-700">
                  Assign Products
                </h2>
              </div>
              <div className="divide-y">
                {products.length === 0 ? (
                  <div className="px-4 py-6 text-center text-sm text-muted-foreground">
                    No products found.
                  </div>
                ) : (
                  products.map((product) => {
                    const code = product[ProductField.Code];
                    const isChecked = checkedProducts.has(code);
                    const checkboxId = `product-${code}`;

                    return (
                      <label
                        key={code}
                        htmlFor={checkboxId}
                        className="flex cursor-pointer items-center gap-3 px-4 py-3 transition-colors hover:bg-gray-50"
                      >
                        <Checkbox
                          id={checkboxId}
                          checked={isChecked}
                          onCheckedChange={() => handleCheckboxChange(code)}
                        />
                        <span className="min-w-[120px] text-sm font-medium text-gray-900">
                          {code}
                        </span>
                        <span className="text-sm text-gray-600">
                          {product[ProductField.Name]}
                        </span>
                      </label>
                    );
                  })
                )}
              </div>

              {/* Save Button */}
              {products.length > 0 && (
                <div className="border-t px-4 py-3">
                  <Button
                    className="bg-[#B89A5A] text-white hover:bg-[#A6883F]"
                    disabled={saving}
                    onClick={handleSaveClick}
                  >
                    {saving ? "Saving..." : "Save"}
                  </Button>
                </div>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

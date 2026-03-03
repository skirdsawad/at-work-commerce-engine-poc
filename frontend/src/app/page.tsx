"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Product, ProductField, DialogMode } from "@/types/product";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";

const EMPTY_PRODUCT: Product = {
  [ProductField.Code]: "",
  [ProductField.Name]: "",
  [ProductField.Description]: "",
  [ProductField.StoreCode]: "",
};

const API_BASE = "/api/products";

export default function ProductPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(DialogMode.Create);
  const [formData, setFormData] = useState<Product>(EMPTY_PRODUCT);
  const [loading, setLoading] = useState(false);

  const fetchProducts = useCallback(async () => {
    const response = await fetch(API_BASE);
    const data: Product[] = await response.json();
    setProducts(data);
  }, []);

  useEffect(() => {
    fetchProducts();
  }, [fetchProducts]);

  function handleAddClick() {
    setDialogMode(DialogMode.Create);
    setFormData(EMPTY_PRODUCT);
    setDialogOpen(true);
  }

  function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
    const code = e.currentTarget.dataset.code;
    if (!code) {
      return;
    }

    const product = products.find((p) => p[ProductField.Code] === code);
    if (!product) {
      return;
    }

    setDialogMode(DialogMode.Edit);
    setFormData({ ...product });
    setDialogOpen(true);
  }

  async function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
    const code = e.currentTarget.dataset.code;
    if (!code) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete product "${code}"?`
    );
    if (!confirmed) {
      return;
    }

    await fetch(`${API_BASE}/${encodeURIComponent(code)}`, {
      method: "DELETE",
    });
    await fetchProducts();
  }

  function handleCodeChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [ProductField.Code]: e.target.value }));
  }

  function handleNameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setFormData((prev) => ({ ...prev, [ProductField.Name]: e.target.value }));
  }

  function handleDescriptionChange(
    e: React.ChangeEvent<HTMLTextAreaElement>
  ) {
    setFormData((prev) => ({
      ...prev,
      [ProductField.Description]: e.target.value,
    }));
  }

  async function handleFormSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault();
    setLoading(true);

    if (dialogMode === DialogMode.Create) {
      await fetch(API_BASE, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(formData),
      });
    } else {
      await fetch(
        `${API_BASE}/${encodeURIComponent(formData[ProductField.Code])}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            [ProductField.Name]: formData[ProductField.Name],
            [ProductField.Description]: formData[ProductField.Description],
          }),
        }
      );
    }

    setLoading(false);
    setDialogOpen(false);
    await fetchProducts();
  }

  function handleCancelClick() {
    setDialogOpen(false);
  }

  function handleDialogOpenChange(open: boolean) {
    setDialogOpen(open);
  }

  const isEditMode = dialogMode === DialogMode.Edit;

  return (
    <div className="flex min-h-full flex-col bg-[#F8F7F4]">
      {/* Header */}
      <div className="flex items-center justify-between px-8 py-5">
        <div className="flex items-center gap-4">
          <h1 className="text-xl font-bold text-gray-900">Products</h1>
          <Button
            variant="outline"
            className="border-[#B89A5A] text-[#B89A5A] hover:bg-[#B89A5A]/10 hover:text-[#B89A5A]"
            onClick={handleAddClick}
          >
            <Plus className="size-4" />
            Add Product
          </Button>
        </div>
        <div className="flex size-9 items-center justify-center rounded-full bg-[#B89A5A] text-sm font-medium text-white">
          Ra
        </div>
      </div>

      {/* Table */}
      <div className="flex-1 px-8 pb-8">
        <div className="rounded-lg border bg-white">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead className="w-[140px]">Code</TableHead>
                <TableHead className="w-[180px]">Name</TableHead>
                <TableHead>Description</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {products.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={4}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No products found.
                  </TableCell>
                </TableRow>
              ) : (
                products.map((product) => (
                  <TableRow key={product[ProductField.Code]}>
                    <TableCell className="font-medium">
                      {product[ProductField.Code]}
                    </TableCell>
                    <TableCell>{product[ProductField.Name]}</TableCell>
                    <TableCell className="whitespace-normal text-gray-600">
                      {product[ProductField.Description]}
                    </TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          data-code={product[ProductField.Code]}
                          className="inline-flex items-center gap-1.5 text-sm text-[#B89A5A] transition-colors hover:text-[#9A7F3E]"
                          onClick={handleEditClick}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          data-code={product[ProductField.Code]}
                          className="inline-flex items-center gap-1.5 text-sm text-red-400 transition-colors hover:text-red-600"
                          onClick={handleDeleteClick}
                        >
                          <Trash2 className="size-3.5" />
                          Delete
                        </button>
                      </div>
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>

          {/* Pagination footer */}
          {products.length > 0 && (
            <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-500">
              <span>
                Showing 1 to {products.length} of {products.length} entries
              </span>
              <div className="flex items-center gap-3">
                <span className="inline-flex size-8 items-center justify-center rounded-full border border-[#B89A5A] text-xs font-medium text-[#B89A5A]">
                  1
                </span>
                <span className="text-gray-400">25 / page</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Dialog */}
      <Dialog open={dialogOpen} onOpenChange={handleDialogOpenChange}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Product" : "Add Product"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the product details below."
                : "Fill in the details to create a new product."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="code">Code</Label>
                <Input
                  id="code"
                  value={formData[ProductField.Code]}
                  onChange={handleCodeChange}
                  disabled={isEditMode}
                  required
                  placeholder="e.g. HOT-DESK"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="name">Name</Label>
                <Input
                  id="name"
                  value={formData[ProductField.Name]}
                  onChange={handleNameChange}
                  required
                  placeholder="e.g. Hot Desk"
                />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="description">Description</Label>
                <Textarea
                  id="description"
                  value={formData[ProductField.Description]}
                  onChange={handleDescriptionChange}
                  placeholder="Product description..."
                  rows={3}
                />
              </div>
            </div>
            <DialogFooter>
              <Button
                type="button"
                variant="outline"
                onClick={handleCancelClick}
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={loading}
                className="bg-[#B89A5A] text-white hover:bg-[#A6883F]"
              >
                {loading ? "Saving..." : "Save"}
              </Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>
    </div>
  );
}

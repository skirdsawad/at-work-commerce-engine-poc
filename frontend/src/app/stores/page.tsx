"use client";

import { useCallback, useEffect, useState } from "react";
import { Pencil, Plus, Trash2 } from "lucide-react";
import { Store, StoreField } from "@/types/store";
import { DialogMode } from "@/types/product";
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

const EMPTY_STORE: Store = {
  [StoreField.Code]: "",
  [StoreField.Name]: "",
  [StoreField.Zone]: "",
  [StoreField.Phone]: "",
  [StoreField.Email]: "",
  [StoreField.Description]: "",
  [StoreField.CompanyName]: "",
  [StoreField.TaxId]: "",
  [StoreField.BranchNumber]: "",
  [StoreField.Address]: "",
  [StoreField.SubDistrict]: "",
  [StoreField.District]: "",
  [StoreField.Province]: "",
  [StoreField.PostalCode]: "",
  [StoreField.Latitude]: "",
  [StoreField.Longitude]: "",
  [StoreField.O2OStoreId]: "",
  [StoreField.SellerEmail]: "",
  [StoreField.SellerPassword]: "",
  [StoreField.SaleOpsEmail]: "",
  [StoreField.SaleOpsPassword]: "",
};

const API_BASE = "/api/stores";

export default function StorePage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogMode, setDialogMode] = useState<DialogMode>(DialogMode.Create);
  const [formData, setFormData] = useState<Store>(EMPTY_STORE);
  const [loading, setLoading] = useState(false);

  const fetchStores = useCallback(async () => {
    const response = await fetch(API_BASE);
    const data: Store[] = await response.json();
    setStores(data);
  }, []);

  useEffect(() => {
    fetchStores();
  }, [fetchStores]);

  function handleAddClick() {
    setDialogMode(DialogMode.Create);
    setFormData(EMPTY_STORE);
    setDialogOpen(true);
  }

  function handleEditClick(e: React.MouseEvent<HTMLButtonElement>) {
    const code = e.currentTarget.dataset.code;
    if (!code) {
      return;
    }

    const store = stores.find((s) => s[StoreField.Code] === code);
    if (!store) {
      return;
    }

    setDialogMode(DialogMode.Edit);
    setFormData({ ...store });
    setDialogOpen(true);
  }

  async function handleDeleteClick(e: React.MouseEvent<HTMLButtonElement>) {
    const code = e.currentTarget.dataset.code;
    if (!code) {
      return;
    }

    const confirmed = window.confirm(
      `Are you sure you want to delete store "${code}"?`
    );
    if (!confirmed) {
      return;
    }

    await fetch(`${API_BASE}/${encodeURIComponent(code)}`, {
      method: "DELETE",
    });
    await fetchStores();
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const field = e.currentTarget.dataset.field;
    if (!field) {
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
  }

  function handleTextareaChange(e: React.ChangeEvent<HTMLTextAreaElement>) {
    const field = e.currentTarget.dataset.field;
    if (!field) {
      return;
    }

    setFormData((prev) => ({ ...prev, [field]: e.target.value }));
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
        `${API_BASE}/${encodeURIComponent(formData[StoreField.Code])}`,
        {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(formData),
        }
      );
    }

    setLoading(false);
    setDialogOpen(false);
    await fetchStores();
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
          <h1 className="text-xl font-bold text-gray-900">Stores</h1>
          <Button
            variant="outline"
            className="border-[#B89A5A] text-[#B89A5A] hover:bg-[#B89A5A]/10 hover:text-[#B89A5A]"
            onClick={handleAddClick}
          >
            <Plus className="size-4" />
            Add Store
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
                <TableHead className="w-[80px]">Code</TableHead>
                <TableHead className="w-[200px]">Name</TableHead>
                <TableHead className="w-[220px]">Coordinates</TableHead>
                <TableHead>Zone</TableHead>
                <TableHead>Company</TableHead>
                <TableHead className="w-[110px]">O2O Store ID</TableHead>
                <TableHead className="w-[140px] text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {stores.length === 0 ? (
                <TableRow>
                  <TableCell
                    colSpan={7}
                    className="py-8 text-center text-muted-foreground"
                  >
                    No stores found.
                  </TableCell>
                </TableRow>
              ) : (
                stores.map((store) => (
                  <TableRow key={store[StoreField.Code]}>
                    <TableCell className="font-medium">
                      {store[StoreField.Code]}
                    </TableCell>
                    <TableCell>{store[StoreField.Name]}</TableCell>
                    <TableCell className="text-gray-500">
                      {store[StoreField.Latitude]}, {store[StoreField.Longitude]}
                    </TableCell>
                    <TableCell>{store[StoreField.Zone]}</TableCell>
                    <TableCell className="whitespace-normal text-gray-600">
                      {store[StoreField.CompanyName]}
                    </TableCell>
                    <TableCell>{store[StoreField.O2OStoreId]}</TableCell>
                    <TableCell className="text-right">
                      <div className="flex items-center justify-end gap-3">
                        <button
                          type="button"
                          data-code={store[StoreField.Code]}
                          className="inline-flex items-center gap-1.5 text-sm text-[#B89A5A] transition-colors hover:text-[#9A7F3E]"
                          onClick={handleEditClick}
                        >
                          <Pencil className="size-3.5" />
                          Edit
                        </button>
                        <button
                          type="button"
                          data-code={store[StoreField.Code]}
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
          {stores.length > 0 && (
            <div className="flex items-center justify-between border-t px-4 py-3 text-sm text-gray-500">
              <span>
                Showing 1 to {stores.length} of {stores.length} entries
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
        <DialogContent className="max-w-[90vw] max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>
              {isEditMode ? "Edit Store" : "Add Store"}
            </DialogTitle>
            <DialogDescription>
              {isEditMode
                ? "Update the store details below."
                : "Fill in the details to create a new store."}
            </DialogDescription>
          </DialogHeader>
          <form onSubmit={handleFormSubmit}>
            <div className="grid grid-cols-2 gap-8 py-4">

              {/* ===== Left Column ===== */}
              <div className="space-y-6">

                {/* Store Information */}
                <fieldset>
                  <legend className="mb-3 border-b border-[#B89A5A]/30 pb-2 text-sm font-semibold text-[#B89A5A]">
                    Store Information
                  </legend>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-3 gap-4">
                      <div className="col-span-2 grid gap-2">
                        <Label htmlFor="name">Name *</Label>
                        <Input
                          id="name"
                          data-field={StoreField.Name}
                          value={formData[StoreField.Name]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. at work CentralWorld"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="code">Code *</Label>
                        <Input
                          id="code"
                          data-field={StoreField.Code}
                          value={formData[StoreField.Code]}
                          onChange={handleInputChange}
                          disabled={isEditMode}
                          required
                          placeholder="e.g. R4T"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="zone">Zone *</Label>
                        <Input
                          id="zone"
                          data-field={StoreField.Zone}
                          value={formData[StoreField.Zone]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. Bangkok Metropolitan"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="phone">Phone *</Label>
                        <Input
                          id="phone"
                          data-field={StoreField.Phone}
                          value={formData[StoreField.Phone]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. 022645555"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="email">Email *</Label>
                      <Input
                        id="email"
                        type="email"
                        data-field={StoreField.Email}
                        value={formData[StoreField.Email]}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. atwork@example.com"
                      />
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="description">Description *</Label>
                      <Textarea
                        id="description"
                        data-field={StoreField.Description}
                        value={formData[StoreField.Description]}
                        onChange={handleTextareaChange}
                        required
                        placeholder="Store description..."
                        rows={2}
                      />
                    </div>
                  </div>
                </fieldset>

                {/* Billing / Tax Invoice Information */}
                <fieldset>
                  <legend className="mb-3 border-b border-[#B89A5A]/30 pb-2 text-sm font-semibold text-[#B89A5A]">
                    Billing / Tax Invoice Information
                  </legend>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="companyName">Company Name *</Label>
                      <Input
                        id="companyName"
                        data-field={StoreField.CompanyName}
                        value={formData[StoreField.CompanyName]}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. Central Pattana Public Company Limited"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="taxId">Tax ID *</Label>
                        <Input
                          id="taxId"
                          data-field={StoreField.TaxId}
                          value={formData[StoreField.TaxId]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. 0107537002443"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="branchNumber">Branch Number *</Label>
                        <Input
                          id="branchNumber"
                          data-field={StoreField.BranchNumber}
                          value={formData[StoreField.BranchNumber]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. 00031"
                        />
                      </div>
                    </div>
                    <div className="grid gap-2">
                      <Label htmlFor="address">Address *</Label>
                      <Input
                        id="address"
                        data-field={StoreField.Address}
                        value={formData[StoreField.Address]}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. 92 Rama 4 Road"
                      />
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="subDistrict">Sub-district *</Label>
                        <Input
                          id="subDistrict"
                          data-field={StoreField.SubDistrict}
                          value={formData[StoreField.SubDistrict]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. Silom"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="district">District *</Label>
                        <Input
                          id="district"
                          data-field={StoreField.District}
                          value={formData[StoreField.District]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. Bang Rak"
                        />
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="province">Province *</Label>
                        <Input
                          id="province"
                          data-field={StoreField.Province}
                          value={formData[StoreField.Province]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. Bangkok"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="postalCode">Postal Code *</Label>
                        <Input
                          id="postalCode"
                          data-field={StoreField.PostalCode}
                          value={formData[StoreField.PostalCode]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. 10500"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

              </div>

              {/* ===== Right Column ===== */}
              <div className="space-y-6">

                {/* Location Coordinates */}
                <fieldset>
                  <legend className="mb-3 border-b border-[#B89A5A]/30 pb-2 text-sm font-semibold text-[#B89A5A]">
                    Location Coordinates
                  </legend>
                  <div className="grid gap-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="latitude">Latitude *</Label>
                        <Input
                          id="latitude"
                          data-field={StoreField.Latitude}
                          value={formData[StoreField.Latitude]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. 13.72858972"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="longitude">Longitude *</Label>
                        <Input
                          id="longitude"
                          data-field={StoreField.Longitude}
                          value={formData[StoreField.Longitude]}
                          onChange={handleInputChange}
                          required
                          placeholder="e.g. 100.53713200"
                        />
                      </div>
                    </div>
                    {/* Google Map */}
                    {formData[StoreField.Latitude] && formData[StoreField.Longitude] ? (
                      <iframe
                        className="h-52 w-full rounded-md border"
                        loading="lazy"
                        referrerPolicy="no-referrer-when-downgrade"
                        src={`https://maps.google.com/maps?q=${formData[StoreField.Latitude]},${formData[StoreField.Longitude]}&z=15&output=embed`}
                        title="Store location"
                      />
                    ) : (
                      <div className="flex h-52 items-center justify-center rounded-md border border-dashed border-gray-300 bg-gray-50 text-sm text-gray-400">
                        Enter coordinates to preview map
                      </div>
                    )}
                  </div>
                </fieldset>

                {/* O2O Settings */}
                <fieldset>
                  <legend className="mb-3 border-b border-[#B89A5A]/30 pb-2 text-sm font-semibold text-[#B89A5A]">
                    O2O Settings
                  </legend>
                  <div className="grid gap-4">
                    <div className="grid gap-2">
                      <Label htmlFor="o2oStoreId">O2O Store ID *</Label>
                      <Input
                        id="o2oStoreId"
                        data-field={StoreField.O2OStoreId}
                        value={formData[StoreField.O2OStoreId]}
                        onChange={handleInputChange}
                        required
                        placeholder="e.g. atwork_en"
                      />
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      Seller Account
                    </p>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="sellerEmail">Email / Username</Label>
                        <Input
                          id="sellerEmail"
                          type="email"
                          data-field={StoreField.SellerEmail}
                          value={formData[StoreField.SellerEmail]}
                          onChange={handleInputChange}
                          placeholder="e.g. seller@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="sellerPassword">Password</Label>
                        <Input
                          id="sellerPassword"
                          type="password"
                          data-field={StoreField.SellerPassword}
                          value={formData[StoreField.SellerPassword]}
                          onChange={handleInputChange}
                          placeholder="Password"
                        />
                      </div>
                    </div>

                    <p className="text-sm font-medium text-gray-700">
                      SaleOps Account
                    </p>
                    <div className="grid gap-4">
                      <div className="grid gap-2">
                        <Label htmlFor="saleOpsEmail">Email / Username</Label>
                        <Input
                          id="saleOpsEmail"
                          type="email"
                          data-field={StoreField.SaleOpsEmail}
                          value={formData[StoreField.SaleOpsEmail]}
                          onChange={handleInputChange}
                          placeholder="e.g. salesops@example.com"
                        />
                      </div>
                      <div className="grid gap-2">
                        <Label htmlFor="saleOpsPassword">Password</Label>
                        <Input
                          id="saleOpsPassword"
                          type="password"
                          data-field={StoreField.SaleOpsPassword}
                          value={formData[StoreField.SaleOpsPassword]}
                          onChange={handleInputChange}
                          placeholder="Password"
                        />
                      </div>
                    </div>
                  </div>
                </fieldset>

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

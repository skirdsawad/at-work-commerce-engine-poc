"use client";

import { useCallback, useEffect, useState } from "react";
import { Product, ProductField } from "@/types/product";
import { Store, StoreField } from "@/types/store";
import { ManageAreaTab } from "@/types/manage-area";
import {
  DayOfWeek,
  OpeningHoursField,
  OpeningHoursMap,
  DAYS_ORDERED,
  DAY_LABELS,
  EMPTY_OPENING_HOURS,
} from "@/types/opening-hours";
import {
  PriceRuleType,
  PRICE_RULE_LABELS,
  DayPricingField,
  TimeRangeRuleField,
  HoursRuleField,
  PricingMap,
  EMPTY_PRICING,
  EMPTY_TIME_RANGE_RULE,
  EMPTY_HOURS_RULE,
} from "@/types/pricing";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Tabs,
  TabsContent,
  TabsList,
  TabsTrigger,
} from "@/components/ui/tabs";

const PRODUCTS_API = "/api/products";
const STORES_API = "/api/stores";

export default function ManageAreaPage() {
  const [stores, setStores] = useState<Store[]>([]);
  const [products, setProducts] = useState<Product[]>([]);
  const [selectedStore, setSelectedStore] = useState("");
  const [activeTab, setActiveTab] = useState<ManageAreaTab>(
    ManageAreaTab.AssignProducts
  );
  const [checkedProducts, setCheckedProducts] = useState<Set<string>>(
    new Set()
  );
  const [openingHours, setOpeningHours] = useState<OpeningHoursMap>(
    structuredClone(EMPTY_OPENING_HOURS)
  );
  const [pricing, setPricing] = useState<PricingMap>(
    structuredClone(EMPTY_PRICING)
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
      setOpeningHours(structuredClone(EMPTY_OPENING_HOURS));
      setPricing(structuredClone(EMPTY_PRICING));

      return;
    }

    const assigned = new Set(
      products
        .filter((p) => p[ProductField.StoreCode] === selectedStore)
        .map((p) => p[ProductField.Code])
    );
    setCheckedProducts(assigned);

    const store = stores.find((s) => s[StoreField.Code] === selectedStore);
    if (store && store[StoreField.OpeningHours]) {
      setOpeningHours(structuredClone(store[StoreField.OpeningHours]));
    } else {
      setOpeningHours(structuredClone(EMPTY_OPENING_HOURS));
    }

    if (store && store[StoreField.Pricing]) {
      setPricing(structuredClone(store[StoreField.Pricing]));
    } else {
      setPricing(structuredClone(EMPTY_PRICING));
    }
  }, [selectedStore, products, stores]);

  function handleStoreChange(value: string) {
    setSelectedStore(value);
  }

  function handleTabChange(value: string) {
    setActiveTab(value as ManageAreaTab);
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

  function handleDayEnabledChange(day: DayOfWeek) {
    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [OpeningHoursField.Enabled]: !prev[day][OpeningHoursField.Enabled],
      },
    }));
  }

  function handleTimeChange(e: React.ChangeEvent<HTMLInputElement>) {
    const day = e.currentTarget.getAttribute("data-day") as DayOfWeek;
    const field = e.currentTarget.getAttribute(
      "data-field"
    ) as OpeningHoursField;
    const value = e.currentTarget.value;

    setOpeningHours((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [field]: value,
      },
    }));
  }

  function handleRuleTypeChange(value: string) {
    const [day, ruleType] = value.split("|") as [DayOfWeek, PriceRuleType];

    setPricing((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [DayPricingField.RuleType]: ruleType,
      },
    }));
  }

  function handleAddTimeRangeRule(e: React.MouseEvent<HTMLButtonElement>) {
    const day = e.currentTarget.getAttribute("data-day") as DayOfWeek;

    setPricing((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [DayPricingField.TimeRangeRules]: [
          ...prev[day][DayPricingField.TimeRangeRules],
          { ...EMPTY_TIME_RANGE_RULE },
        ],
      },
    }));
  }

  function handleRemoveTimeRangeRule(e: React.MouseEvent<HTMLButtonElement>) {
    const day = e.currentTarget.getAttribute("data-day") as DayOfWeek;
    const index = Number(e.currentTarget.getAttribute("data-index"));

    setPricing((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [DayPricingField.TimeRangeRules]: prev[day][
          DayPricingField.TimeRangeRules
        ].filter((_, i) => i !== index),
      },
    }));
  }

  function handleTimeRangeRuleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const day = e.currentTarget.getAttribute("data-day") as DayOfWeek;
    const index = Number(e.currentTarget.getAttribute("data-index"));
    const field = e.currentTarget.getAttribute(
      "data-field"
    ) as TimeRangeRuleField;
    const value = e.currentTarget.value;

    setPricing((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [DayPricingField.TimeRangeRules]: prev[day][
          DayPricingField.TimeRangeRules
        ].map((rule, i) => {
          if (i !== index) {
            return rule;
          }

          return { ...rule, [field]: value };
        }),
      },
    }));
  }

  function handleAddHoursRule(e: React.MouseEvent<HTMLButtonElement>) {
    const day = e.currentTarget.getAttribute("data-day") as DayOfWeek;

    setPricing((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [DayPricingField.HoursRules]: [
          ...prev[day][DayPricingField.HoursRules],
          { ...EMPTY_HOURS_RULE },
        ],
      },
    }));
  }

  function handleRemoveHoursRule(e: React.MouseEvent<HTMLButtonElement>) {
    const day = e.currentTarget.getAttribute("data-day") as DayOfWeek;
    const index = Number(e.currentTarget.getAttribute("data-index"));

    setPricing((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [DayPricingField.HoursRules]: prev[day][
          DayPricingField.HoursRules
        ].filter((_, i) => i !== index),
      },
    }));
  }

  function handleHoursRuleChange(e: React.ChangeEvent<HTMLInputElement>) {
    const day = e.currentTarget.getAttribute("data-day") as DayOfWeek;
    const index = Number(e.currentTarget.getAttribute("data-index"));
    const field = e.currentTarget.getAttribute("data-field") as HoursRuleField;
    const value = e.currentTarget.value;

    setPricing((prev) => ({
      ...prev,
      [day]: {
        ...prev[day],
        [DayPricingField.HoursRules]: prev[day][
          DayPricingField.HoursRules
        ].map((rule, i) => {
          if (i !== index) {
            return rule;
          }

          return { ...rule, [field]: value };
        }),
      },
    }));
  }

  async function saveProductAssignments() {
    const updates: Promise<Response>[] = [];

    for (const product of products) {
      const code = product[ProductField.Code];
      const currentlyAssigned =
        product[ProductField.StoreCode] === selectedStore;
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
  }

  async function saveOpeningHours() {
    await fetch(
      `${STORES_API}/${encodeURIComponent(selectedStore)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [StoreField.OpeningHours]: openingHours }),
      }
    );
    await fetchStores();
  }

  async function savePricing() {
    await fetch(
      `${STORES_API}/${encodeURIComponent(selectedStore)}`,
      {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ [StoreField.Pricing]: pricing }),
      }
    );
    await fetchStores();
  }

  async function handleSaveClick() {
    if (!selectedStore) {
      return;
    }

    setSaving(true);

    if (activeTab === ManageAreaTab.AssignProducts) {
      await saveProductAssignments();
    } else if (activeTab === ManageAreaTab.OpeningHours) {
      await saveOpeningHours();
    } else if (activeTab === ManageAreaTab.Price) {
      await savePricing();
    }

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
        <div className="max-w-4xl space-y-6">
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

          {/* Tabs */}
          {selectedStore && (
            <Tabs value={activeTab} onValueChange={handleTabChange}>
              <TabsList>
                <TabsTrigger value={ManageAreaTab.AssignProducts}>
                  Assign Products
                </TabsTrigger>
                <TabsTrigger value={ManageAreaTab.OpeningHours}>
                  Opening Hours
                </TabsTrigger>
                <TabsTrigger value={ManageAreaTab.Price}>
                  Price
                </TabsTrigger>
              </TabsList>

              <TabsContent value={ManageAreaTab.AssignProducts}>
                <div className="rounded-lg border bg-white">
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
                              onCheckedChange={() =>
                                handleCheckboxChange(code)
                              }
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
                </div>
              </TabsContent>

              <TabsContent value={ManageAreaTab.OpeningHours}>
                <div className="rounded-lg border bg-white">
                  <div className="divide-y">
                    {DAYS_ORDERED.map((day) => {
                      const dayData = openingHours[day];
                      const isEnabled =
                        dayData[OpeningHoursField.Enabled];
                      const checkboxId = `day-${day}`;

                      return (
                        <div
                          key={day}
                          className="flex items-center gap-4 px-4 py-3"
                        >
                          <Checkbox
                            id={checkboxId}
                            checked={isEnabled}
                            onCheckedChange={() =>
                              handleDayEnabledChange(day)
                            }
                          />
                          <label
                            htmlFor={checkboxId}
                            className="w-28 cursor-pointer text-sm font-medium text-gray-900"
                          >
                            {DAY_LABELS[day]}
                          </label>
                          {isEnabled ? (
                            <div className="flex items-center gap-2">
                              <Input
                                type="time"
                                className="w-32"
                                value={
                                  dayData[OpeningHoursField.OpenTime]
                                }
                                data-day={day}
                                data-field={OpeningHoursField.OpenTime}
                                onChange={handleTimeChange}
                              />
                              <span className="text-sm text-gray-500">
                                to
                              </span>
                              <Input
                                type="time"
                                className="w-32"
                                value={
                                  dayData[OpeningHoursField.CloseTime]
                                }
                                data-day={day}
                                data-field={OpeningHoursField.CloseTime}
                                onChange={handleTimeChange}
                              />
                            </div>
                          ) : (
                            <span className="text-sm text-gray-400">
                              Closed
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>

              <TabsContent value={ManageAreaTab.Price}>
                <div className="rounded-lg border bg-white">
                  {/* Column Headers */}
                  <div className="grid grid-cols-[120px_180px_1fr] gap-4 border-b px-4 py-2">
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Day
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Rule
                    </span>
                    <span className="text-xs font-medium uppercase tracking-wide text-gray-500">
                      Settings
                    </span>
                  </div>

                  {/* Day Rows */}
                  <div className="divide-y">
                    {DAYS_ORDERED.map((day) => {
                      const dayPricing = pricing[day];
                      const ruleType =
                        dayPricing[DayPricingField.RuleType];

                      return (
                        <div
                          key={day}
                          className="grid grid-cols-[120px_180px_1fr] items-start gap-4 px-4 py-3"
                        >
                          {/* Day */}
                          <span className="flex h-9 items-center text-sm font-medium text-gray-900">
                            {DAY_LABELS[day]}
                          </span>

                          {/* Rule Selector */}
                          <Select
                            value={`${day}|${ruleType}`}
                            onValueChange={handleRuleTypeChange}
                          >
                            <SelectTrigger className="w-full">
                              <SelectValue />
                            </SelectTrigger>
                            <SelectContent>
                              {Object.values(PriceRuleType).map(
                                (type) => (
                                  <SelectItem
                                    key={type}
                                    value={`${day}|${type}`}
                                  >
                                    {PRICE_RULE_LABELS[type]}
                                  </SelectItem>
                                )
                              )}
                            </SelectContent>
                          </Select>

                          {/* Settings */}
                          <div>
                            {ruleType === PriceRuleType.AsRequested && (
                              <span className="flex h-9 items-center text-sm text-gray-400">
                                Contact sales for quotation
                              </span>
                            )}

                            {ruleType === PriceRuleType.TimeRange && (
                              <div className="space-y-2">
                                {dayPricing[
                                  DayPricingField.TimeRangeRules
                                ].map((rule, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <Input
                                      type="time"
                                      className="w-32"
                                      value={
                                        rule[TimeRangeRuleField.FromTime]
                                      }
                                      data-day={day}
                                      data-index={index}
                                      data-field={
                                        TimeRangeRuleField.FromTime
                                      }
                                      onChange={handleTimeRangeRuleChange}
                                    />
                                    <span className="text-sm text-gray-500">
                                      to
                                    </span>
                                    <Input
                                      type="time"
                                      className="w-32"
                                      value={
                                        rule[TimeRangeRuleField.ToTime]
                                      }
                                      data-day={day}
                                      data-index={index}
                                      data-field={
                                        TimeRangeRuleField.ToTime
                                      }
                                      onChange={handleTimeRangeRuleChange}
                                    />
                                    <span className="text-sm text-gray-500">
                                      →
                                    </span>
                                    <Input
                                      type="number"
                                      className="w-24"
                                      placeholder="0"
                                      value={
                                        rule[TimeRangeRuleField.Price]
                                      }
                                      data-day={day}
                                      data-index={index}
                                      data-field={
                                        TimeRangeRuleField.Price
                                      }
                                      onChange={handleTimeRangeRuleChange}
                                    />
                                    <span className="text-sm text-gray-500">
                                      THB
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                      data-day={day}
                                      data-index={index}
                                      onClick={handleRemoveTimeRangeRule}
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-sm text-[#B89A5A] hover:text-[#A6883F]"
                                  data-day={day}
                                  onClick={handleAddTimeRangeRule}
                                >
                                  + Add time range
                                </Button>
                              </div>
                            )}

                            {ruleType === PriceRuleType.Hours && (
                              <div className="space-y-2">
                                {dayPricing[
                                  DayPricingField.HoursRules
                                ].map((rule, index) => (
                                  <div
                                    key={index}
                                    className="flex items-center gap-2"
                                  >
                                    <span className="text-sm text-gray-500">
                                      Less than
                                    </span>
                                    <Input
                                      type="number"
                                      className="w-20"
                                      placeholder="0"
                                      value={
                                        rule[HoursRuleField.MaxHours]
                                      }
                                      data-day={day}
                                      data-index={index}
                                      data-field={
                                        HoursRuleField.MaxHours
                                      }
                                      onChange={handleHoursRuleChange}
                                    />
                                    <span className="text-sm text-gray-500">
                                      hours →
                                    </span>
                                    <Input
                                      type="number"
                                      className="w-24"
                                      placeholder="0"
                                      value={rule[HoursRuleField.Price]}
                                      data-day={day}
                                      data-index={index}
                                      data-field={HoursRuleField.Price}
                                      onChange={handleHoursRuleChange}
                                    />
                                    <span className="text-sm text-gray-500">
                                      THB
                                    </span>
                                    <Button
                                      variant="ghost"
                                      size="sm"
                                      className="h-8 w-8 p-0 text-gray-400 hover:text-red-500"
                                      data-day={day}
                                      data-index={index}
                                      onClick={handleRemoveHoursRule}
                                    >
                                      ✕
                                    </Button>
                                  </div>
                                ))}
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  className="text-sm text-[#B89A5A] hover:text-[#A6883F]"
                                  data-day={day}
                                  onClick={handleAddHoursRule}
                                >
                                  + Add hours rule
                                </Button>
                              </div>
                            )}
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          )}
        </div>
      </div>

      {/* Sticky Footer */}
      {selectedStore && (
        <div className="sticky bottom-0 border-t bg-white px-8 py-3">
          <div className="flex justify-end">
            <Button
              className="bg-[#B89A5A] text-white hover:bg-[#A6883F]"
              disabled={saving}
              onClick={handleSaveClick}
            >
              {saving ? "Saving..." : "Save"}
            </Button>
          </div>
        </div>
      )}
    </div>
  );
}

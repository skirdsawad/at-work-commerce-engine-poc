"use client";

import { useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  CalendarDays,
  ShoppingCart,
  Users,
  Newspaper,
  Wrench,
  Building2,
  Settings,
  ChevronDown,
  ChevronRight,
} from "lucide-react";
import { cn } from "@/lib/utils";

enum NavItemKey {
  Dashboard = "dashboard",
  Reservations = "reservations",
  Orders = "orders",
  Customers = "customers",
  News = "news",
  ServiceManagement = "service-management",
  MasterData = "master-data",
  Settings = "settings",
}

enum SubItemKey {
  Products = "products",
  Stores = "stores",
  ManageArea = "manage-area",
  IoTDevices = "iot-devices",
}

interface SubItemConfig {
  key: SubItemKey;
  label: string;
  path: string;
}

interface NavItemConfig {
  key: NavItemKey;
  label: string;
  icon: React.ComponentType<{ className?: string }>;
  expandable?: boolean;
  children?: SubItemConfig[];
}

const NAV_ITEMS: NavItemConfig[] = [
  { key: NavItemKey.Dashboard, label: "Dashboard", icon: LayoutDashboard },
  { key: NavItemKey.Reservations, label: "Reservations", icon: CalendarDays, expandable: true },
  { key: NavItemKey.Orders, label: "Orders", icon: ShoppingCart },
  { key: NavItemKey.Customers, label: "Customers", icon: Users, expandable: true },
  { key: NavItemKey.News, label: "News", icon: Newspaper },
  { key: NavItemKey.ServiceManagement, label: "Services", icon: Wrench, expandable: true },
  {
    key: NavItemKey.MasterData,
    label: "Master Data",
    icon: Building2,
    expandable: true,
    children: [
      { key: SubItemKey.Products, label: "Products", path: "/" },
      { key: SubItemKey.Stores, label: "Stores", path: "/stores" },
      { key: SubItemKey.ManageArea, label: "Manage Area", path: "/manage-area" },
      { key: SubItemKey.IoTDevices, label: "IoT Devices", path: "#" },
    ],
  },
  { key: NavItemKey.Settings, label: "Settings", icon: Settings },
];

export function Sidebar() {
  const pathname = usePathname();
  const [expandedSections, setExpandedSections] = useState<Set<string>>(
    new Set([NavItemKey.MasterData])
  );

  function handleToggleSection(e: React.MouseEvent<HTMLButtonElement>) {
    const key = e.currentTarget.dataset.navKey;
    if (!key) {
      return;
    }

    setExpandedSections((prev) => {
      const next = new Set(prev);
      if (next.has(key)) {
        next.delete(key);
      } else {
        next.add(key);
      }

      return next;
    });
  }

  return (
    <aside className="flex w-56 shrink-0 flex-col overflow-y-auto border-r bg-white">
      <div className="flex items-center justify-center px-4 py-6">
        <Image
          src="/logo.jpg"
          alt="at work"
          width={80}
          height={80}
          className="rounded-lg"
          priority
        />
      </div>

      <nav className="flex-1 space-y-0.5 px-3 pb-4">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const isExpanded = expandedSections.has(item.key);
          const hasChildren = !!item.children?.length;
          const isExpandable = hasChildren || !!item.expandable;

          return (
            <div key={item.key}>
              <button
                type="button"
                data-nav-key={item.key}
                className="flex w-full items-center gap-3 rounded-md px-3 py-2 text-sm text-gray-700 transition-colors hover:bg-gray-100"
                onClick={isExpandable ? handleToggleSection : undefined}
              >
                <Icon className="size-4 shrink-0 text-gray-400" />
                <span className="flex-1 text-left">{item.label}</span>
                {isExpandable && (
                  isExpanded
                    ? <ChevronDown className="size-3.5 text-gray-400" />
                    : <ChevronRight className="size-3.5 text-gray-400" />
                )}
              </button>

              {hasChildren && isExpanded && (
                <div className="ml-7 mt-0.5 space-y-0.5">
                  {item.children!.map((child) => (
                    <Link
                      key={child.key}
                      href={child.path}
                      className={cn(
                        "block rounded-md px-3 py-2 text-sm transition-colors",
                        pathname === child.path
                          ? "bg-[#B89A5A]/15 font-medium text-[#B89A5A]"
                          : "text-gray-500 hover:bg-gray-100"
                      )}
                    >
                      {child.label}
                    </Link>
                  ))}
                </div>
              )}
            </div>
          );
        })}
      </nav>
    </aside>
  );
}

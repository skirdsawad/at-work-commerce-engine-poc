import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Store, StoreField } from "@/types/store";

const dataFilePath = path.join(process.cwd(), "src", "data", "stores.json");

function readStores(): Store[] {
  const raw = fs.readFileSync(dataFilePath, "utf-8");

  return JSON.parse(raw) as Store[];
}

function writeStores(stores: Store[]): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(stores, null, 2), "utf-8");
}

type RouteParams = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { code } = await params;
  const stores = readStores();
  const store = stores.find((s) => s[StoreField.Code] === code);

  if (!store) {
    return NextResponse.json(
      { error: `Store with code '${code}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(store);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { code } = await params;
  const body = await request.json();
  const updates = body as Partial<Store>;

  const stores = readStores();
  const index = stores.findIndex((s) => s[StoreField.Code] === code);

  if (index === -1) {
    return NextResponse.json(
      { error: `Store with code '${code}' not found` },
      { status: 404 }
    );
  }

  stores[index] = { ...stores[index], ...updates, [StoreField.Code]: code };
  writeStores(stores);

  return NextResponse.json(stores[index]);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { code } = await params;
  const stores = readStores();
  const index = stores.findIndex((s) => s[StoreField.Code] === code);

  if (index === -1) {
    return NextResponse.json(
      { error: `Store with code '${code}' not found` },
      { status: 404 }
    );
  }

  const deleted = stores.splice(index, 1)[0];
  writeStores(stores);

  return NextResponse.json(deleted);
}

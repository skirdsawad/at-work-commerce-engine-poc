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

export async function GET() {
  const stores = readStores();

  return NextResponse.json(stores);
}

export async function POST(request: Request) {
  const body = await request.json();
  const store = body as Store;

  if (!store[StoreField.Code] || !store[StoreField.Name]) {
    return NextResponse.json(
      { error: `${StoreField.Code} and ${StoreField.Name} are required` },
      { status: 400 }
    );
  }

  const stores = readStores();
  const exists = stores.some(
    (s) => s[StoreField.Code] === store[StoreField.Code]
  );

  if (exists) {
    return NextResponse.json(
      { error: `Store with code '${store[StoreField.Code]}' already exists` },
      { status: 409 }
    );
  }

  stores.push(store);
  writeStores(stores);

  return NextResponse.json(store, { status: 201 });
}

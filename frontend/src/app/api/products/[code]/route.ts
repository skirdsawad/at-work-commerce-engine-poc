import { NextResponse } from "next/server";
import fs from "fs";
import path from "path";
import { Product, ProductField } from "@/types/product";

const dataFilePath = path.join(process.cwd(), "src", "data", "products.json");

function readProducts(): Product[] {
  const raw = fs.readFileSync(dataFilePath, "utf-8");

  return JSON.parse(raw) as Product[];
}

function writeProducts(products: Product[]): void {
  fs.writeFileSync(dataFilePath, JSON.stringify(products, null, 2), "utf-8");
}

type RouteParams = { params: Promise<{ code: string }> };

export async function GET(_request: Request, { params }: RouteParams) {
  const { code } = await params;
  const products = readProducts();
  const product = products.find((p) => p[ProductField.Code] === code);

  if (!product) {
    return NextResponse.json(
      { error: `Product with code '${code}' not found` },
      { status: 404 }
    );
  }

  return NextResponse.json(product);
}

export async function PUT(request: Request, { params }: RouteParams) {
  const { code } = await params;
  const body = await request.json();
  const { name, description } = body as Partial<Product>;

  const products = readProducts();
  const index = products.findIndex((p) => p[ProductField.Code] === code);

  if (index === -1) {
    return NextResponse.json(
      { error: `Product with code '${code}' not found` },
      { status: 404 }
    );
  }

  if (name !== undefined) {
    products[index][ProductField.Name] = name;
  }
  if (description !== undefined) {
    products[index][ProductField.Description] = description;
  }

  writeProducts(products);

  return NextResponse.json(products[index]);
}

export async function DELETE(_request: Request, { params }: RouteParams) {
  const { code } = await params;
  const products = readProducts();
  const index = products.findIndex((p) => p[ProductField.Code] === code);

  if (index === -1) {
    return NextResponse.json(
      { error: `Product with code '${code}' not found` },
      { status: 404 }
    );
  }

  const deleted = products.splice(index, 1)[0];
  writeProducts(products);

  return NextResponse.json(deleted);
}

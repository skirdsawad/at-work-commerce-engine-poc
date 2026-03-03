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

export async function GET() {
  const products = readProducts();

  return NextResponse.json(products);
}

export async function POST(request: Request) {
  const body = await request.json();
  const { code, name, description } = body as Product;

  if (!code || !name) {
    return NextResponse.json(
      { error: `${ProductField.Code} and ${ProductField.Name} are required` },
      { status: 400 }
    );
  }

  const products = readProducts();
  const exists = products.some(
    (p) => p[ProductField.Code] === code
  );

  if (exists) {
    return NextResponse.json(
      { error: `Product with code '${code}' already exists` },
      { status: 409 }
    );
  }

  const newProduct: Product = {
    [ProductField.Code]: code,
    [ProductField.Name]: name,
    [ProductField.Description]: description ?? "",
  };

  products.push(newProduct);
  writeProducts(products);

  return NextResponse.json(newProduct, { status: 201 });
}

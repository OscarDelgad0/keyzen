import { registerMock, type MockRequest } from "@/core/api";
import { mockCategories, mockProducts, deriveStatus } from "@/modules/inventory/mocks/inventory.data";
import type { Category, CreateProductInput, Product, ProductPage } from "@/modules/inventory/schemas";

const products: Product[] = [...mockProducts];

function categoriesWithCount(): Category[] {
  return mockCategories.map((c) => ({...c, productCount: products.filter((p) => p.categoryId === c.id).length}));
}

function paginate(list: Product[], req: MockRequest): ProductPage {
  const page = Math.max(1, Number(req.query.page ?? "1"));
  const pageSize = Math.max(1, Number(req.query.pageSize ?? "20"));
  const start = (page - 1) * pageSize;
  return { items: list.slice(start, start + pageSize), total: list.length, page, pageSize };
}

function searchList(query: string): Product[] {
  const q = query.trim().toLowerCase();
  if (!q) return products;
  return products.filter((p) => p.name.toLowerCase().includes(q));
}

registerMock("GET", "/categories", () => categoriesWithCount());
registerMock("GET", "/categories/:id/products", (req: MockRequest) => paginate(products.filter((p) => p.categoryId === req.params.id), req));
registerMock("GET", "/products", (req: MockRequest) => paginate(searchList(req.query.q ?? ""), req));
registerMock("POST", "/products", (req: MockRequest) => {
  const input = req.body as CreateProductInput;
  const created: Product = { id:`p-${Date.now()}`, name:input.name, categoryId:input.categoryId, stock:input.stock, price:input.price, lowStockThreshold:input.lowStockThreshold, unit:input.unit, status:deriveStatus(input.stock,input.lowStockThreshold), createdAt:new Date().toISOString() };
  products.push(created);
  return created;
});

// GET /inventory/summary -> totales sobre TODOS los productos.
registerMock("GET", "/inventory/summary", () => ({
  totalProducts: products.length,
  lowStockCount: products.filter((p) => p.status === "lowStock").length,
  outOfStockCount: products.filter((p) => p.status === "outOfStock").length,
  inventoryValue: products.reduce((sum, p) => sum + p.price * p.stock, 0),
}));

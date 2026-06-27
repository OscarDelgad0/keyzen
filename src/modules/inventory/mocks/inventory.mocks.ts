import { registerMock, type MockRequest } from "@/core/api";
import { mockCategories, mockProducts, deriveStatus } from "@/modules/inventory/mocks/inventory.data";
import type { Category, CreateProductInput, Product } from "@/modules/inventory/schemas";
const products: Product[] = [...mockProducts];
function categoriesWithCount(): Category[] {
  return mockCategories.map(c => ({...c, productCount: products.filter(p=>p.categoryId===c.id).length}));
}
registerMock("GET","/categories",()=>categoriesWithCount());
registerMock("GET","/categories/:id/products",(req:MockRequest)=>products.filter(p=>p.categoryId===req.params.id));
registerMock("GET","/products",(req:MockRequest)=>searchProducts(req.query.q??""));
function searchProducts(query:string):Product[]{const q=query.trim().toLowerCase();if(!q)return products;return products.filter(p=>p.name.toLowerCase().includes(q));}
registerMock("POST","/products",(req:MockRequest)=>{
  const input=req.body as CreateProductInput;
  const created:Product={id:`p-${Date.now()}`,name:input.name,categoryId:input.categoryId,stock:input.stock,price:input.price,lowStockThreshold:input.lowStockThreshold,unit:input.unit,status:deriveStatus(input.stock,input.lowStockThreshold),createdAt:new Date().toISOString()};
  products.push(created);return created;
});

import { apiFetch, type ApiResult } from "@/core/api";
import { categoryListSchema, productListSchema, productSchema, createProductSchema, type Category, type Product, type CreateProductInput } from "@/modules/inventory/schemas";
import "@/modules/inventory/mocks/inventory.mocks";
export function getCategories():Promise<ApiResult<Category[]>>{return apiFetch({path:"/categories",method:"GET",responseSchema:categoryListSchema});}
export function getProductsByCategory(id:string):Promise<ApiResult<Product[]>>{return apiFetch({path:`/categories/${encodeURIComponent(id)}/products`,method:"GET",responseSchema:productListSchema});}
export function searchProducts(q:string):Promise<ApiResult<Product[]>>{return apiFetch({path:`/products?q=${encodeURIComponent(q)}`,method:"GET",responseSchema:productListSchema});}
export function createProduct(input:CreateProductInput):Promise<ApiResult<Product>>{return apiFetch({path:"/products",method:"POST",body:input,requestSchema:createProductSchema,responseSchema:productSchema});}

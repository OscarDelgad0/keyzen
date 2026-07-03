import { z } from "zod";
export const productStatusSchema = z.enum(["active","inactive","lowStock","outOfStock"]);
export type ProductStatus = z.infer<typeof productStatusSchema>;
export const productUnitSchema = z.enum(["piece","pair","meter","set"]);
export type ProductUnit = z.infer<typeof productUnitSchema>;
export const categorySchema = z.object({ id:z.string(), name:z.string().min(1), icon:z.string(), productCount:z.number().int().nonnegative() });
export type Category = z.infer<typeof categorySchema>;
export const categoryListSchema = z.array(categorySchema);
export const productSchema = z.object({ id:z.string(), name:z.string().min(1), categoryId:z.string(), stock:z.number().int().nonnegative(), price:z.number().nonnegative(), status:productStatusSchema, lowStockThreshold:z.number().int().nonnegative(), unit:productUnitSchema, createdAt:z.string() });
export type Product = z.infer<typeof productSchema>;
export const productListSchema = z.array(productSchema);
export const createProductSchema = z.object({ name:z.string().min(1,"El nombre es obligatorio."), categoryId:z.string().min(1,"Selecciona una categoría."), stock:z.number().int().nonnegative(), price:z.number().nonnegative(), lowStockThreshold:z.number().int().nonnegative(), unit:productUnitSchema });
export type CreateProductInput = z.infer<typeof createProductSchema>;

/**
 * Página de productos (respuesta paginada).
 * Contrato que el backend de C# deberá respetar: items + total + page + pageSize.
 */
export const productPageSchema = z.object({
  items: productListSchema,
  total: z.number().int().nonnegative(),
  page: z.number().int().positive(),
  pageSize: z.number().int().positive(),
});
export type ProductPage = z.infer<typeof productPageSchema>;

/**
 * Resumen de inventario para las stat cards.
 * Totales calculados sobre TODOS los productos (no la página actual).
 * inventoryValue = suma de (price * stock) a precio de venta.
 */
export const inventorySummarySchema = z.object({
  totalProducts: z.number().int().nonnegative(),
  lowStockCount: z.number().int().nonnegative(),
  outOfStockCount: z.number().int().nonnegative(),
  inventoryValue: z.number().nonnegative(),
});
export type InventorySummary = z.infer<typeof inventorySummarySchema>;

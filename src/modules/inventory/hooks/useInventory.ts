"use client";
import { useCallback, useEffect, useState } from "react";
import type { ApiResult } from "@/core/api";
import { getCategories, getProductsByCategory, searchProducts, createProduct } from "@/modules/inventory/services";
import type { Category, Product, CreateProductInput } from "@/modules/inventory/schemas";
interface AsyncState<T>{data:T|null;loading:boolean;error:string|null;}
function applyResult<T>(r:ApiResult<T>,set:React.Dispatch<React.SetStateAction<AsyncState<T>>>){if(r.ok)set({data:r.data,loading:false,error:null});else set({data:null,loading:false,error:r.error.message});}
export function useCategories(){
  const[s,set]=useState<AsyncState<Category[]>>({data:null,loading:true,error:null});
  const load=useCallback(async()=>{set(p=>({...p,loading:true,error:null}));applyResult(await getCategories(),set);},[]);
  useEffect(()=>{load();},[load]); return{...s,refetch:load};
}
export function useProductsByCategory(categoryId:string|null){
  const[s,set]=useState<AsyncState<Product[]>>({data:null,loading:Boolean(categoryId),error:null});
  const load=useCallback(async()=>{if(!categoryId){set({data:null,loading:false,error:null});return;}set(p=>({...p,loading:true,error:null}));applyResult(await getProductsByCategory(categoryId),set);},[categoryId]);
  useEffect(()=>{load();},[load]); return{...s,refetch:load};
}
export function useProductSearch(){
  const[s,set]=useState<AsyncState<Product[]>>({data:null,loading:false,error:null});
  const run=useCallback(async(q:string)=>{set(p=>({...p,loading:true,error:null}));applyResult(await searchProducts(q),set);},[]);
  const clear=useCallback(()=>{set({data:null,loading:false,error:null});},[]);
  return{...s,run,clear};
}
export function useCreateProduct(){
  const[saving,setSaving]=useState(false);const[error,setError]=useState<string|null>(null);
  const submit=useCallback(async(input:CreateProductInput):Promise<Product|null>=>{setSaving(true);setError(null);const r=await createProduct(input);setSaving(false);if(r.ok)return r.data;setError(r.error.message);return null;},[]);
  return{submit,saving,error};
}

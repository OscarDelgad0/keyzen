import type { Category, Product, ProductStatus } from "@/modules/inventory/schemas";
export function deriveStatus(stock:number,low:number,forceInactive=false):ProductStatus{
  if(forceInactive)return "inactive"; if(stock<=0)return "outOfStock"; if(stock<=low)return "lowStock"; return "active";
}
export const mockCategories: Category[] = [
  {id:"cat-house-keys",name:"Llaves de casa",icon:"home",productCount:0},
  {id:"cat-car-keys",name:"Llaves de carro",icon:"car",productCount:0},
  {id:"cat-moto-keys",name:"Llaves de moto",icon:"moto",productCount:0},
  {id:"cat-batteries",name:"Pilas",icon:"battery",productCount:0},
  {id:"cat-remotes",name:"Botones de control",icon:"remote",productCount:0},
  {id:"cat-accessories",name:"Accesorios",icon:"accessory",productCount:0},
];
function mk(p:Omit<Product,"status"|"createdAt">&{createdAt:string;forceInactive?:boolean}):Product{
  const{forceInactive,...rest}=p; return{...rest,status:deriveStatus(p.stock,p.lowStockThreshold,forceInactive)};
}
export const mockProducts: Product[] = [
  mk({id:"p-001",name:"Llave Yale estándar",categoryId:"cat-house-keys",stock:42,price:150,lowStockThreshold:10,unit:"piece",createdAt:"2025-01-10T09:00:00Z"}),
  mk({id:"p-002",name:"Llave multipunto",categoryId:"cat-house-keys",stock:3,price:890,lowStockThreshold:5,unit:"piece",createdAt:"2025-01-12T09:00:00Z"}),
  mk({id:"p-003",name:"Llave tubular",categoryId:"cat-house-keys",stock:0,price:220,lowStockThreshold:5,unit:"piece",createdAt:"2025-01-15T09:00:00Z"}),
  mk({id:"p-004",name:"Llave antigua de paleta",categoryId:"cat-house-keys",stock:8,price:95,lowStockThreshold:4,unit:"piece",createdAt:"2025-02-01T09:00:00Z",forceInactive:true}),
  mk({id:"p-010",name:"Llave con transponder",categoryId:"cat-car-keys",stock:15,price:1250,lowStockThreshold:5,unit:"piece",createdAt:"2025-01-20T09:00:00Z"}),
  mk({id:"p-011",name:"Carcasa de llave 3 botones",categoryId:"cat-car-keys",stock:4,price:320,lowStockThreshold:6,unit:"piece",createdAt:"2025-01-22T09:00:00Z"}),
  mk({id:"p-012",name:"Llave tipo navaja",categoryId:"cat-car-keys",stock:22,price:540,lowStockThreshold:8,unit:"piece",createdAt:"2025-02-05T09:00:00Z"}),
  mk({id:"p-020",name:"Llave de moto en blanco",categoryId:"cat-moto-keys",stock:30,price:80,lowStockThreshold:10,unit:"piece",createdAt:"2025-02-10T09:00:00Z"}),
  mk({id:"p-021",name:"Switch de encendido",categoryId:"cat-moto-keys",stock:2,price:410,lowStockThreshold:4,unit:"piece",createdAt:"2025-02-11T09:00:00Z"}),
  mk({id:"p-030",name:"Pila CR2032",categoryId:"cat-batteries",stock:120,price:25,lowStockThreshold:30,unit:"piece",createdAt:"2025-01-05T09:00:00Z"}),
  mk({id:"p-031",name:"Pila CR2025",categoryId:"cat-batteries",stock:18,price:25,lowStockThreshold:30,unit:"piece",createdAt:"2025-01-06T09:00:00Z"}),
  mk({id:"p-032",name:"Pila A23 12V",categoryId:"cat-batteries",stock:0,price:35,lowStockThreshold:20,unit:"piece",createdAt:"2025-01-07T09:00:00Z"}),
  mk({id:"p-040",name:"Control universal de portón",categoryId:"cat-remotes",stock:9,price:380,lowStockThreshold:5,unit:"piece",createdAt:"2025-02-15T09:00:00Z"}),
  mk({id:"p-041",name:"Botón de repuesto rolling code",categoryId:"cat-remotes",stock:6,price:210,lowStockThreshold:8,unit:"piece",createdAt:"2025-02-16T09:00:00Z"}),
  mk({id:"p-050",name:"Llavero metálico",categoryId:"cat-accessories",stock:75,price:30,lowStockThreshold:20,unit:"piece",createdAt:"2025-01-25T09:00:00Z"}),
  mk({id:"p-051",name:"Funda de silicón para llave",categoryId:"cat-accessories",stock:5,price:60,lowStockThreshold:10,unit:"piece",createdAt:"2025-01-26T09:00:00Z"}),
  mk({id:"p-052",name:"Argolla partida (par)",categoryId:"cat-accessories",stock:40,price:15,lowStockThreshold:15,unit:"pair",createdAt:"2025-01-27T09:00:00Z"}),
];

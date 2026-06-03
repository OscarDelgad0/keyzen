/**
 * Lista única de módulos de navegación.
 *
 * Fuente de verdad para TODA la navegación: el sidebar (escritorio/tablet),
 * la barra inferior (móvil) y el menú "Más" leen de aquí. Para agregar o
 * quitar un módulo se edita solo este archivo y las tres navegaciones se
 * actualizan solas.
 */

import type { SvgIconComponent } from "@mui/icons-material";
import DashboardIcon from "@mui/icons-material/GridViewOutlined";
import InventoryIcon from "@mui/icons-material/Inventory2Outlined";
import SalesIcon from "@mui/icons-material/ShoppingCartOutlined";
import ServicesIcon from "@mui/icons-material/BuildOutlined";
import StockIcon from "@mui/icons-material/SwapHorizOutlined";
import CustomersIcon from "@mui/icons-material/PeopleOutlined";
import ReportsIcon from "@mui/icons-material/BarChartOutlined";
import SettingsIcon from "@mui/icons-material/SettingsOutlined";

export interface NavModule {
  /** Identificador interno del módulo. */
  key: string;
  /** Nombre visible en la navegación. */
  label: string;
  /** Ícono de línea (Material Symbols / MUI). */
  icon: SvgIconComponent;
  /** Ruta del módulo dentro del grupo (admin). */
  path: string;
  /**
   * Si true, aparece en la barra inferior de móvil.
   * Si false, aparece en el menú "Más". (En escritorio/tablet todos van en el sidebar.)
   */
  inBottomNav: boolean;
}

/** Módulos del sistema, en orden de aparición en el sidebar. */
export const navModules: NavModule[] = [
  { key: "dashboard", label: "Dashboard", icon: DashboardIcon, path: "/dashboard", inBottomNav: false },
  { key: "inventory", label: "Inventario", icon: InventoryIcon, path: "/inventory", inBottomNav: true },
  { key: "sales", label: "Ventas", icon: SalesIcon, path: "/sales", inBottomNav: true },
  { key: "services", label: "Servicios", icon: ServicesIcon, path: "/services", inBottomNav: true },
  { key: "stock-movements", label: "Entradas/Salidas", icon: StockIcon, path: "/stock-movements", inBottomNav: false },
  { key: "customers", label: "Clientes", icon: CustomersIcon, path: "/customers", inBottomNav: false },
  { key: "reports", label: "Reportes", icon: ReportsIcon, path: "/reports", inBottomNav: false },
  { key: "settings", label: "Configuración", icon: SettingsIcon, path: "/settings", inBottomNav: false },
];

/** Módulos que se muestran en la barra inferior de móvil (los más usados). */
export const bottomNavModules = navModules.filter((m) => m.inBottomNav);

/** Módulos que se muestran en el menú "Más" de móvil (el resto). */
export const moreModules = navModules.filter((m) => !m.inBottomNav);

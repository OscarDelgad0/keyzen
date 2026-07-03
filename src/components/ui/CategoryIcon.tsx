"use client";

/**
 * Resuelve la clave de ícono de una categoría a un ícono real de MUI.
 *
 * Las categorías traen `icon` como clave (ej. "home", "car"). Aquí se mapea al
 * componente. Cualquier clave desconocida o ausente cae en un ícono genérico
 * de inventario, así los productos "sin ícono" igual muestran algo coherente.
 */

import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import DirectionsCarOutlinedIcon from "@mui/icons-material/DirectionsCarOutlined";
import TwoWheelerOutlinedIcon from "@mui/icons-material/TwoWheelerOutlined";
import Battery5BarOutlinedIcon from "@mui/icons-material/Battery5BarOutlined";
import SettingsRemoteOutlinedIcon from "@mui/icons-material/SettingsRemoteOutlined";
import VpnKeyOutlinedIcon from "@mui/icons-material/VpnKeyOutlined";
import Inventory2OutlinedIcon from "@mui/icons-material/Inventory2Outlined";
import type { SvgIconProps } from "@mui/material";

/** Mapa clave -> componente de ícono (líneas simples, outline). */
const iconMap: Record<string, React.ComponentType<SvgIconProps>> = {
  home: HomeOutlinedIcon,
  car: DirectionsCarOutlinedIcon,
  moto: TwoWheelerOutlinedIcon,
  battery: Battery5BarOutlinedIcon,
  remote: SettingsRemoteOutlinedIcon,
  accessory: VpnKeyOutlinedIcon,
};

/** Ícono usado cuando la clave no existe en el mapa. */
const FallbackIcon = Inventory2OutlinedIcon;

interface CategoryIconProps extends SvgIconProps {
  /** Clave del ícono (campo `icon` de la categoría). Puede ser undefined. */
  iconKey?: string;
}

export function CategoryIcon({ iconKey, ...props }: CategoryIconProps) {
  const Icon = (iconKey && iconMap[iconKey]) || FallbackIcon;
  return <Icon {...props} />;
}

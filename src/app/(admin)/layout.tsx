/**
 * Layout del grupo (admin).
 *
 * Envuelve todas las pantallas de módulos con el armazón administrativo
 * (sidebar / barra inferior + topbar). El nombre del grupo entre paréntesis
 * no aparece en la URL.
 */

import { AdminShell } from "@/components/layout";

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <AdminShell>{children}</AdminShell>;
}

/**
 * Raíz del sitio: redirige al dashboard, que es la pantalla de inicio.
 */

import { redirect } from "next/navigation";

export default function HomePage() {
  redirect("/dashboard");
}

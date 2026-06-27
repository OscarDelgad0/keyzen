"use client";

/**
 * Modal para crear un producto.
 *
 * Usa ModalContainer (overlay + glass + botones). El formulario es controlado
 * y valida con el esquema Zod antes de habilitar "Crear". Si llega
 * `preselectedCategoryId`, el select arranca con esa categoría (caso: hay un
 * filtro de categoría activo al pulsar "+").
 *
 * No llama a la API directamente: recibe `onSubmit` (del hook useCreateProduct)
 * y los estados `saving` para el botón.
 */

import { useEffect, useMemo, useState } from "react";
import {
  Box,
  MenuItem,
  TextField,
  Typography,
} from "@mui/material";
import { ModalContainer } from "@/components/ui/ModalContainer";
import {
  createProductSchema,
  type Category,
  type CreateProductInput,
  type ProductUnit,
} from "@/modules/inventory/schemas";

const unitOptions: { value: ProductUnit; label: string }[] = [
  { value: "piece", label: "Pieza" },
  { value: "pair", label: "Par" },
  { value: "meter", label: "Metro" },
  { value: "set", label: "Set" },
];

interface ProductFormModalProps {
  open: boolean;
  onClose: () => void;
  categories: Category[];
  preselectedCategoryId?: string | null;
  /** Devuelve true si se creó bien (para cerrar y refrescar). */
  onSubmit: (input: CreateProductInput) => Promise<boolean>;
  saving: boolean;
  error: string | null;
}

/** Estado inicial del formulario. */
function emptyForm(categoryId: string): {
  name: string;
  categoryId: string;
  price: string;
  stock: string;
  lowStockThreshold: string;
  unit: ProductUnit;
} {
  return {
    name: "",
    categoryId,
    price: "",
    stock: "",
    lowStockThreshold: "",
    unit: "piece",
  };
}

export function ProductFormModal({
  open,
  onClose,
  categories,
  preselectedCategoryId,
  onSubmit,
  saving,
  error,
}: ProductFormModalProps) {
  const [form, setForm] = useState(() =>
    emptyForm(preselectedCategoryId ?? "")
  );

  // Al abrir, reinicia el formulario respetando la categoría preseleccionada.
  useEffect(() => {
    if (open) setForm(emptyForm(preselectedCategoryId ?? ""));
  }, [open, preselectedCategoryId]);

  // Construye el input tipado a partir de los campos de texto.
  const parsedInput = useMemo<CreateProductInput | null>(() => {
    const candidate = {
      name: form.name.trim(),
      categoryId: form.categoryId,
      price: Number(form.price),
      stock: Number(form.stock),
      lowStockThreshold: Number(form.lowStockThreshold),
      unit: form.unit,
    };
    const result = createProductSchema.safeParse(candidate);
    return result.success ? result.data : null;
  }, [form]);

  const handleChange =
    (field: keyof ReturnType<typeof emptyForm>) =>
    (e: React.ChangeEvent<HTMLInputElement>) => {
      setForm((f) => ({ ...f, [field]: e.target.value }));
    };

  const handlePrimary = async () => {
    if (!parsedInput) return;
    const okCreated = await onSubmit(parsedInput);
    if (okCreated) onClose();
  };

  return (
    <ModalContainer
      open={open}
      onClose={onClose}
      title="Nuevo producto"
      width="xs"
      primaryLabel="Crear"
      onPrimary={handlePrimary}
      primaryLoading={saving}
      primaryDisabled={!parsedInput}
      secondaryLabel="Cancelar"
    >
      <Box sx={{ display: "flex", flexDirection: "column", gap: 2, pt: 0.5 }}>
        <TextField
          select
          label="Categoría"
          value={form.categoryId}
          onChange={handleChange("categoryId")}
          fullWidth
          size="small"
        >
          {categories.map((c) => (
            <MenuItem key={c.id} value={c.id}>
              {c.name}
            </MenuItem>
          ))}
        </TextField>

        <TextField
          label="Nombre"
          placeholder="Llave Yale estándar"
          value={form.name}
          onChange={handleChange("name")}
          fullWidth
          size="small"
        />

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <TextField
            label="Precio"
            type="number"
            value={form.price}
            onChange={handleChange("price")}
            fullWidth
            size="small"
            inputProps={{ min: 0 }}
          />
          <TextField
            label="Stock"
            type="number"
            value={form.stock}
            onChange={handleChange("stock")}
            fullWidth
            size="small"
            inputProps={{ min: 0 }}
          />
        </Box>

        <Box sx={{ display: "flex", gap: 1.5 }}>
          <TextField
            label="Umbral bajo stock"
            type="number"
            value={form.lowStockThreshold}
            onChange={handleChange("lowStockThreshold")}
            fullWidth
            size="small"
            inputProps={{ min: 0 }}
          />
          <TextField
            select
            label="Unidad"
            value={form.unit}
            onChange={handleChange("unit")}
            fullWidth
            size="small"
          >
            {unitOptions.map((u) => (
              <MenuItem key={u.value} value={u.value}>
                {u.label}
              </MenuItem>
            ))}
          </TextField>
        </Box>

        {error && (
          <Typography variant="body2" color="error">
            {error}
          </Typography>
        )}
      </Box>
    </ModalContainer>
  );
}

"use client";

/**
 * Dashboard (contenido inicial de referencia).
 *
 * Muestra cards con glass y una tabla con el patrón de estado aprobado, para
 * verificar el theme dentro del shell. Se reemplazará por el dashboard real
 * (métricas) en una fase posterior.
 */

import {
  Box,
  Card,
  CardContent,
  Typography,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from "@mui/material";
import {
  inventoryStatusTones,
  type StatusKey,
  TABLE_BAR_OPACITY,
  TABLE_CHIP_OPACITY,
  TABLE_FADED_ROW_BG,
  TABLE_FADED_ROW_OPACITY,
} from "@/theme/brand";

const rows: { name: string; status: StatusKey; stock: number; price: string }[] = [
  { name: "Llave residencial", status: "active", stock: 42, price: "$150" },
  { name: "Control automotriz", status: "lowStock", stock: 3, price: "$890" },
  { name: "Chip viejo", status: "inactive", stock: 0, price: "$320" },
  { name: "Chapa multipunto", status: "outOfStock", stock: 0, price: "$540" },
];

export default function DashboardPage() {
  return (
    <Box>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={1.5} sx={{ mb: 3 }}>
        {[
          { label: "Ventas hoy", value: "$2,450" },
          { label: "Servicios", value: "17" },
          { label: "Bajo stock", value: "3" },
        ].map((m) => (
          <Card key={m.label} sx={{ flex: 1 }}>
            <CardContent>
              <Typography variant="body2" color="text.secondary">
                {m.label}
              </Typography>
              <Typography sx={{ fontSize: 24, fontWeight: 500, mt: 0.5 }}>
                {m.value}
              </Typography>
            </CardContent>
          </Card>
        ))}
      </Stack>

      <TableContainer
        component={Box}
        sx={{
          bgcolor: "background.paper",
          borderRadius: 3,
          border: 1,
          borderColor: "divider",
          overflow: "hidden",
        }}
      >
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell>Estado</TableCell>
              <TableCell>Stock</TableCell>
              <TableCell align="right">Precio</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {rows.map((row) => {
              const tone = inventoryStatusTones[row.status];
              return (
                <TableRow
                  key={row.name}
                  sx={{
                    bgcolor: tone.faded ? TABLE_FADED_ROW_BG : "background.paper",
                    opacity: tone.faded ? TABLE_FADED_ROW_OPACITY : 1,
                    "& td:first-of-type": {
                      borderLeft: `4px solid rgba(${tone.baseRgb}, ${TABLE_BAR_OPACITY})`,
                    },
                  }}
                >
                  <TableCell sx={{ fontWeight: 500 }}>{row.name}</TableCell>
                  <TableCell>
                    <Chip
                      label={tone.label}
                      size="small"
                      sx={{
                        bgcolor: `rgba(${tone.baseRgb}, ${TABLE_CHIP_OPACITY})`,
                        color: tone.chipText,
                        fontWeight: 500,
                      }}
                    />
                  </TableCell>
                  <TableCell>{row.stock}</TableCell>
                  <TableCell align="right">{row.price}</TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </TableContainer>
    </Box>
  );
}

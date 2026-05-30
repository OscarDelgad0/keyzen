"use client";

/**
 * Página de prueba del theme.
 *
 * No es una pantalla del producto: solo sirve para verificar visualmente que
 * el theme, el switch claro/oscuro, el glass y el patrón de estado de tabla
 * funcionan. Se reemplazará por el dashboard real más adelante.
 */

import {
  AppBar,
  Toolbar,
  Box,
  Card,
  CardContent,
  Typography,
  Button,
  IconButton,
  TextField,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
  Stack,
} from "@mui/material";
import { useThemeStore } from "@/store/ui/themeStore";
import {
  brand,
  inventoryStatusTones,
  type StatusKey,
  TABLE_BAR_OPACITY,
  TABLE_CHIP_OPACITY,
  TABLE_FADED_ROW_BG,
  TABLE_FADED_ROW_OPACITY,
} from "@/theme/brand";

// Filas mock para probar el patrón de estado.
const rows: { name: string; status: StatusKey; stock: number; price: string }[] = [
  { name: "Llave residencial", status: "active", stock: 42, price: "$150" },
  { name: "Control automotriz", status: "lowStock", stock: 3, price: "$890" },
  { name: "Chip viejo", status: "inactive", stock: 0, price: "$320" },
  { name: "Chapa multipunto", status: "outOfStock", stock: 0, price: "$540" },
];

export default function ThemePreviewPage() {
  const mode = useThemeStore((state) => state.mode);
  const toggleMode = useThemeStore((state) => state.toggleMode);
  const isDark = mode === "dark";

  return (
    <Box sx={{ minHeight: "100vh", bgcolor: "background.default" }}>
      {/* Barra superior con glass */}
      <AppBar position="sticky">
        <Toolbar sx={{ gap: 1.5 }}>
          <Box
            sx={{
              width: 34,
              height: 34,
              borderRadius: 2,
              bgcolor: "primary.main",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              color: "primary.contrastText",
              fontWeight: 500,
            }}
          >
            LA
          </Box>
          <Typography sx={{ flexGrow: 1, fontWeight: 500 }}>
            {brand.name}
          </Typography>
          <IconButton onClick={toggleMode} color="inherit" aria-label="cambiar tema">
            {isDark ? "☀️" : "🌙"}
          </IconButton>
        </Toolbar>
      </AppBar>

      <Box sx={{ p: { xs: 2, sm: 3 }, maxWidth: 900, mx: "auto" }}>
        {/* Cards con glass */}
        <Stack
          direction={{ xs: "column", sm: "row" }}
          spacing={1.5}
          sx={{ mb: 3 }}
        >
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

        {/* Botones e input táctiles */}
        <Stack direction="row" spacing={1.5} flexWrap="wrap" useFlexGap sx={{ mb: 2 }}>
          <Button variant="contained">Registrar venta</Button>
          <Button variant="outlined">Secundario</Button>
        </Stack>
        <TextField
          label="Nombre del producto"
          defaultValue="Llave residencial"
          fullWidth
          sx={{ mb: 3 }}
        />

        {/* Tabla con filas PLANAS y color tenue de estado */}
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
                      // Fila blanca; las inactivas van en gris y "apagadas".
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
                    {/* Precio en peso normal, sin negrita. */}
                    <TableCell align="right">{row.price}</TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </TableContainer>
      </Box>
    </Box>
  );
}

"use client";
import { Box, Button, CircularProgress, Dialog, DialogActions, DialogContent, DialogTitle, IconButton, Typography } from "@mui/material";
import CloseIcon from "@mui/icons-material/Close";
export type ModalWidth = "xs" | "sm" | "md";
export interface ModalContainerProps {
  open: boolean; onClose: () => void; title: string; width?: ModalWidth;
  primaryLabel?: string; onPrimary?: () => void; primaryLoading?: boolean; primaryDisabled?: boolean;
  secondaryLabel?: string; onSecondary?: () => void; children: React.ReactNode;
}
export function ModalContainer({ open,onClose,title,width="xs",primaryLabel,onPrimary,primaryLoading=false,primaryDisabled=false,secondaryLabel,onSecondary,children }: ModalContainerProps) {
  const handleSecondary = onSecondary ?? onClose;
  const showPrimary = Boolean(primaryLabel); const showSecondary = Boolean(secondaryLabel);
  const showActions = showPrimary || showSecondary;
  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth={width}
      fullWidth
      disableEscapeKeyDown={primaryLoading}
      PaperProps={{
        sx: {
          backgroundColor: "background.paper",
          backgroundImage: "none",
          backdropFilter: "none",
          WebkitBackdropFilter: "none",
        },
      }}
    >
      <DialogTitle component="div" sx={{ display:"flex", alignItems:"center", justifyContent:"space-between", gap:1, pr:1.5 }}>
        <Typography variant="h6" sx={{ fontWeight:500 }}>{title}</Typography>
        <IconButton aria-label="Cerrar" onClick={onClose} disabled={primaryLoading} size="small" edge="end"><CloseIcon fontSize="small" /></IconButton>
      </DialogTitle>
      <DialogContent dividers>{children}</DialogContent>
      {showActions && (
        <DialogActions sx={{ px:3, py:2, gap:1 }}>
          {showSecondary && <Button variant="text" color="inherit" onClick={handleSecondary} disabled={primaryLoading}>{secondaryLabel}</Button>}
          {showPrimary && <Button variant="contained" color="primary" onClick={onPrimary} disabled={primaryDisabled||primaryLoading} startIcon={primaryLoading?<CircularProgress size={16} color="inherit"/>:undefined}><Box component="span">{primaryLabel}</Box></Button>}
        </DialogActions>
      )}
    </Dialog>
  );
}

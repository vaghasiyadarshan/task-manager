// hooks/useDialog.js
import { useState } from "react";

export default function useDialog() {
  const [dialogOpen, setDialogOpen] = useState(false);
  const [dialogConfig, setDialogConfig] = useState({});

  const openDialog = (config) => {
    setDialogConfig(config);
    setDialogOpen(true);
  };

  const closeDialog = () => {
    setDialogOpen(false);
    setDialogConfig({});
  };

  return {
    dialogOpen,
    dialogConfig,
    openDialog,
    closeDialog,
  };
}

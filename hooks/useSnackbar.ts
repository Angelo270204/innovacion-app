// hooks/useSnackbar.ts
// Hook personalizado para manejar el estado y comportamiento del Snackbar

import { useState, useCallback } from 'react';
import { SnackbarType } from '@/components/Snackbar';

interface SnackbarState {
  visible: boolean;
  message: string;
  type: SnackbarType;
  action?: {
    label: string;
    onPress: () => void;
  };
}

interface ShowSnackbarOptions {
  message: string;
  type?: SnackbarType;
  action?: {
    label: string;
    onPress: () => void;
  };
}

export const useSnackbar = () => {
  const [snackbar, setSnackbar] = useState<SnackbarState>({
    visible: false,
    message: '',
    type: 'info',
  });

  const showSnackbar = useCallback(
    ({ message, type = 'info', action }: ShowSnackbarOptions) => {
      setSnackbar({
        visible: true,
        message,
        type,
        action,
      });
    },
    []
  );

  const hideSnackbar = useCallback(() => {
    setSnackbar((prev) => ({
      ...prev,
      visible: false,
    }));
  }, []);

  // Funciones de ayuda para tipos específicos
  const showSuccess = useCallback(
    (message: string, action?: { label: string; onPress: () => void }) => {
      showSnackbar({ message, type: 'success', action });
    },
    [showSnackbar]
  );

  const showError = useCallback(
    (message: string, action?: { label: string; onPress: () => void }) => {
      showSnackbar({ message, type: 'error', action });
    },
    [showSnackbar]
  );

  const showWarning = useCallback(
    (message: string, action?: { label: string; onPress: () => void }) => {
      showSnackbar({ message, type: 'warning', action });
    },
    [showSnackbar]
  );

  const showInfo = useCallback(
    (message: string, action?: { label: string; onPress: () => void }) => {
      showSnackbar({ message, type: 'info', action });
    },
    [showSnackbar]
  );

  return {
    snackbar,
    showSnackbar,
    hideSnackbar,
    showSuccess,
    showError,
    showWarning,
    showInfo,
  };
};

export default useSnackbar;
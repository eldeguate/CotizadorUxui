import { useState } from 'react';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from './ui/dialog';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { AlertTriangle } from 'lucide-react';

interface DeleteRegionDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  regionName: string;
  departmentCount: number;
  onConfirm: () => void;
}

export function DeleteRegionDialog({
  open,
  onOpenChange,
  regionName,
  departmentCount,
  onConfirm,
}: DeleteRegionDialogProps) {
  const [confirmText, setConfirmText] = useState('');

  const handleConfirm = () => {
    if (confirmText.toLowerCase() === 'eliminar') {
      onConfirm();
      setConfirmText('');
      onOpenChange(false);
    }
  };

  const handleCancel = () => {
    setConfirmText('');
    onOpenChange(false);
  };

  const isValid = confirmText.toLowerCase() === 'eliminar';

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-red-600">
            <AlertTriangle size={20} />
            Confirmar Eliminación
          </DialogTitle>
          <DialogDescription>
            Esta acción no se puede deshacer
          </DialogDescription>
        </DialogHeader>

        <div className="space-y-4 py-4">
          <div className="p-4 bg-red-50 border border-red-200 rounded-lg space-y-2">
            <p className="text-sm font-medium text-red-900">
              Estás a punto de eliminar la región:
            </p>
            <p className="text-base font-bold text-red-900">
              {regionName}
            </p>
            {departmentCount > 0 && (
              <p className="text-sm text-red-700 mt-2">
                {departmentCount} departamento{departmentCount !== 1 ? 's' : ''} asignado{departmentCount !== 1 ? 's' : ''} quedarán sin región.
              </p>
            )}
          </div>

          <div className="space-y-2">
            <Label htmlFor="confirm-delete">
              Escribe <span className="font-bold">eliminar</span> para confirmar:
            </Label>
            <Input
              id="confirm-delete"
              value={confirmText}
              onChange={(e) => setConfirmText(e.target.value)}
              placeholder="eliminar"
              className="border-red-300 focus:border-red-500 focus:ring-red-500/20"
            />
          </div>
        </div>

        <div className="flex justify-end gap-3">
          <Button variant="outline" onClick={handleCancel}>
            Cancelar
          </Button>
          <Button
            variant="destructive"
            onClick={handleConfirm}
            disabled={!isValid}
            className="bg-red-600 hover:bg-red-700"
          >
            Eliminar Región
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}

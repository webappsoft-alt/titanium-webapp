'use client';
import { Button } from '@/components/ui/button';
import { Spinner } from '../ui/spinner';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '../ui/dialog';

export function DeleteDialog({ handleDelete, onClose, name, open = false, isDelLoading = false }) {
  return (
    <Dialog open={open} onClose={onClose}>
      <DialogContent className="w-full max-w-lg transform overflow-hidden rounded-2xl bg-white p-6 text-left align-middle shadow-xl" onClose={onClose}>
        <DialogHeader className="flex items-center justify-between mb-6">
          <DialogTitle>Delete {name || ''}</DialogTitle>
        </DialogHeader>

        <DialogDescription className="text-center py-4">
          Are you sure you want to delete this {name}?
        </DialogDescription>

        <DialogFooter className="flex justify-center gap-4 mt-6">
          <Button
            disabled={isDelLoading}
            className="bg-red-600 text-white hover:bg-red-700"
            onClick={handleDelete}
          >
            {isDelLoading ? <Spinner size="sm" /> : 'Delete'}
          </Button>
          <Button disabled={isDelLoading} onClick={onClose}>
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

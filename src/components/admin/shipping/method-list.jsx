import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useShippingStore } from '@/store/shipping-store';
import { Button } from '@/components/ui/button';
import { MethodForm } from './method-form';

export function MethodList({ zoneId }) {
  const { getShippingMethods, deleteMethod } = useShippingStore();
  const methods = getShippingMethods(zoneId);
  const [selectedMethod, setSelectedMethod] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (methodId) => {
    setSelectedMethod(methodId);
    setShowForm(true);
  };

  const handleDelete = (methodId) => {
    if (confirm('Are you sure you want to delete this shipping method?')) {
      deleteMethod(zoneId, methodId);
    }
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h4 className="text-sm font-medium">Shipping Methods</h4>
        <Button size="sm" onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Method
        </Button>
      </div>

      <div className="space-y-2">
        {methods.map((method) => (
          <div
            key={method.id}
            className="flex justify-between items-center rounded border bg-gray-50 p-3"
          >
            <div>
              <p className="font-medium">{method.name}</p>
              <p className="text-sm text-gray-500">
                Base Rate: ${method.baseRate.toFixed(2)}
              </p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleEdit(method.id)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDelete(method.id)}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          </div>
        ))}
      </div>

      {showForm && (
        <MethodForm
          zoneId={zoneId}
          methodId={selectedMethod}
          onClose={() => {
            setShowForm(false);
            setSelectedMethod(null);
          }}
        />
      )}
    </div>
  );
}

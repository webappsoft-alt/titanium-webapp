import { useState } from 'react';
import { Plus, Edit, Trash2 } from 'lucide-react';
import { useShippingStore } from '@/store/shipping-store';
import { Button } from '@/components/ui/button';
import { ZoneForm } from './zone-form';
import { MethodList } from './method-list';

export function ZoneManager() {
  const { zones, deleteZone } = useShippingStore();
  const [selectedZone, setSelectedZone] = useState(null);
  const [showForm, setShowForm] = useState(false);

  const handleEdit = (zoneId) => {
    setSelectedZone(zoneId);
    setShowForm(true);
  };

  const handleDelete = (zoneId) => {
    if (confirm('Are you sure you want to delete this shipping zone?')) {
      deleteZone(zoneId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-lg font-semibold">Shipping Zones</h2>
        <Button onClick={() => setShowForm(true)}>
          <Plus className="h-4 w-4 mr-2" />
          Add Zone
        </Button>
      </div>

      <div className="grid gap-4">
        {zones.map((zone) => (
          <div
            key={zone.id}
            className="rounded-lg border bg-white p-4 shadow-sm"
          >
            <div className="flex justify-between items-start mb-4">
              <div>
                <h3 className="font-medium">{zone.name}</h3>
                <p className="text-sm text-gray-500">
                  {zone.countries.join(', ')}
                </p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleEdit(zone.id)}
                >
                  <Edit className="h-4 w-4" />
                </Button>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDelete(zone.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <MethodList zoneId={zone.id} />
          </div>
        ))}
      </div>

      {showForm && (
        <ZoneForm
          zoneId={selectedZone}
          onClose={() => {
            setShowForm(false);
            setSelectedZone(null);
          }}
        />
      )}
    </div>
  );
}
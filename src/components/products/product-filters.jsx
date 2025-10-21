import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Select, SelectOption } from '../ui/select';
import { Label } from '../ui/label';

export function ProductFilters({ products, onFilter }) {
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedType, setSelectedType] = useState('');
  const [selectedForm, setSelectedForm] = useState('');

  const categories = useMemo(() =>
    Array.from(new Set(products.map(p => p.category))),
    [products]
  );

  const types = useMemo(() =>
    Array.from(new Set(products.map(p => p.type))),
    [products]
  );

  const forms = useMemo(() =>
    Array.from(new Set(products.map(p => p.form))),
    [products]
  );

  const handleFilter = () => {
    let filtered = [...products];

    if (selectedCategory) {
      filtered = filtered.filter(p => p.category === selectedCategory);
    }
    if (selectedType) {
      filtered = filtered.filter(p => p.type === selectedType);
    }
    if (selectedForm) {
      filtered = filtered.filter(p => p.form === selectedForm);
    }

    onFilter(filtered);
  };

  const clearFilters = () => {
    setSelectedCategory('');
    setSelectedType('');
    setSelectedForm('');
    onFilter(products);
  };

  return (
    <div>
      <div className="space-y-6 rounded-lg border bg-white p-6 sticky top-2">
        <div className="space-y-4">
          <h2 className="font-semibold">Filters</h2>

          <div>
            <Label>Category</Label>
            <Select

              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <SelectOption value="">All Categories</SelectOption>
              {categories.map(category => (
                <SelectOption key={category} value={category}>{category}</SelectOption>
              ))}
            </Select>
          </div>

          <div>
            <Label>Type</Label>
            <Select

              value={selectedType}
              onChange={(e) => setSelectedType(e.target.value)}
            >
              <SelectOption value="">All Types</SelectOption>
              {types.map(type => (
                <SelectOption key={type} value={type}>{type}</SelectOption>
              ))}
            </Select>
          </div>

          <div>
            <Label>Form</Label>
            <Select

              value={selectedForm}
              onChange={(e) => setSelectedForm(e.target.value)}
            >
              <SelectOption value="">All Forms</SelectOption>
              {forms.map(form => (
                <SelectOption key={form} value={form}>{form}</SelectOption>
              ))}
            </Select>
          </div>
        </div>

        <div className="space-y-2">
          <Button
            onClick={handleFilter}
            className="w-full"
          >
            Apply Filters
          </Button>
          <Button
            variant="outline"
            onClick={clearFilters}
            className="w-full"
          >
            Clear Filters
          </Button>
        </div>
      </div>
    </div>
  );
}
import { Tag } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useRouter } from 'next/navigation';

export function DiscountedProducts() {
  const { push } = useRouter();

  return (
    <Button
      onClick={() => push('/discounted-products')}
      className="bg-[#0A1F3C] hover:bg-[#1B365D] text-white flex items-center gap-2"
    >
      <Tag className="h-4 w-4" />
      View Discounted Products
    </Button>
  );
}
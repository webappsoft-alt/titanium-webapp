import {
  Table,
  TableHeader,
  TableBody,
  TableHead,
  TableRow,
  TableCell,
} from '@/components/ui/table';

const LeadTimeTable = () => {
  const data = [
    {
      type: 'As-Is (Pick and Pack)',
      domestic: '1 day max.',
      export: '2 days max.',
    },
    {
      type: 'Bar Saws ≤ 50 pcs. Standard Alloys',
      domestic: '2 days max.',
      domesticNote: '(includes pick time)',
      export: '3 days max.',
    },
    {
      type: 'Bar Saws ≤ 50 pcs.',
      typeNote: 'Hard Alloys and All Ø > 3.00" (75 mm)',
      domestic: '3 days max.',
      domesticNote: '(includes pick time)',
      export: '4 days max.',
    },
    {
      type: 'Bar Saws > 50 pcs.',
      domestic: 'quote from planning',
      export: 'Quote from planning + 1 day',
    },
    {
      type: 'Plate Saw ≤ 50 pcs. ≤ 2.00" Thick',
      typeNote: '(incl. stripping and indexing)',
      domestic: '3 days max.',
      domesticNote: '(includes pick time)',
      export: '4 days max.',
    },
    {
      type: 'Plate Saw ≤ 50 pcs. > 2.00" Thick',
      typeNote: '(incl. stripping and indexing)',
      domestic: '4 days max.',
      domesticNote: '(includes pick time)',
      export: '4 days max.',
    },
    {
      type: 'Plate Saw > 50 pcs.',
      domestic: 'quote from planning',
      export: 'Quote from planning + 1 day',
    },
    {
      type: 'Shear Cutting',
      domestic: '2 days max.',
      domesticNote: '(includes pick time)',
      export: '3 days max.',
    },
    {
      type: 'Waterjet Cutting',
      domestic: '7 days max.',
      domesticNote: '(includes pick time)',
      export: '8 days max.',
    },
    {
      type: 'Bonded Warehouse As-Is (P&P)',
      domestic: '2 days max. (3 – 5 for SHA)',
      export: '3 days max.',
    },
  ];

  return (
    <div className="w-full max-w-4xl">
      <Table>
        <TableHeader>
          <TableRow className="border-b-0 hover:bg-transparent">
            <TableHead className="bg-[#1a2744] text-white font-semibold py-4 px-6 text-base">
              Type of Order
            </TableHead>
            <TableHead className="bg-[#1a2744] text-white font-semibold py-4 px-6 text-base">
              Domestic
            </TableHead>
            <TableHead className="bg-[#1a2744] text-white font-semibold py-4 px-6 text-base">
              <div>Export</div>
              <div className="text-xs font-normal">(incl. Packing and Paperwork)</div>
            </TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {data.map((row, index) => (
            <TableRow
              key={index}
              className={`border-b-0 hover:bg-gray-200 ${
                index % 2 === 0 ? 'bg-gray-100' : 'bg-gray-200'
              }`}
            >
              <TableCell className="py-4 px-6 text-[#1a2744]">
                <div className="font-medium">{row.type}</div>
                {row.typeNote && (
                  <div className="text-xs text-gray-600">{row.typeNote}</div>
                )}
              </TableCell>
              <TableCell className="py-4 px-6 text-[#1a2744]">
                <div>{row.domestic}</div>
                {row.domesticNote && (
                  <div className="text-xs text-gray-600">{row.domesticNote}</div>
                )}
              </TableCell>
              <TableCell className="py-4 px-6 text-[#1a2744]">
                {row.export}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default LeadTimeTable;
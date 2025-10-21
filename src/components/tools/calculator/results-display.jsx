import { motion } from 'framer-motion';
import { Scale, Box, Ruler } from 'lucide-react';

export function ResultsDisplay({ weightPerPiece, totalWeight, volume }) {
  return (
    <div className="space-y-6">
      <h3 className="text-2xl font-bold text-gray-900">Calculation Results</h3>
      
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          className="rounded-xl bg-gradient-to-br from-blue-50 to-blue-100 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-blue-500 rounded-lg">
              <Scale className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-medium text-blue-600">Weight Per Piece</p>
          </div>
          <p className="text-3xl font-bold text-blue-900">
            {weightPerPiece.toFixed(3)} <span className="text-lg">lbs</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.1 }}
          className="rounded-xl bg-gradient-to-br from-green-50 to-green-100 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-green-500 rounded-lg">
              <Box className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-medium text-green-600">Total Weight</p>
          </div>
          <p className="text-3xl font-bold text-green-900">
            {totalWeight.toFixed(3)} <span className="text-lg">lbs</span>
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: 0.2 }}
          className="rounded-xl bg-gradient-to-br from-purple-50 to-purple-100 p-6"
        >
          <div className="flex items-center gap-3 mb-3">
            <div className="p-2 bg-purple-500 rounded-lg">
              <Ruler className="h-5 w-5 text-white" />
            </div>
            <p className="text-sm font-medium text-purple-600">Volume</p>
          </div>
          <p className="text-3xl font-bold text-purple-900">
            {volume.toFixed(3)} <span className="text-lg">in³</span>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
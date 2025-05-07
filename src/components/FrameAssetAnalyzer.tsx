import React from 'react';
import { IFrame } from './types';
import { Asset, AssetType } from '../types/asset';
import { useAssets } from '../context/AssetContext';

interface FrameAssetAnalyzerProps {
  frame: IFrame;
}

interface AssetDescription {
  type: AssetType;
  name: string;
  description: string;
  status: string;
  metadata?: Record<string, any>;
}

const FrameAssetAnalyzer: React.FC<FrameAssetAnalyzerProps> = ({ frame }) => {
  const { assets } = useAssets();
  const [identifiedAssets, setIdentifiedAssets] = React.useState<AssetDescription[]>([]);

  React.useEffect(() => {
    // Analyze frame description for asset references
    const analyzeFrame = () => {
      const assetDescriptions: AssetDescription[] = [];
      
      // Check if frame has a description
      if (frame.description) {
        // Look for asset references in the description
        assets.forEach(asset => {
          if (frame.description.toLowerCase().includes(asset.name.toLowerCase())) {
            assetDescriptions.push({
              type: asset.type,
              name: asset.name,
              description: asset.description || '',
              status: asset.status,
              metadata: asset.metadata
            });
          }
        });
      }

      // Check if frame has an image
      if (frame.image) {
        // Here you could add image analysis logic to identify assets
        // This would require additional image processing capabilities
      }

      setIdentifiedAssets(assetDescriptions);
    };

    analyzeFrame();
  }, [frame, assets]);

  if (identifiedAssets.length === 0) {
    return (
      <div className="text-gray-500 text-sm italic">
        No assets identified in this frame.
      </div>
    );
  }

  return (
    <div className="mt-4">
      <h4 className="text-sm font-semibold text-gray-700 mb-2">Identified Assets:</h4>
      <div className="space-y-2">
        {identifiedAssets.map((asset, index) => (
          <div key={index} className="bg-gray-50 p-3 rounded">
            <div className="flex items-center justify-between">
              <span className="font-medium text-gray-800">{asset.name}</span>
              <span className={`text-xs px-2 py-1 rounded ${
                asset.status === 'completed' ? 'bg-green-100 text-green-800' :
                asset.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                asset.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                asset.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                'bg-gray-100 text-gray-800'
              }`}>
                {asset.status.split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
              </span>
            </div>
            <div className="text-sm text-gray-600 mt-1">
              <span className="capitalize">{asset.type}</span>
              {asset.description && (
                <p className="mt-1">{asset.description}</p>
              )}
            </div>
            {asset.metadata && Object.keys(asset.metadata).length > 0 && (
              <div className="mt-2 text-xs text-gray-500">
                <h5 className="font-medium mb-1">Details:</h5>
                <ul className="list-disc list-inside">
                  {Object.entries(asset.metadata).map(([key, value]) => (
                    <li key={key}>
                      {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
};

export default FrameAssetAnalyzer; 
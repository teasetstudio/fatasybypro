import React from 'react';
import { Asset, AssetType } from '../types/asset';
import { useAssets } from '../context/AssetContext';

interface DependencyManagerProps {
  currentAsset: Asset;
  allAssets: Asset[];
  onAddDependency: (sourceAssetId: string, targetAssetId: string, relationshipType: string) => void;
  onRemoveDependency: (sourceAssetId: string, targetAssetId: string) => void;
}

const defaultRelationships = [
  { label: 'uses', description: 'uses' },
  { label: 'used', description: 'used' },
  { label: 'owns', description: 'owns' },
  { label: 'belongs_to', description: 'belongs to' },
]

const oppositeRelationship = new Map([
  ['uses', 'used'],
  ['used', 'uses'],
  ['owns', 'belongs to'],
  ['belongs_to', 'owns'],
]);

const relationshipTypes: Record<AssetType, { label: string; description: string }[]> = {
  character: defaultRelationships,
  animation: defaultRelationships,
  model: defaultRelationships,
  vfx: defaultRelationships,
  environment: defaultRelationships,
  prop: defaultRelationships,
  other: defaultRelationships,
};

const DependencyManager: React.FC<DependencyManagerProps> = ({
  currentAsset,
  allAssets,
  onAddDependency,
  onRemoveDependency,
}) => {
  const { dependencies } = useAssets();
  const [selectedAssetId, setSelectedAssetId] = React.useState('');
  const [selectedRelationshipType, setSelectedRelationshipType] = React.useState('');

  const availableAssets = allAssets.filter(asset => 
    asset.id !== currentAsset.id
  );

  const currentDependencies = dependencies
    .filter(d => d.sourceAssetId === currentAsset.id || d.targetAssetId === currentAsset.id)
    .map(d => {
      let relationshipType = d.relationshipType;
      let asset;
      
      if (d.targetAssetId === currentAsset.id) {
        // If current asset is the target, use the opposite relationship and find the source asset
        relationshipType = oppositeRelationship.get(d.relationshipType) || d.relationshipType;
        asset = allAssets.find(a => a.id === d.sourceAssetId);
      } else {
        // If current asset is the source, find the target asset
        asset = allAssets.find(a => a.id === d.targetAssetId);
      }
      
      return asset ? { ...d, asset, relationshipType } : null;
    })
    .filter((dep): dep is typeof dependencies[0] & { asset: Asset; relationshipType: string } => dep !== null);

  const handleAddDependency = () => {
    if (selectedAssetId && selectedRelationshipType) {
      onAddDependency(currentAsset.id, selectedAssetId, selectedRelationshipType);
      setSelectedAssetId('');
      setSelectedRelationshipType('');
    }
  };

  const getRelationshipDescription = (type: string) => {
    const allTypes = Object.values(relationshipTypes).flat();
    return allTypes.find(t => t.label === type)?.description || type;
  };

  return (
    <div className="mt-8 border-t pt-6">
      <h3 className="text-lg font-semibold text-gray-800 mb-4">Dependencies</h3>
      
      {/* Add new dependency */}
      <div className="bg-gray-50 p-4 rounded-lg mb-6">
        <h4 className="text-sm font-medium text-gray-700 mb-3">Add New Dependency</h4>
        <div className="space-y-3">
          <div>
            <label htmlFor="dependencyAsset" className="block text-sm font-medium text-gray-700 mb-1">
              Select Asset
            </label>
            <select
              id="dependencyAsset"
              value={selectedAssetId}
              onChange={(e) => setSelectedAssetId(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select an asset...</option>
              {availableAssets.map((asset) => (
                <option key={asset.id} value={asset.id}>
                  {asset.name} ({asset.type})
                </option>
              ))}
            </select>
          </div>
          
          <div>
            <label htmlFor="relationshipType" className="block text-sm font-medium text-gray-700 mb-1">
              Relationship Type
            </label>
            <select
              id="relationshipType"
              value={selectedRelationshipType}
              onChange={(e) => setSelectedRelationshipType(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="">Select relationship type...</option>
              {relationshipTypes[currentAsset.type].map((rel) => (
                <option key={rel.label} value={rel.label}>
                  {rel.description}
                </option>
              ))}
            </select>
          </div>

          <button
            onClick={handleAddDependency}
            disabled={!selectedAssetId || !selectedRelationshipType}
            className="w-full px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Add Dependency
          </button>
        </div>
      </div>

      {/* Current dependencies */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 mb-3">Current Dependencies</h4>
        {currentDependencies.length === 0 ? (
          <p className="text-gray-500 text-sm">No dependencies added yet.</p>
        ) : (
          <div className="space-y-2">
            {currentDependencies.map(({ id, asset, relationshipType }) => (
              <div
                key={id}
                className="flex items-center justify-between bg-white p-3 rounded-lg border"
              >
                <div>
                  <span className="font-medium text-gray-800">{asset.name}</span>
                  <span className="text-sm text-gray-500 ml-2">({asset.type})</span>
                  <span className="text-sm text-gray-500 ml-2">
                    - {getRelationshipDescription(relationshipType)}
                  </span>
                </div>
                <button
                  onClick={() => onRemoveDependency(currentAsset.id, asset.id)}
                  className="text-red-500 hover:text-red-700"
                >
                  Remove
                </button>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DependencyManager; 
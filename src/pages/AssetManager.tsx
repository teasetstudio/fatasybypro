import { useState } from 'react';
import { Asset, AssetType, AssetStatus } from '../types/asset';
import { useAssets } from '../context/AssetContext';
import CreateAssetModal from '../components/CreateAssetModal';
import EditAssetModal from '../components/EditAssetModal';
import { Link } from 'react-router-dom';
import AppPage from '../components/layouts/AppPage';

const AssetManager = () => {
  const [selectedType, setSelectedType] = useState<AssetType | 'all'>('all');
  const [selectedAsset, setSelectedAsset] = useState<Asset | null>(null);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const {
    assets,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetsByType,
    getDependencies,
    getDependents,
    addDependency,
    removeDependency
  } = useAssets();

  const assetTypes: AssetType[] = ['character', 'model', 'animation', 'vfx', 'environment', 'prop', 'other'];

  const handleCreateAsset = () => {
    setIsCreateModalOpen(true);
  };

  const handleCreateAssetSubmit = (name: string, type: AssetType, status: AssetStatus) => {
    const newAsset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'> = {
      name,
      type,
      status,
      description: '',
      metadata: {},
    };
    addAsset(newAsset);
    setIsCreateModalOpen(false);
  };

  const handleEditAsset = (asset: Asset) => {
    setSelectedAsset(asset);
  };

  const handleEditAssetSubmit = (updatedAsset: Partial<Asset>) => {
    if (selectedAsset) {
      updateAsset(selectedAsset.id, updatedAsset);
      setSelectedAsset(null);
    }
  };

  const handleDeleteAsset = (assetId: string) => {
    deleteAsset(assetId);
  };

  const handleUpdateDependencies = (assetId: string, dependencies: string[]) => {
    updateAsset(assetId, { dependencies });
  };

  const filteredAssets = selectedType === 'all' 
    ? assets 
    : getAssetsByType(selectedType);

  return (
    <AppPage title="Assets">
      <div className="min-h-screen bg-gray-100">
        {/* Header */}
        <div className="bg-white shadow-md w-full sticky top-0 z-20">
          <div className="container mx-auto px-4 py-3 flex justify-between items-center">
            <div className="flex items-center space-x-4">
              <Link to="/menu" className="text-gray-600 hover:text-gray-800">
                <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 12l2-2m0 0l7-7 7 7M5 10v10a1 1 0 001 1h3m10-11l2 2m-2-2v10a1 1 0 01-1 1h-3m-6 0a1 1 0 001-1v-4a1 1 0 011-1h2a1 1 0 011 1v4a1 1 0 001 1m-6 0h6" />
                </svg>
              </Link>
              <h1 className="text-2xl font-bold text-gray-800">Asset Manager</h1>
            </div>
            <button
              onClick={handleCreateAsset}
              className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600 transition duration-200"
            >
              Create New Asset
            </button>
          </div>
        </div>

        {/* Main Content */}
        <div className="container mx-auto p-4 mt-8">
          <div className="flex gap-8">
            {/* Asset Type Filter */}
            <div className="w-48">
              <h2 className="text-lg font-semibold text-gray-700 mb-4">Asset Types</h2>
              <div className="space-y-1">
                <button
                  onClick={() => setSelectedType('all')}
                  className={`w-full text-left px-4 py-2 rounded ${
                    selectedType === 'all'
                      ? 'bg-blue-100 text-blue-700'
                      : 'hover:bg-gray-100'
                  }`}
                >
                  All
                </button>
                {assetTypes.map((type) => (
                  <button
                    key={type}
                    onClick={() => setSelectedType(type)}
                    className={`w-full text-left px-4 py-2 rounded ${
                      selectedType === type
                        ? 'bg-blue-100 text-blue-700'
                        : 'hover:bg-gray-100'
                    }`}
                  >
                    {type.charAt(0).toUpperCase() + type.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Asset List */}
            <div className="flex-1">
              <div className="bg-white rounded-lg shadow-lg p-4">
                <h2 className="text-lg font-semibold text-gray-800 mb-4">
                  {selectedType === 'all' ? 'All Assets' : selectedType.charAt(0).toUpperCase() + selectedType.slice(1)}s
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {filteredAssets.map((asset) => (
                    <div
                      key={asset.id}
                      className="border rounded-lg p-4 hover:shadow-md transition duration-200"
                    >
                      {asset.thumbnail && (
                        <img
                          src={asset.thumbnail}
                          alt={asset.name}
                          className="w-full h-32 object-cover rounded mb-2"
                        />
                      )}
                      <h3 className="font-semibold text-gray-800">{asset.name}</h3>
                      {asset.description && (
                        <p className="text-gray-600 text-sm mt-1">{asset.description}</p>
                      )}
                      <div className="mt-2">
                        <span className={`inline-block px-2 py-1 text-xs rounded ${
                          !asset.status || asset.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                          asset.status === 'completed' ? 'bg-green-100 text-green-800' :
                          asset.status === 'approved' ? 'bg-blue-100 text-blue-800' :
                          asset.status === 'review' ? 'bg-yellow-100 text-yellow-800' :
                          asset.status === 'in_progress' ? 'bg-purple-100 text-purple-800' :
                          'bg-gray-100 text-gray-800'
                        }`}>
                          {(asset.status || 'draft').split('_').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ')}
                        </span>
                      </div>
                      <div className="mt-4 flex space-x-2">
                        <button
                          onClick={() => handleEditAsset(asset)}
                          className="px-3 py-1 bg-blue-500 text-white text-sm rounded hover:bg-blue-600"
                        >
                          Edit
                        </button>
                        <button
                          onClick={() => handleDeleteAsset(asset.id)}
                          className="px-3 py-1 bg-red-500 text-white text-sm rounded hover:bg-red-600"
                        >
                          Delete
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Create Asset Modal */}
        <CreateAssetModal
          isOpen={isCreateModalOpen}
          onClose={() => setIsCreateModalOpen(false)}
          onSubmit={handleCreateAssetSubmit}
          assetTypes={assetTypes}
          defaultAssetType={selectedType === 'all' ? 'character' : selectedType}
        />

        {/* Edit Asset Modal */}
        <EditAssetModal
          isOpen={!!selectedAsset}
          onClose={() => setSelectedAsset(null)}
          onSubmit={handleEditAssetSubmit}
          asset={selectedAsset}
        />
      </div>
    </AppPage>
  );
};

export default AssetManager; 
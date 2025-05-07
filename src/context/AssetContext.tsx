import React, { createContext, useContext, useState, useCallback } from 'react';
import { Asset, AssetType } from '../types/asset';

interface Dependency {
  id: string;
  sourceAssetId: string;
  targetAssetId: string;
  relationshipType: string;
  createdAt: Date;
  updatedAt: Date;
}

interface AssetContextType {
  assets: Asset[];
  dependencies: Dependency[];
  addAsset: (asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => void;
  updateAsset: (id: string, asset: Partial<Asset>) => void;
  deleteAsset: (id: string) => void;
  getAssetById: (id: string) => Asset | undefined;
  getAssetsByType: (type: AssetType) => Asset[];
  getDependencies: (assetId: string) => Asset[];
  getDependents: (assetId: string) => Asset[];
  addDependency: (sourceAssetId: string, targetAssetId: string, relationshipType: string) => void;
  removeDependency: (sourceAssetId: string, targetAssetId: string) => void;
}

const AssetContext = createContext<AssetContextType | undefined>(undefined);
const defaultAssets: Asset[] = [
  {
    id: 'character-1',
    name: 'Main Character',
    type: 'character',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
  {
    id: 'sword-1',
    name: 'Sword',
    type: 'model',
    status: 'draft',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];

const defaultDependencies: Dependency[] = [
  {
    id: 'dep-1',
    sourceAssetId: 'character-1',
    relationshipType: 'owns',
    targetAssetId: 'sword-1',
    createdAt: new Date(),
    updatedAt: new Date(),
  },
];


export const AssetProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [assets, setAssets] = useState<Asset[]>(defaultAssets);
  const [dependencies, setDependencies] = useState<Dependency[]>(defaultDependencies);

  const addAsset = useCallback((asset: Omit<Asset, 'id' | 'createdAt' | 'updatedAt'>) => {
    const newAsset: Asset = {
      ...asset,
      id: `asset-${Date.now()}`,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setAssets((prev) => [...prev, newAsset]);
  }, []);

  const updateAsset = useCallback((id: string, asset: Partial<Asset>) => {
    setAssets((prev) =>
      prev.map((a) =>
        a.id === id
          ? { ...a, ...asset, updatedAt: new Date() }
          : a
      )
    );
  }, []);

  const deleteAsset = useCallback((id: string) => {
    setAssets((prev) => prev.filter((a) => a.id !== id));
    // Also remove any dependencies involving this asset
    setDependencies((prev) => 
      prev.filter((d) => d.sourceAssetId !== id && d.targetAssetId !== id)
    );
  }, []);

  const getAssetById = useCallback(
    (id: string) => assets.find((a) => a.id === id),
    [assets]
  );

  const getAssetsByType = useCallback(
    (type: AssetType) => assets.filter((a) => a.type === type),
    [assets]
  );

  const getDependencies = useCallback(
    (assetId: string) => {
      const assetDependencies = dependencies.filter((d) => d.sourceAssetId === assetId);
      return assetDependencies.map((d) => {
        const asset = getAssetById(d.targetAssetId);
        return asset;
      }).filter((asset): asset is Asset => asset !== undefined);
    },
    [dependencies, getAssetById]
  );

  const getDependents = useCallback(
    (assetId: string) => {
      const assetDependents = dependencies.filter((d) => d.targetAssetId === assetId);
      return assetDependents.map((d) => {
        const asset = getAssetById(d.sourceAssetId);
        return asset;
      }).filter((asset): asset is Asset => asset !== undefined);
    },
    [dependencies, getAssetById]
  );

  const addDependency = useCallback((sourceAssetId: string, targetAssetId: string, relationshipType: string) => {
    const newDependency: Dependency = {
      id: `dep-${Date.now()}`,
      sourceAssetId,
      targetAssetId,
      relationshipType,
      createdAt: new Date(),
      updatedAt: new Date(),
    };
    setDependencies((prev) => [...prev, newDependency]);
  }, []);

  const removeDependency = useCallback((sourceAssetId: string, targetAssetId: string) => {
    setDependencies((prev) =>
      prev.filter(
        (d) => !(d.sourceAssetId === sourceAssetId && d.targetAssetId === targetAssetId)
      )
    );
  }, []);

  const value = {
    assets,
    dependencies,
    addAsset,
    updateAsset,
    deleteAsset,
    getAssetById,
    getAssetsByType,
    getDependencies,
    getDependents,
    addDependency,
    removeDependency,
  };

  return <AssetContext.Provider value={value}>{children}</AssetContext.Provider>;
};

export const useAssets = () => {
  const context = useContext(AssetContext);
  if (context === undefined) {
    throw new Error('useAssets must be used within an AssetProvider');
  }
  return context;
}; 
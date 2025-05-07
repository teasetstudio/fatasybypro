export type AssetType = 'character' | 'model' | 'animation' | 'vfx' | 'environment' | 'prop' | 'other';
export type AssetStatus = 'draft' | 'in_progress' | 'review' | 'approved' | 'completed';

export interface Asset {
  id: string;
  name: string;
  type: AssetType;
  status: AssetStatus;
  description?: string;
  thumbnail?: string;
  createdAt: Date;
  updatedAt: Date;
  dependencies?: string[]; // IDs of assets this asset depends on
  dependents?: string[]; // IDs of assets that depend on this asset
  metadata?: Record<string, any>; // Additional type-specific metadata
}

export interface CharacterAsset extends Asset {
  type: 'character';
  metadata: {
    height?: number;
    weight?: number;
    species?: string;
    abilities?: string[];
  };
}

export interface AnimationAsset extends Asset {
  type: 'animation';
  metadata: {
    duration: number;
    fps: number;
    characterId?: string; // ID of the character this animation belongs to
    keyframes?: any[];
  };
}

export interface VFXAsset extends Asset {
  type: 'vfx';
  metadata: {
    effectType: string;
    duration: number;
    environmentId?: string; // ID of the environment this effect belongs to
    parameters?: Record<string, any>;
  };
}

export interface EnvironmentAsset extends Asset {
  type: 'environment';
  metadata: {
    size: {
      width: number;
      height: number;
      depth: number;
    };
    lighting?: Record<string, any>;
    weather?: string[];
  };
}

export interface PropAsset extends Asset {
  type: 'prop';
  metadata: {
    dimensions: {
      width: number;
      height: number;
      depth: number;
    };
    interactable: boolean;
    environmentId?: string; // ID of the environment this prop belongs to
  };
} 
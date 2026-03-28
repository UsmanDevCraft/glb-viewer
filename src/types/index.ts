export interface DropdownProps {
  options: string[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  className?: string;
}

export interface FileUploaderProps {
  onFileSelect: (file: File | null) => void;
}

export interface SimpleGLBViewerProps {
  url: string;
}

export interface EquipperState {
  gender: "male" | "female";
  customAssets: {
    hair: string | null;
    shirt: string | null;
    pants: string | null;
    shoes: string | null;
  };
}

export interface MinimalAvatarProps {
  gender?: "male" | "female"; // required to pick defaults
  glbAssets?: {
    body?: string;
    head?: string;
    hair?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
    bodyColorTexture?: string;
    eyeColorTexture?: string;
  };
  // Optional overrides / preview values (like your apparelPreview)
  preview?: {
    hair?: string;
    shirt?: string;
    pants?: string;
    shoes?: string;
    bodyColorTexture?: string;
    eyeColorTexture?: string;
    body?: string;
  };
  showControls?: boolean;
  backgroundColor?: string;
}

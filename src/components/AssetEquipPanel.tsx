"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { setCustomAsset } from "@/src/store/slices/equipperSlice";
import { Upload, X, Box, Shirt, Scissors, Footprints } from "lucide-react";

const ASSET_TYPES = [
  { id: "hair", label: "Hair", icon: Scissors },
  { id: "shirt", label: "Top", icon: Shirt },
  { id: "pants", label: "Bottom", icon: Box },
  { id: "shoes", label: "Footwear", icon: Footprints },
] as const;

const AssetEquipPanel = () => {
  const dispatch = useDispatch();
  const customAssets = useSelector(
    (state: RootState) => state.equipper.customAssets,
  );

  const handleFileChange = (
    type: keyof typeof customAssets,
    file: File | null,
  ) => {
    if (file) {
      if (!file.name.toLowerCase().endsWith(".glb")) {
        alert("Please upload a .glb file");
        return;
      }
      const url = URL.createObjectURL(file);
      dispatch(setCustomAsset({ type, url }));
    } else {
      dispatch(setCustomAsset({ type, url: null }));
    }
  };

  return (
    <div className="flex flex-col gap-4 w-72 p-6 bg-white/5 backdrop-blur-2xl border-r border-white/10 h-full overflow-y-auto">
      <div className="mb-4">
        <h2 className="text-lg font-bold text-white tracking-tight">
          Assets Library
        </h2>
        <p className="text-xs text-white/40 uppercase tracking-widest font-bold">
          Equip custom GLBs
        </p>
      </div>

      {ASSET_TYPES.map((asset) => {
        const Icon = asset.icon;
        const isEquipped = customAssets[asset.id];

        return (
          <div
            key={asset.id}
            className="group relative p-4 bg-white/5 border border-white/10 rounded-2xl hover:border-blue-500/50 transition-all overflow-hidden"
          >
            {isEquipped && (
              <div className="absolute top-0 right-0 p-2">
                <button
                  onClick={() => handleFileChange(asset.id, null)}
                  className="p-1 bg-red-500/20 text-red-500 rounded-lg hover:bg-red-500/40 transition-all"
                >
                  <X className="w-3 h-3" />
                </button>
              </div>
            )}

            <div className="flex items-center gap-3 mb-3">
              <div
                className={`p-2 rounded-xl ${isEquipped ? "bg-blue-500/20 text-blue-400" : "bg-white/5 text-white/30"}`}
              >
                <Icon className="w-5 h-5" />
              </div>
              <span className="font-bold text-white text-sm">
                {asset.label}
              </span>
            </div>

            <label className="cursor-pointer">
              <input
                type="file"
                accept=".glb"
                className="hidden"
                onChange={(e) =>
                  handleFileChange(asset.id, e.target.files?.[0] || null)
                }
              />
              <div
                className={`
                flex items-center justify-center gap-2 py-2 px-4 rounded-xl border border-dashed transition-all
                ${
                  isEquipped
                    ? "border-blue-500/50 bg-blue-500/5 text-blue-400"
                    : "border-white/10 hover:border-white/30 text-white/40 hover:text-white"
                }
              `}
              >
                <Upload className="w-4 h-4" />
                <span className="text-xs font-bold uppercase tracking-wider">
                  {isEquipped ? "Replace GLB" : "Upload GLB"}
                </span>
              </div>
            </label>

            {isEquipped && (
              <div className="mt-2 flex items-center gap-1">
                <div className="w-1.5 h-1.5 bg-green-500 rounded-full animate-pulse" />
                <span className="text-[10px] text-green-500 font-bold uppercase tracking-tighter">
                  Equipped
                </span>
              </div>
            )}
          </div>
        );
      })}

      <div className="mt-auto pt-8">
        <div className="p-4 bg-blue-500/10 border border-blue-500/20 rounded-2xl">
          <p className="text-[10px] text-blue-400 font-bold uppercase tracking-widest leading-relaxed">
            Tip: Drop your GLB files here to test how they fit on the body
            avatar.
          </p>
        </div>
      </div>
    </div>
  );
};

export default AssetEquipPanel;

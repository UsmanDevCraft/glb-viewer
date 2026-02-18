import { createSlice, PayloadAction } from "@reduxjs/toolkit";

interface EquipperState {
  gender: "male" | "female";
  customAssets: {
    hair: string | null;
    shirt: string | null;
    pants: string | null;
    shoes: string | null;
  };
}

const initialState: EquipperState = {
  gender: "male",
  customAssets: {
    hair: null,
    shirt: null,
    pants: null,
    shoes: null,
  },
};

const equipperSlice = createSlice({
  name: "equipper",
  initialState,
  reducers: {
    setGender: (state, action: PayloadAction<"male" | "female">) => {
      state.gender = action.payload;
      // Reset custom assets when gender changes to avoid mismatched meshes
      state.customAssets = initialState.customAssets;
    },
    setCustomAsset: (
      state,
      action: PayloadAction<{
        type: keyof EquipperState["customAssets"];
        url: string | null;
      }>,
    ) => {
      state.customAssets[action.payload.type] = action.payload.url;
    },
    resetEquipper: () => {
      return initialState;
    },
  },
});

export const { setGender, setCustomAsset, resetEquipper } =
  equipperSlice.actions;
export default equipperSlice.reducer;

"use client";

import { useDispatch, useSelector } from "react-redux";
import { RootState } from "@/src/store/store";
import { setGender } from "@/src/store/slices/equipperSlice";
import { User, UserRound } from "lucide-react";

const GenderDropdown = () => {
  const dispatch = useDispatch();
  const gender = useSelector((state: RootState) => state.equipper.gender);

  return (
    <div className="flex items-center gap-2 p-1 bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl">
      <button
        onClick={() => dispatch(setGender("male"))}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
          gender === "male"
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
            : "text-white/50 hover:text-white hover:bg-white/5"
        }`}
      >
        <User className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-wider">Male</span>
      </button>
      <button
        onClick={() => dispatch(setGender("female"))}
        className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all ${
          gender === "female"
            ? "bg-blue-500 text-white shadow-lg shadow-blue-500/30"
            : "text-white/50 hover:text-white hover:bg-white/5"
        }`}
      >
        <UserRound className="w-4 h-4" />
        <span className="text-sm font-bold uppercase tracking-wider">
          Female
        </span>
      </button>
    </div>
  );
};

export default GenderDropdown;

export const DEFAULT_HEADS_MALE = {
  head: "/Heads/MainHead_Mesh.glb",
};

export const DEFAULT_HEADS_FEMALE = {
  head1: "/Heads/MainHead_Female_v02.glb",
  head2: "/Heads/MainHead_Female.glb",
};

export const DEFAULT_BODY_MALE = {
  body1: "/Body-Variants/Male/Male_Body_v01.glb",
  body2: "/Body-Variants/Male/Male_Body_v02.glb",
  body3: "/Body-Variants/Male/Male_Body_v03.glb",
  body4: "/Body-Variants/Male/Male_Body_v04.glb",
};

export const DEFAULT_BODY_FEMALE = {
  body1: "/Body-Variants/Female/Female_Body_v01.glb",
  body2: "/Body-Variants/Female/Female_Body_v02.glb",
  body3: "/Body-Variants/Female/Female_Body_v03.glb",
  body4: "/Body-Variants/Female/Female_Body_v04.glb",
  body5: "/Body-Variants/Female/Female_Body_v05.glb",
  body6: "/Body-Variants/Female/Female_Body_v06.glb",
};

export const OUTFITS_MALE = {
  outfit1: "/Outfits/male_outfit_glbs/outfit-doctor-01-v2-m.glb",
  outfit2: "/Outfits/male_outfit_glbs/outfit-farmer-01-m.glb",
  outfit3: "/Outfits/male_outfit_glbs/outfit-firefighter-01-m.glb",
  outfit4: "/Outfits/male_outfit_glbs/outfit-journalist-01-m.glb",
  outfit5: "/Outfits/male_outfit_glbs/outfit-mechanic-02-m.glb",
  outfit6: "/Outfits/male_outfit_glbs/outfit-nurse-m-02.glb",
  outfit7: "/Outfits/male_outfit_glbs/outfit-pilot-01-m.glb",
  outfit8: "/Outfits/male_outfit_glbs/outfit-police-01-m.glb",
  outfit9: "/Outfits/male_outfit_glbs/outfit-retailsalesperson-01-m.glb",
  outfit10: "/Outfits/male_outfit_glbs/outfit-software-engineer-01-m.glb",
};

export const OUTFITS_FEMALE = {
  outfit1: "/Outfits/female_outfit_glbs/outfit-doctor-01-v2-f.glb",
  outfit2: "/Outfits/female_outfit_glbs/outfit-farmer-02-f.glb",
  outfit3: "/Outfits/female_outfit_glbs/outfit-firefighter-02-f.glb",
  outfit4: "/Outfits/female_outfit_glbs/outfit-journalist-02-f.glb",
  outfit5: "/Outfits/female_outfit_glbs/outfit-mechanic-01-f.glb",
  outfit6: "/Outfits/female_outfit_glbs/outfit-nurse-f-01.glb",
  outfit7: "/Outfits/female_outfit_glbs/outfit-pilot-01-f.glb",
  outfit8: "/Outfits/female_outfit_glbs/outfit-police-02-f.glb",
  outfit9: "/Outfits/female_outfit_glbs/outfit-retailsalesperson-02-f.glb",
  outfit10: "/Outfits/female_outfit_glbs/outfit-software-engineer-f.glb",
};

export const DEFAULT_ASSETS = (gender: "male" | "female") => ({
  body:
    gender === "male"
      ? "/Body-Variants/Male/Male_Body_v04.glb"
      : "/Body-Variants/Female/Female_Body_v06.glb",
  head:
    gender === "male"
      ? "/Heads/MainHead_Mesh.glb"
      : "/Heads/MainHead_Female_v02.glb",
  hair: gender === "male" ? "/Hair/Hair.glb" : "/Hair/female_hair_76.glb",
  shirt: gender === "male" ? "/Top/Shirt.glb" : "/Top/top-tshirt-01-f.glb",
  pants:
    gender === "male" ? "/Bottom/Pants.glb" : "/Bottom/pants-casual-01-f.glb",
  shoes:
    gender === "male"
      ? "/Footwear/Shoes.glb"
      : "/Footwear/tennis-casual-01-grey-f.glb",
  bodyColorTexture: "/Skin-Color/7.png",
  eyeColorTexture:
    "https://simmingai.s3.us-east-1.amazonaws.com/simmingAssets/17633719094171700634379-1622793664-eye-04-mask-1699880622457-1700634386564.png",
  animation:
    gender === "male"
      ? "/Animations/M_Standing_Idle_001.glb"
      : "/Animations/F_Standing_Idle_001.glb",
});

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

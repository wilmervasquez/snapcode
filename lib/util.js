export const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ];

export function img(src) {
  const _ = new Image();
  _.src = src;
  return _;
}

export const fontFeatureSettings = {
  CascadiaCode: "'calt','ss01','ss03','ss19','ss20'",
  FiraCode: "'zero','cv14','onum','cv31','cv27'",
  MonoLisa: "'ss02','ss03','ss05','ss07','ss08','ss10','ss11','ss13','ss14','ss17','zero'",
}
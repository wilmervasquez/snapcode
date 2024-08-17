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

export const images = {
  iconCube: img("icon/cube.svg"),
  iconFolder: img("icon/folder.svg"),
  iconPlay: img("icon/play.svg"),
  iconAlert: img('icon/alert.svg'),
  background: img(localStorage.getItem('background') ?? './img/background.png'),
  iconNetwork: img(`icon/${ localStorage.getItem('iconNetwork') ?? 'instagram'}.svg`)
}

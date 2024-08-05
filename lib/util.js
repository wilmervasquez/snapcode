export const months = [ "January", "February", "March", "April", "May", "June", "July", "August", "September", "October", "November", "December", ];

export function img(src) {
  const _ = new Image();
  _.src = src;
  return _;
}
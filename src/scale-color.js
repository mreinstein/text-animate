export default function scaleRGBColor (color, amount) {
  return 'rgb(' + Math.round(color[0] * amount) + ',' + Math.round(color[1] * amount) + ',' + Math.round(color[2] * amount) + ')'
}

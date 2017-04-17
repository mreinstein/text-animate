'use strict'

module.exports = function scaleAlpha(color, amount) {
  return 'rgba(' + color.join(',') + ',' + amount + ')'
}

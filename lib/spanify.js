'use strict'

module.exports = function spanify(el) {
  const content = el.innerText
  let newContent = ''

  for(let i=0; i < content.length; i++) {
    newContent += ('<span>' + content[i] + '</span>')
  }
  el.innerHTML = newContent
}

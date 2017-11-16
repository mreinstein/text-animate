'use strict'

// split the contents of a span by newlines, putting each
// line into a new span. ignores empty spans
function spanifyByNewlines(el) {
  const lines = el.innerHTML.split('\n')
  let newContent = ''

  for(let i=0; i < lines.length; i++) {
    // don't include spans that have a new line
    if (lines[i].trim().length === 0) {
      continue
    }
    newContent += ('<span>' + lines[i] + '</span><br>')
  }
  el.innerHTML = newContent
}

// given an inline element, split by newlines and render each line at once
module.exports = function animateTextLines(el, opts={}) {
  const options = JSON.parse(JSON.stringify(opts))
  let spans = []
  let accum = 0
  let total = 0
  let index = 0  // index of currently etched line


  function etch(i) {
    if (i >= spans.length)
      return

    if (spans[i].innerText === ' ')
      return spans[i].style.backgroundColor = ''

    spans[i].style.color = options.etchFGColor
    spans[i].style.backgroundColor = options.etchBGColor
  }


  function done(i) {
    if (i >= spans.length)
      return

    spans[i].style.color = options.targetFGColor
    spans[i].style.backgroundColor = options.targetBGColor

    if(options.targetFontWeight)
      spans[i].style.fontWeight = options.targetFontWeight

    if(options.targetFontStyle)
      spans[i].style.fontStyle = options.targetFontStyle
  }


  const setText = function(text) {
    _setup(text)
    total = accum = 0
    index = 0
  }


  // @param int dt time elapsed in milliseconds
  const step = function(dt) {

    if (index >= spans.length)
      return

    total += dt
    if (total < options.delay)
      return

    accum += dt


    while(accum >= options.etchSpeed) {
      done(index)
      index++

      if (index >= spans.length)
        return

      etch(index)
      accum -= options.etchSpeed
    }
  }


  const _setup = function(text) {
    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')

    el.innerHTML = text.trim()
    spanifyByNewlines(el)
    spans = el.querySelectorAll('span')

    for (let i=0; i < spans.length; i++)
      spans[i].style.color = pageBgColor
  }


  _setup(el.innerText)

  return { setText, step }
}

'use strict'

const seedrandom = require('seedrandom')
const spanify    = require('./spanify')


// TODO: investigate varying the etchSpeed slightly each frame
module.exports = function animate1(el, opts={}) {
  const options = JSON.parse(JSON.stringify(opts))

  let spans
  let index = 0  // index of currently etched character
  let accum = 0  // ms in the accumulator
  let delay = (options.delay ? options.delay : 0)

  const rng = seedrandom(options.randSeed)
  
  let etchWidth = (rng() > 0.5) ? 1 : 2

  function etch(i) {
    if (i >= spans.length) return

    if (spans[i].innerText === ' ') {
      spans[i].style.backgroundColor = ''
      return
    }
    spans[i].style.color = options.etchFGColor
    spans[i].style.backgroundColor = options.etchBGColor
  }

  function done(i) {
    if (i >= spans.length) return
    spans[i].style.color = 'initial'
    spans[i].style.backgroundColor = options.targetBGColor
  }

  let setText = function(text) {
    _setup(text)
    accum = delay
  }

  let _setup = function(text) {
    el.innerHTML = text.trim()
    spanify(el)

    index = 0
    spans = el.querySelectorAll('span')

    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')
    for (let i=0; i < spans.length; i++) {
      spans[i].style.color = pageBgColor
    }
  }


  let step = function(dt) {
    accum += dt

    if (accum < delay) return

    let actual = accum - delay

    while(actual >= options.etchSpeed) {
      done(index)
      if (etchWidth > 1)
        done(index + 1)
      index += etchWidth

      if (index >= spans.length) {
        return
      }

      etchWidth = (rng() > 0.5) ? 1 : 2
      etch(index)  // set current index to etching
      if (etchWidth > 1) etch(index+1)

      actual -= options.etchSpeed
      accum -= options.etchSpeed
    }
  }

  // TODO: fire an event when completed
  // TODO: reset animation method

  _setup(el.innerText)

  return { setText, step }
}

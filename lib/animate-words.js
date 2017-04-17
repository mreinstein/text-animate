'use strict'

const scaleAlpha = require('./scale-alpha')
const seedrandom = require('seedrandom')
const spanify    = require('./spanify')


module.exports = function animateWords(el, opts={}) {
  const options = JSON.parse(JSON.stringify(opts))

  const spans = []
  let accum = 0  // ms in the accumulator

  let appendText = function(text) {
    const words = text.trim().split(' ')

    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')

    for (let i=0; i < words.length; i++) {
      let span = document.createElement('span')
      span.innerText = words[i] + ' '
      spans.push(span)
      el.appendChild(span)
    }
  }

  let step = function(dt) {
    accum += dt

    const amount = 1 - (accum / options.duration)
    for(let i=0; i < spans.length; i++) {
      spans[i].style.backgroundColor = scaleAlpha(options.color, amount)
    }
  }

  let _setup = function() {
    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')

    accum = 0
    el.innerHTML = ''
  }

  _setup()

  return { appendText, step }
}

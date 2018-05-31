'use strict'

const charming   = require('charming')
const clamp      = require('clamp')
const scaleAlpha = require('./scale-alpha')
const seedrandom = require('seedrandom')
const sineOut    = require('eases').sineOut


function randomFloat(rng, min, max) {
  return parseFloat( min + rng() * (max - min) )
}

function sineTrough (amount) {
  return 1 - Math.sin(Math.PI * amount)
}


module.exports = function animateLabel(el, opts={}) {
  const options = JSON.parse(JSON.stringify(opts))
  let spans, characterEffects
  let effect2Duration = 90
  let accum = 0  // ms in the accumulator

  const rng = seedrandom(options.randSeed)

  // initial label glitch
  const effect1Duration = 130
  const effect1FrameDuration = 30
  const effect1Frames = [ 1, 0.37, 0.08, 0.98, 0.23 ]


  // @param int dt time elapsed in milliseconds
  const step = function(dt) {
    let finished = (accum >= options.delay + effect1Duration + effect2Duration)

    accum += dt

    if (accum < options.delay)
      return

    // effect 1 (button glitch effect)
    let actual = accum - options.delay
    if (actual <= effect1Duration) {
      const currentFrame = Math.floor(actual / effect1FrameDuration)
      const amount = effect1Frames[currentFrame]
      const color = scaleAlpha(options.color, amount)
      for (let i=0; i < spans.length; i++) {
        spans[i].style.backgroundColor = color
        spans[i].style.color = ''
      }
      return
    }

    actual -= effect1Duration
    if (actual <= effect2Duration) {
      for (let i=0; i < spans.length; i++) {
        let amount = clamp(actual / characterEffects[i].duration, 0, 1)
        if(characterEffects[i].easing === 1)
          amount = sineOut(amount)
        else
          amount = sineTrough(amount)

        amount = clamp(amount, characterEffects[i].min, 1)
        spans[i].style.backgroundColor = scaleAlpha(options.color, amount)
      }
    }

    if (!finished && actual >= effect2Duration) {
      let amount = 1
      const color = scaleAlpha(options.color, amount)
      for (let i=0; i < spans.length; i++) {
        spans[i].style.backgroundColor = color
        spans[i].style.color = ''
      }
    }
  }


  const setText = function(text, color) {
    _setup(text)

    if (color)
      options.color = color

    accum = options.delay
  }


  const _setup = function(text) {
    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')

    // add 1 space on each side of the label
    el.innerHTML = '&nbsp;' + text.trim() + '&nbsp;'

    charming(el)

    spans = el.querySelectorAll('span')
    for (let i=0; i < spans.length; i++) {
      spans[i].style.backgroundColor = pageBgColor
      spans[i].style.color = pageBgColor
    }

    characterEffects = []
    for (let i=0; i < spans.length; i++) {
      const effect = {
        min: randomFloat(rng, 0.2, 0.6),
        easing: rng() > 0.5 ? 0 : 1,  // trough vs sineOut
        duration: Math.round(effect2Duration * randomFloat(rng, 0.8, 1.2))
      }
      characterEffects.push(effect)
      effect2Duration = Math.max(effect.duration, effect2Duration)
      if (effect2Duration > 600)
        effect2Duration = 600
    }
  }


  _setup(el.innerText)

  return { setText, step }
}

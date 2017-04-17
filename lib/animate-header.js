'use strict'

const scale = require('./scale-alpha')


module.exports = function animateHeader(el, opts={}) {
  const options = JSON.parse(JSON.stringify(opts))
  el.innerHTML = '<span>' + el.innerText + '</span>'
  const span =  el.querySelector('span')
  span.style.color = 'rgb(' + options.color.join(',') + ')' 
  span.style.backgroundColor = ''
  span.style.fontSize = 'inherit'

  let accum = 0  // milliseconds in the accumulator

  function step(dt) {
    let finished = (accum + options.delay >= options.duration)
    accum += dt

    if (accum < options.delay){
      return
    }

    let actual = accum - options.delay

    if (actual <= options.duration) {
      const amount = 1 - (actual / options.duration)
      span.style.backgroundColor = scale(options.color, amount)
    }

    if (!finished && actual >= options.duration) {
      span.style.backgroundColor = ''
    }
  }

  return { step }
}

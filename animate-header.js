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
  let finished = false

  function step(dt) {
    accum += dt
    if (finished || accum < options.delay){
      return
    }

    const actual = accum - options.delay
    finished = actual >= options.duration

    if(finished) {
      span.style.backgroundColor = ''
    } else {
      const amount = 1 - (actual / options.duration)
      span.style.backgroundColor = scale(options.color, amount)
    }
  }

  return { step }
}

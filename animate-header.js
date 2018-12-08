import scaleAlpha from './scale-alpha.js'


export default function animateHeader (el, opts={}) {
  const options = JSON.parse(JSON.stringify(opts))
  el.innerHTML = '<span>' + el.innerText + '</span>'
  const span =  el.querySelector('span')
  span.style.color = 'rgb(' + options.color.join(',') + ')'
  span.style.backgroundColor = ''
  span.style.fontSize = 'inherit'

  let accum = 0  // milliseconds in the accumulator
  let finished = false


  // @param int dt time elapsed in milliseconds
  const step = function (dt) {
    accum += dt
    if (finished || accum < options.delay)
      return

    const actual = accum - options.delay
    finished = actual >= options.duration

    span.style.backgroundColor = finished ? '' : scaleAlpha(options.color, 1 - actual/options.duration)
  }


  return { step }
}

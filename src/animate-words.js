import scaleAlpha from './scale-alpha.js'


export default function animateWords (el, opts={}) {
  const options = JSON.parse(JSON.stringify(opts))

  const spans = []
  let accum = 0  // ms in the accumulator


  const appendText = function (text) {
    const words = text.trim().split(' ')
    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')

    for (let i=0; i < words.length; i++) {
      let span = document.createElement('span')
      span.innerText = words[i] + ' '
      spans.push(span)
      el.appendChild(span)
    }
  }


  // @param int dt time elapsed in milliseconds
  const step = function (dt) {
    accum += dt

    const amount = 1 - (accum / options.duration)
    for (let i=0; i < spans.length; i++)
      spans[i].style.backgroundColor = scaleAlpha(options.color, amount)
  }


  const _setup = function () {
    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')
    accum = 0
    el.innerHTML = ''
  }


  _setup()

  return { appendText, step }
}

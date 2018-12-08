import charming   from 'charming'
import seedrandom from 'seedrandom'


// TODO: investigate varying the etchSpeed slightly each frame
export default function animate1 (el, opts={}) {
  const options = JSON.parse(JSON.stringify(opts))

  let spans
  let index = 0  // index of currently etched character
  let accum = 0  // ms in the accumulator
  const delay = (options.delay ? options.delay : 0)

  const rng = seedrandom(options.randSeed)

  let etchWidth = (rng() > 0.5) ? 1 : 2

  const _etch = function (i) {
    if (i >= spans.length)
      return

    if (spans[i].innerText === ' ') {
      spans[i].style.backgroundColor = ''
      return
    }
    spans[i].style.color = options.etchFGColor
    spans[i].style.backgroundColor = options.etchBGColor
  }


  const _done = function (i) {
    if (i >= spans.length)
      return

    spans[i].style.color = '' //'initial'
    spans[i].style.backgroundColor = options.targetBGColor
  }


  const setText = function (text) {
    _setup(text)
    accum = delay
  }


  const _setup = function (text) {
    charming(el)
    index = 0
    spans = el.querySelectorAll('span')

    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')
    for (let i=0; i < spans.length; i++)
      spans[i].style.color = pageBgColor
  }


  // @param int dt time elapsed in milliseconds
  const step = function (dt) {
    accum += dt

    if (accum < delay)
      return

    let actual = accum - delay

    while (actual >= options.etchSpeed) {
      _done(index)
      if (etchWidth > 1)
        _done(index + 1)
      index += etchWidth

      if (index >= spans.length)
        return

      etchWidth = (rng() > 0.5) ? 1 : 2
      _etch(index)  // set current index to etching
      if (etchWidth > 1)
        _etch(index+1)

      actual -= options.etchSpeed
      accum -= options.etchSpeed
    }
  }

  _setup(el.innerText)

  return { setText, step }
}

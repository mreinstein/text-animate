'use strict'

const clamp      = require('clamp')
const scaleAlpha = require('./scale-alpha')


function splitByTimings(text, timings) {
  const words = []

  let lastStart = 0

  timings.forEach(function(timing, idx) {
    // ignore the first entry
    if (idx === 0)
      return

    words.push(text.substring(lastStart, timing.start))
    lastStart = timing.start
  })

  words.push(text.substring(lastStart))
  return words
}

// given a mapping of text and it's times, draw the output
// @param options.timings
//   e.g., The described word ("Hello") begins 243 milliseconds after the audio stream begins, and starts at byte 0 and ends at byte 6 of the input text.
//   [ { "time":243, "type":"word", "start":0, "end":5, "value":"Hello" },
//     { "time":519, "type":"word", "start":6, "end":15, "value":"miker1728" } ]
module.exports = function animateTextTimedWords(el, options={}) {
  const { audio, text, color, timings } = options

  const src = audio.src

  let allDone = false

  // convert ms to seconds
  const endTime = (timings[timings.length-1].time + 400) / 1000

  const spans = []


  // @param int dt time elapsed in milliseconds
  const step = function(dt) {

    if(allDone)
      return

    // if the audio src changed, the audio is no longer playing. assume the animation is done
    // this can happen in scenarios where the audio element is shared among multiple animated
    // elements.
    if(src != audio.src)
      _markAllVisible()

    // audio duration, currentTime are expressed in seconds
    const currentTime = Math.round(audio.currentTime * 1000) // convert seconds to ms

    for(let i=0; i < spans.length; i++) {
      const startTime = timings[i].time

      if(currentTime < startTime)
        return

      const duration = (i < timings.length-1) ? (timings[i+1].time - timings[i].time) : 400
      const endTime = startTime + duration

      let progress = (currentTime - startTime) / (endTime - startTime)
      progress = clamp(progress, 0, 1)

      spans[i].style.color = ''
      spans[i].style.backgroundColor = scaleAlpha(options.color, 1 - progress)

      if (i === spans.length-1 && progress > 0.99)
        _markAllVisible()
    }
  }

  const _markAllVisible = function() {
    allDone = true
    for(let i=0; i < spans.length; i++) {
      spans[i].style.color = ''
      spans[i].style.backgroundColor = ''
    }
  }


  const _setup = function(text) {
    el.innerHTML = ''

    const words = splitByTimings(text, timings)

    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')

    for (let i=0; i < words.length; i++) {
      if(words[i].trim().length === 0)
        continue

      const span = document.createElement('span')
      span.innerText = words[i]
      span.style.color = pageBgColor
      spans.push(span)
      el.appendChild(span)
    }
  }

  _setup(text)

  return { step }
}

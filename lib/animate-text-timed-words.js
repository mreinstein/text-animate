'use strict'

const clamp      = require('clamp')
const scaleAlpha = require('./scale-alpha')


// given a mapping of text and it's times, draw the output
// @param options.timings
//   e.g., The described word ("Hello") begins 243 milliseconds after the audio stream begins, and starts at byte 0 and ends at byte 6 of the input text.
//   [ { "time":243, "type":"word", "start":0, "end":5, "value":"Hello" },
//     { "time":519, "type":"word", "start":6, "end":15, "value":"miker1728" } ]
module.exports = function animateTextTimedWords(el, options={}) {
  const { audio, text, color, timings } = options

  let allDone = false

  // convert ms to seconds
  const endTime = (timings[timings.length-1].time + 400) / 1000

  const spans = []

  let step = function(dt) {
    if(allDone) return

    allDone = audio.currentTime > endTime

    // audio.duration is expressed in seconds
    const currentTime = Math.round(audio.currentTime * 1000) // convert seconds to ms

    for(let i=0; i < spans.length; i++) {
      const startTime = timings[i].time
      if (i >= timings.length) {
        spans[i].style.color = ''
        spans[i].style.backgroundColor = '' //scaleAlpha(options.color, 0)
        continue
      }

      if(currentTime < startTime) {
        return
      }

      const duration = (i < timings.length-1) ? (timings[i+1].time - timings[i].time) : 400
      const endTime = startTime + duration

      let progress = (currentTime - startTime) / (endTime - startTime)
      progress = clamp(progress, 0, 1)

      spans[i].style.color = ''
      spans[i].style.backgroundColor = scaleAlpha(options.color, 1 - progress)
    }
  }

  let _setup = function(text) {
    el.innerHTML = ''
    const words = text.trim().split(' ')

    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')

    for (let i=0; i < words.length; i++) {
      let span = document.createElement('span')
      span.innerText = words[i] + ' '
      span.style.color = pageBgColor
      spans.push(span)
      el.appendChild(span)
    }
  }

  _setup(text)

  return { step }
}

'use strict'

const spanify = require('./spanify')


// get the index into the timings array where the current time lies
//
// @param Array timings
// @param Int currentTime the current time we want index of in milliseconds
// @param Int duration length of the audio in milliseconds
// @return Int index of timings array where the current time lies. -1 if outside range
function getTimingIndex(timings, currentTime, duration) {
  if (currentTime >= duration) {
    return -1
  }

  for(let i=0; i < timings.length; i++) {
    if(currentTime < timings[i].time) {
      return i-1
    }
  }
  return timings.length-1
}


// given a mapping of text and it's times, draw the output
// @param options.timings
//   e.g., The described word ("Hello") begins 243 milliseconds after the audio stream begins, and starts at byte 0 and ends at byte 6 of the input text.
//   [ { "time":243, "type":"word", "start":0, "end":5, "value":"Hello" },
//     { "time":519, "type":"word", "start":6, "end":15, "value":"miker1728" } ]
module.exports = function animateTextTimedWords(el, options={}) {
  const { audio, text, color, timings, duration } = options
  let spans, lastDone = 0, index = 0  // index of currently etched character

  let allDone = false

  let step = function(dt) {
    if(allDone) return
    // audio.duration is expressed in seconds

    const audioTime = Math.round(audio.currentTime * 1000) // convert seconds to ms

    const etchSpeed = 180 // 50 ms / character

    const newDone = getTimingIndex(timings, audioTime - etchSpeed, duration)

    if(newDone === timings.length-1) {
      allDone = true
    }
    if(newDone < 0) {
      return
    }

    for(let i=lastDone; i <= newDone; i++) {
      let t = timings[i]
      for(let j=t.start; j <= t.end; j++) {
        _done(j)
      }
    }

    const etchIndex = getTimingIndex(timings, audioTime, duration)

    if(etchIndex < 0) {
      return
    }

    for(let i=newDone+1; i <= etchIndex; i++) {
      let t = timings[i]
      for(let j=t.start; j <= t.end; j++) {
        _etch(j)
      }
    }

    lastDone = newDone
  }

  function _done(i) {
    if (i >= spans.length) return
    spans[i].style.color = 'initial'
    spans[i].style.backgroundColor = options.targetBGColor
    if(options.textColor) spans[i].style.color = options.textColor
    if(options.textFontWeight) spans[i].style.fontWeight = options.textFontWeight
    if(options.textFontStyle) spans[i].style.fontStyle = options.textFontStyle
    if(options.textFontSize) spans[i].style.fontSize = options.textFontSize
    if(options.className) spans[i].className = options.className
  }

  function _etch(i) {
    if (i >= spans.length) return

    if (spans[i].innerText === ' ') {
      spans[i].style.backgroundColor = ''
      return
    }
    spans[i].style.color = options.etchFGColor
    spans[i].style.backgroundColor = options.etchBGColor
  }

  let _setup = function(text) {
    el.innerHTML = text
    spanify(el)

    spans = el.querySelectorAll('span')
    const pageBgColor = window.getComputedStyle(document.body, null).getPropertyValue('background-color')
    for (let i=0; i < spans.length; i++) {
      spans[i].style.color = pageBgColor
    }
  }

  _setup(text)

  return { step }
}

'use strict'

const animateHeader = require('../animate-header')
const animateText   = require('../animate-text')
const controller    = require('../controller')


const anim = controller()
const randSeed = Math.random()

const seed = Math.random() // enables consistent randomness for this session

const p5 = {
  color: [ 0, 0, 0 ],  // [ r, g, b ]
  duration: 300,
  delay: 200,      // milliseconds to wait before animation starts
  seed
}

const headers = document.querySelectorAll('h1,h2')

for(let i=0; i < headers.length; i++) {
  p5.delay = 120 + Math.floor(50 * Math.random())
  p5.duration = 250 + Math.floor(100 * Math.random())
  anim.add(animateHeader(headers[i], p5))
}

const p3 = {
  etchSpeed: 10 + Math.round(Math.random() * 4), // milliseconds/character
  targetBGColor: 'rgb(255,255,255)',
  targetFGColor: 'rgb(40, 40, 40)',
  etchBGColor:   'rgb(62, 62, 62)',
  etchFGColor:   'rgb(255,20,147)',
  seed
}

const lis = document.querySelectorAll('li,p')
for(let i=0; i < lis.length; i++) {
  anim.add(animateText(lis[i], p3))
}

anim.start()

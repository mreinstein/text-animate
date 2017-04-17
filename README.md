# text-animate

beautiful, animated, HTML typographic UI effects


```javascript
'use strict'

const animateHeader = require('text-animate').header
const controller    = require('text-animate').controller

const anim = controller()
const randSeed = Math.random()

const p5 = {
  color: [ 0, 0, 0 ],  // [ r, g, b ]
  duration: 300,
  delay: 0      // milliseconds to wait before animation starts
}
const h = animateHeader(document.querySelector('span'), p5)
anim.add(h)

anim.start()
```
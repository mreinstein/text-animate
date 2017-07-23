# text-animate

beautiful, animated, HTML typographic UI effects

![alt text](example.gif "example of usage from my personal website https://reinstein.me")


## simple example

```javascript
'use strict'

const animateHeader = require('text-animate/animate-header')
const controller    = require('text-animate/controller')

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

More advanced usage examples available in `example/` and on my personal site: https://reinstein.me

'use strict'

const raf = require('raf')


module.exports = function animationController() {
  const items = []

  let lastTime = Date.now()


  const add = function(item) {
    items.push(item)
  }


  const remove = function(item) {
    for(let i=0; i < items.length; i++) {
      if (items[i] === item)
        return items.splice(i, 1)
    }
  }


  const start = function() {
    raf(_step)
  }


  const _step = function() {
    const now = Date.now()
    const dt = now - lastTime
    lastTime = now
    for (let i=0; i < items.length; i++)
      items[i].step(dt)

    raf(_step)
  }


  return { add, remove, start }
}

export default function animationController () {
  const items = []

  let lastTime = Date.now()


  const add = function (item) {
    items.push(item)
  }


  const remove = function (item) {
    for(let i=0; i < items.length; i++)
      if (items[i] === item)
        return items.splice(i, 1)
  }


  const start = function () {
    requestAnimationFrame(_step)
  }


  const _step = function () {
    const now = Date.now()
    const dt = now - lastTime
    lastTime = now
    for (let i=0; i < items.length; i++)
      items[i].step(dt)

    requestAnimationFrame(_step)
  }


  return { add, remove, start }
}

const { mouse, straightTo, Point } = require('@nut-tree/nut-js')

async function main() {
  //   const pos = await mouse.getPosition()
  //   console.log({ pos })
  await mouse.move(straightTo(new Point(132, 114)))
  await mouse.leftClick()
}

main()

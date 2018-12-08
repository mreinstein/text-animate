import commonjs from 'rollup-plugin-commonjs'
import resolve  from 'rollup-plugin-node-resolve'


export default {
  external: [ 'charming', 'clamp', 'eases', 'raf', 'seedrandom' ],
  plugins: [
    resolve(),
    commonjs()
  ]
}

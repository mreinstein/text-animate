import commonjs from 'rollup-plugin-commonjs'
import resolve  from 'rollup-plugin-node-resolve'


export default {
  external: [ 'alea', 'charming', 'clamp', 'eases' ],
  plugins: [
    resolve(),
    commonjs()
  ]
}

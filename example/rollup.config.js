import commonjs from 'rollup-plugin-commonjs'
import resolve  from 'rollup-plugin-node-resolve'
import { terser } from 'rollup-plugin-terser'


export default {
  plugins: [
    resolve(),
    commonjs(),
    terser()
  ]
}

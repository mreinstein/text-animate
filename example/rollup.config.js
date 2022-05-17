import commonjs from 'rollup-plugin-commonjs'
import resolve  from 'rollup-plugin-node-resolve'


export default {
  plugins: [
    resolve(),
    commonjs()
  ]
}

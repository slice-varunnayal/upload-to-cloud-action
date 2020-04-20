import vm from 'vm'
import * as core from '@actions/core'

/**
 * Executes the function in vm.
 *
 * @param {string} fnString - A function that returns some value.
 * @param {vm.Context} sandbox - Sandbox'ed object.
 * @returns {any} - Value returns by fnString.
 */
export default function runInVM(fnString: string, sandbox?: vm.Context): any {

  sandbox = Object.assign(sandbox || {}, {
    core,
    console,
    env: process.env
  })
  const scriptString = `(${fnString})()`

  const context = vm.createContext(sandbox)
  const script = new vm.Script(scriptString)
  return script.runInContext(context)
}
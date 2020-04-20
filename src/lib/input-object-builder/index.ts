import * as core from '@actions/core'
import set from "lodash.set"
import * as utils from './utils'
import { ActionInputParam, BuildParamObject, } from "./types"

/**
 * For the given action input param list, it returns the param object built from input.
 *
 * @param {ActionInputParam[]} actionInputs - Action input params, somewhat mimicing the input types present in "action.yaml".
 * @param {string} inputValueGeneratorFnName - We allow user to provide a function to generate the values at runtime. This string consist of the prefixed signature of function.
 *
 * @returns {BuildParamObject} - Object representation of input.
 */
export default function inputObjectBuilder(
  actionInputs: ActionInputParam[],
  inputValueGeneratorFnName: string
): BuildParamObject {
  const buildParamObject = {}
  core.startGroup('Input object builder')

  // Prepare input value builder function
  const build = utils.getInputValueBuilder({ inputValueGeneratorFnName })

  for (const actionInput of actionInputs) {
    const { id, attach, required = false, default: defaultValue } = actionInput

    // Build value
    core.info(`Building: id=${id}`)
    const value = build(id, core.getInput(id), defaultValue, required)
    core.info(`Built: id=${id}, value=${value}, len=${value?.length ?? 0}`)

    // Attach in output param object
    set(buildParamObject, attach, value)
  }
  core.endGroup()
  return buildParamObject
}
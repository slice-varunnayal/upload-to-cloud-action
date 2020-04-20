import valueBuilderEvaluator from './eval_value_builder'
import { IntputValueBuilderFn } from './types'
import * as core from '@actions/core'

export function getInputValueBuilder(
  { inputValueGeneratorFnName }: { inputValueGeneratorFnName: string }
): IntputValueBuilderFn {
  return function buildInputValue(id: string, value: string, defaultValue?: string, required?: boolean) {
    if (inputValueGeneratorFnName && _isValueFunctionBuilder(value, inputValueGeneratorFnName) === true) {
      core.info(`  Building value for id=${id} using fn builder`)
      value = valueBuilderEvaluator(value)
      core.info(`    value=${value}`)
    }

    const returnValue = value || defaultValue
    if (required === true && (returnValue === undefined || returnValue === '')) {
      throw new Error(`key ${id} is not passed`)
    }
    return returnValue
  }
}

function _isValueFunctionBuilder(value: string, inputValueGeneratorFnName: string): boolean {
  if (!value || typeof value !== 'string' || value.length < inputValueGeneratorFnName.length + 10) {
    return false
  }

  // So if inputValueGeneratorFnName is 'function funName('
  // then min other pars is '){return 1}' of lenth 11
  const minLength = inputValueGeneratorFnName.length + 11

  if (value.length < minLength || value.includes(inputValueGeneratorFnName) === false) {
    return false
  }
  return true
}
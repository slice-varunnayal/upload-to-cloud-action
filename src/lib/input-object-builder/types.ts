export type IntputValueBuilderFn = (id: string, value: string, defaultValue?: string, required?: boolean) => string | undefined

export type BuildParamObject = {
  [key: string]: any
}
export type ActionValueGenerator = () => string

export interface ActionInputParam {
  id: string
  required?: boolean
  default?: string
  /**
   * In the input object, where would we like the object to be attached.
   */
  attach: string
}
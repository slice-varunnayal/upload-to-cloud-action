import path from 'path'
import {
  StoreConstructParams,
  UploadFileResponse,
  StoreBuildParams,
  ShareOutputParams,
  CommonShareOutputParams
} from '../types'

export abstract class BaseStore {
  name: string
  sourceDir: string

  constructor(params: StoreConstructParams) {
    this.name = params.name
    this.sourceDir = path.join(process.cwd(), params.sourceDir)
  }

  abstract uploadFile(file: string): Promise<UploadFileResponse>

  /**
   * After uploading file/directory, this will allow store to share
   * store specific data.
   *
   * @param {StoreBuildParams} param - Parameters passed by user.
   *
   * @returns {ShareOutputParams} An object containing data to be shared as output(core.setOutput).
   */
  abstract shareOutput(param: StoreBuildParams, shareParam: CommonShareOutputParams): ShareOutputParams
}

export abstract class BaseStoreBuilder {
  abstract buildStore(params: StoreBuildParams): BaseStore
}

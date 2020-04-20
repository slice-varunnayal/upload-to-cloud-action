
import { statSync } from 'fs'
import path from 'path'
import * as core from '@actions/core'
import {FileInfo, StoreTypes, StoreBuildParams, ShareOutputParams, CommonShareOutputParams} from '../types'
import {BaseStore} from '../stores/base'
import buildStore from '../builder'
import config from '../config'
import inputObjectBuilder from './input-object-builder'

const klawSync = require('klaw-sync')

export function getPathList(params: StoreBuildParams): FileInfo[] {
  const sourceStat = statSync(params.sourceDir)
  if (sourceStat.isDirectory()) {
    return klawSync(params.sourceDir, { nodir: true })
  } else {
    const fileInfo = [{
      path: path.resolve(params.sourceDir),
      status: sourceStat
    }]
    params.sourceDir = path.dirname(params.sourceDir)
    return fileInfo
  }
}
export function prepareStoreConfig(storeName: StoreTypes): StoreBuildParams {
  const commonInputTypes = config.inputTypes
  const storeConfig = config.stores[storeName]
  if (!storeConfig) {
    throw new Error(`Invalid store name: ${storeName}`)
  }
  storeConfig.inputTypes = commonInputTypes.concat(storeConfig.inputTypes)

  const inputParamsObject = inputObjectBuilder(
    storeConfig.inputTypes,
    config.inputValueGeneratorFnName
  ) as StoreBuildParams
  inputParamsObject.parallelUploads = inputParamsObject.parallelUploads | 0
  inputParamsObject.storeName = storeName
  return inputParamsObject
}

export async function startUploading(
  pathList: FileInfo[],
  buildParams: StoreBuildParams
): Promise<void> {
  const store = buildStore(buildParams)
  const fileChunks = _chunkFiles(pathList, buildParams.parallelUploads)

  let chunkNum = 0
  for (const chunk of fileChunks) {
    core.info(`chunk #${++chunkNum}, files = ${chunk.length}`)
    await _uploadFile(store, chunk)
  }

  const commonShareParams: CommonShareOutputParams = { storeName: buildParams.storeName, uploadCount: pathList.length }
  const outputParams = store.shareOutput(buildParams, commonShareParams)
  _setOutput(outputParams)
}

function _setOutput(sharedOutput: ShareOutputParams): void {
  for(const [key, value] of Object.entries(sharedOutput)) {
    core.setOutput(key, `${value}`)
  }
}

async function _uploadFile(
  store: BaseStore,
  pathListChunk: FileInfo[]
): Promise<void> {
  const uploadPromiseList = pathListChunk.map(pathInfo =>
    store.uploadFile(pathInfo.path)
  )

  for (const uploadPromise of uploadPromiseList) {
    await uploadPromise
  }
}

function _chunkFiles(pathList: FileInfo[], chunkSize: number): FileInfo[][] {
  return new Array(Math.ceil(pathList.length / chunkSize))
    .fill(undefined)
    .map((_, chunkNum) =>
      pathList.slice(chunkNum * chunkSize, (chunkNum + 1) * chunkSize)
    )
}
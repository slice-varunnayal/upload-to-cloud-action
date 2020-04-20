import * as core from '@actions/core'
import {StoreTypes} from './types'
import * as lib from './lib'

async function run(): Promise<void> {
  try {
    const storeName = (core.getInput('store_name') || StoreTypes.s3) as StoreTypes

    // Prepare config and build params
    const buildParams = lib.prepareStoreConfig(storeName)

    // Get file path to upload. Will upload config.sourceDir if passed value is a file
    const pathList = lib.getPathList(buildParams)

    core.startGroup(
      `Total number of files to upload: ${pathList.length}, parallel upload=${buildParams.parallelUploads}`
    )
    await lib.startUploading(pathList, buildParams)
    core.endGroup()
  } catch (error) {
    core.setFailed(error.message)
  }
}

run()

import S3StoreBuilder from './stores/s3/builder'
import {StoreTypes, StoreBuildParams} from './types'
import {BaseStoreBuilder, BaseStore} from './stores/base'

function _getStoreBuilder(storeName: StoreTypes): BaseStoreBuilder | null {
  if (storeName === StoreTypes.s3) {
    return new S3StoreBuilder()
  }
  return null
}

export default function buildStore(inputParamsObject: StoreBuildParams): BaseStore {
  const storeBuilder = _getStoreBuilder(inputParamsObject.storeName)
  if (storeBuilder === null) {
    throw new Error(`Invalid store name store=${inputParamsObject.storeName}`)
  }
  return storeBuilder.buildStore(inputParamsObject)
}

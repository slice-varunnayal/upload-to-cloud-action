import S3Store from '.'
import * as core from '@actions/core'
import {S3BuildParams} from '../../types'
import {BaseStore, BaseStoreBuilder} from '../base'

export default class S3StoreBuilder extends BaseStoreBuilder {
  buildStore(params: S3BuildParams): BaseStore {
    core.startGroup(` Store Information

      bucket     :  ${params.bucket}
      path       :  ${params.path}
      region     :  ${params.region}
      ACL        :  ${params.uploadArgs.ACL}
      Key Len    :  ${params.credentials.awsAccessKey.length}
      Secret Len :  ${params.credentials.awsSecretKey.length}
    `)
    const store = new S3Store(params)
    core.endGroup()
    return store
  }
}

import {StoreTypes, Config} from './types'

const DEFAULT_PARALLEL_UPLOADS = 10

export default {
  inputValueGeneratorFnName: 'function generateInputValue(',
  inputTypes: [
    {id: 'store_name', attach: 'storeName', required: true},
    {id: 'source_dir', attach: 'sourceDir', required: true},
    {
      id: 'parallel_uploads',
      attach: 'parallelUploads',
      default: DEFAULT_PARALLEL_UPLOADS
    }
  ],
  stores: {
    [StoreTypes.s3]: {
      inputTypes: [
        {
          id: 's3_access_key_id',
          attach: 'credentials.awsAccessKey',
          default: process.env.AWS_ACCESS_KEY_ID || ''
        },
        {
          id: 's3_secret_access_key',
          attach: 'credentials.awsSecretKey',
          default: process.env.AWS_SECRET_ACCESS_KEY || ''
        },
        {
          id: 's3_region',
          attach: 'region',
          default: process.env.AWS_REGION || ''
        },
        {id: 's3_bucket_name', attach: 'bucket', required: true},
        {id: 's3_path', attach: 'path', required: true},
        {id: 's3_acl', attach: 'uploadArgs.ACL'},
        {id: 's3_cache_control', attach: 'uploadArgs.CacheControl'}
      ]
    }
  }
} as Config

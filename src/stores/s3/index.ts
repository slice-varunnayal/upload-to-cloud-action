import * as path from 'path'
import mime from 'mime'
import {readFileSync} from 'fs'
import AWS from 'aws-sdk'
import {
  S3UploadFileResponse,
  S3DefaultUploadRequestParams,
  S3BuildParams,
  ShareOutputParams,
  CommonShareOutputParams
} from '../../types'
import {BaseStore} from '../base'

export default class S3Store extends BaseStore {
  bucket: string
  path: string
  uploadArgs: S3DefaultUploadRequestParams
  private store: AWS.S3

  constructor(params: S3BuildParams) {
    super(params)
    this.store = this._buildStore(params)
    this.bucket = params.bucket
    if (Array.isArray(params.path)) {
      this.path = path.join(...params.path)
    } else {
      this.path = params.path
    }

    this.uploadArgs = params.uploadArgs
  }

  private _updateAwsConfig(params: S3BuildParams): void {
    AWS.config.update({
      accessKeyId: params.credentials.awsAccessKey,
      secretAccessKey: params.credentials.awsSecretKey,
      region: params.region,
      apiVersion: params.apiVersion || '2006-03-01'
    })
  }

  private _buildStore(params: S3BuildParams): AWS.S3 {
    this._updateAwsConfig(params)
    return new AWS.S3()
  }

  async uploadFile(file: string): Promise<S3UploadFileResponse> {
    const relativePath = path.relative(this.sourceDir, file)
    const uploadArgs = Object.assign(
      {
        Bucket: this.bucket,
        Key: path.join(this.path, relativePath),
        Body: readFileSync(file),
        ContentType: mime.getType(file) || 'text/plain'
      },
      this.uploadArgs
    ) as AWS.S3.Types.PutObjectRequest

    const uploadResponse = await this.store.upload(uploadArgs).promise()
    return {
      filename: relativePath,
      response: uploadResponse
    }
  }

  shareOutput(params: S3BuildParams, commonOutputParams: CommonShareOutputParams): ShareOutputParams {
    return Object.assign(commonOutputParams, {
      s3BaseUrl: `https://${params.bucket}.s3.${params.region}.amazonaws.com/${params.path}`
    })
  }
}

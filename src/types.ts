import fs from 'fs'
import {ActionInputParam} from './lib/input-object-builder/types'
// #region S3 Types
export interface S3UploadFileResponse {
  filename: string
  response: AWS.S3.ManagedUpload.SendData
}

export interface AWSCredentials {
  awsAccessKey: string
  awsSecretKey: string
}

export interface S3DefaultUploadRequestParams {
  [key: string]: any
}

export interface S3BuildParams extends StoreConstructParams {
  credentials: AWSCredentials
  region: string
  apiVersion?: string
  bucket: string
  path: string | string[]
  uploadArgs: S3DefaultUploadRequestParams
}

export interface S3ShareOutputParams {
  /**
   * S3 Url in format https://<bucket>.s3.region.amazonaws.com/<base-path>'.
   */
  s3BaseUrl: string
}

//#endregion S3 Types

//#region General

export enum StoreTypes {
  s3 = 's3'
}

interface ConfigStore {
  inputTypes: ActionInputParam[]
}
export interface Config {
  inputValueGeneratorFnName: string
  inputTypes: ActionInputParam[]
  stores: {
    [key: string]: ConfigStore
  }
}
export interface StoreConstructParams {
  name: string
  sourceDir: string
}
export type UploadFileResponse = S3UploadFileResponse

export type StoreBuildParams = {
  storeName: StoreTypes
  parallelUploads: number
} & S3BuildParams

export interface CommonShareOutputParams {
  uploadCount: number
}

export type ShareOutputParams = CommonShareOutputParams & S3ShareOutputParams

export interface FileInfo {
  path: string
  status: fs.Stats | fs.BigIntStats
}
//#endregion General

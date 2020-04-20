# GitHub Action for Uploading directory to Cloud Storage

This repository contains the GitHub Action which will allow you to upload a directory in the cloud storage of your choice.

Currently, only **s3** is supported.

## Overview

This action will allow you to upload a directory from the given source to the given cloud store.

## Inputs

|Parameter|Required|Description|Scope|
|-|-|-|-|
|`store_name`|Yes|cloud storage provider name. Currently only **s3** is supported|common|
|`source_dir`|true|source directory to sync with s3. It could be a file name as well|common|
|`s3_access_key_id`|true|aws access id. If missing AWS_ACCESS_KEY_ID is picked from EnvVar|s3|
|`s3_secret_access_key`|true|aws secret access key. If missing AWS_SECRET_ACCESS_KEY is picked from EnvVar|s3|
|`s3_region`|true|aws region. If missing AWS_REGION is picked from EnvVar|s3|
|`s3_bucket_name`|false|aws bucket name used to upload file|s3|
|`s3_path`|true|Returns the path to upload file to. Any input parameter can be included with function signature to return the value.|s3|
|`s3_acl`|false|Canned ACL to use while uploading file. See [canned-acl](https://docs.aws.amazon.com/AmazonS3/latest/dev/acl-overview.html#canned-acl)|s3|
|`s3_cache_control`|false|Sets the Cache-Control property on the uploaded file. Example value= `max-age=86400`|s3|

### Generating Input Value Dynamically

Instead of giving static input values, a JS function can be provided as input that should return the value to be used for input.

The characteristics of the input value function generator are:

- It should have a signature `function generateInputValue(`.
- It should return a value as that will be used as final value for input argument.

**Ques**: What all is available inside the input value function builder?

- `env`: `process.env` mapped to env object.
- `core`: `@actions/core` as core.
- `console`: NodeJS console.

Sample example:

```yaml
- uses: ./
  env:
    # Define EnvVar
    S3_ACL: 'public-read'
  with:
    store_name: 's3'
    source_dir: 'src/stores'
    s3_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    s3_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    s3_region: ${{ secrets.AWS_REGION }}
    s3_bucket_name: 'slicepay-testing-mock'
    s3_acl: |
      function generateInputValue() {
        // process.env is available as env
        return env.S3_ACL;
      }
    s3_path: 'path/directory'
```

## Outputs

|Parameter|Description|Scope|
|-|-|-|
|`uploadCount`|Total number of files uploaded|common|
|`s3BaseUrl`|S3 Base URL in format `https://<bucket>.s3.<region>.amazonaws.com/<path>`|s3|

## Usage

You can use it in GitHub Action like this in `./github/workflows/main.yaml`

```yaml
- uses: ./
  with:
    source_dir: 'coverage'
    s3_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    s3_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    s3_region: ${{ secrets.AWS_REGION }}
    s3_bucket_name: 'my-bucket'
    s3_path: 'upload/directory'
    s3_acl: 'public-read'
    s3_cache_control: 'max-age=3600'
```

The above command will upload source directory `coverage` in path `upload/directory`. Files uploaded are public (`public-read`).

To build custom `s3_bucket_name` and `s3_path` at runtime, use the following YAML:

```yaml
- uses: ./
  env:
    # Define EnvVar
    S3_ACL: 'public-read'
  with:
    source_dir: 'coverage'
    s3_access_key_id: ${{ secrets.AWS_ACCESS_KEY_ID }}
    s3_secret_access_key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
    s3_region: ${{ secrets.AWS_REGION }}
    s3_bucket_name: |
      function generateInputValue() {
        return 'my-bucket';
      }
    s3_path: |
      function generateInputValue() {
        const date = new Date()
        core.info(`Date: ${date}`);
        return `${date.toISOString()}/result-set`
      }
    s3_acl: |
      function generateInputValue() {
        // process.env is available as env
        return env.S3_ACL;
      }
```

## Todo

- [ ] Test cases
- [ ] Other cloud storage providers.

## Docs

- [setup.md](./docs/setup.md)
  - Ensure ou run `npm run all` and add `dist/index.js` to git as GitHub Action checks this file when being in other workflows.
- [test.md](./docs/test.md): Testing this repo.

import 'source-map-support/register'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { createLogger } from '../../utils/logger'
import * as AWS from 'aws-sdk'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import * as AWSXRay from 'aws-xray-sdk'

const logger = createLogger('auth')

const XAWS = AWSXRay.captureAWS(AWS)

const s3 = new XAWS.S3({
  signatureVersion: 'v4'
})

const bucketName = process.env.TODO_IMAGES_S3_BUCKET
const urlExpiration = process.env.SIGNED_URL_EXPIRATION

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId

    if (!todoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing todoId' })
      }
    }

    logger.info(
      `Received request for generating signed URL for todo item ${todoId}`
    )

    logger.info('Geting signed URL for todo...')

    const url = getUploadUrl(todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({
        uploadUrl: url
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

function getUploadUrl(todoId: string) {
  return s3.getSignedUrl('putObject', {
    Bucket: bucketName,
    Key: todoId,
    Expires: urlExpiration
  })
}

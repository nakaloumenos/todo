import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { deleteTodo } from '../../businessLogic/todos'
import { createLogger } from '../../utils/logger'

const logger = createLogger('auth')

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const todoId = event.pathParameters.todoId
    const userId = getUserId(event)

    if (!todoId) {
      return {
        statusCode: 400,
        body: JSON.stringify({ error: 'Missing todoId' })
      }
    }

    logger.info(
      `Received request for deleting todo item ${todoId} of user ${userId}...`
    )

    await deleteTodo(userId, todoId)

    return {
      statusCode: 200,
      body: JSON.stringify({})
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

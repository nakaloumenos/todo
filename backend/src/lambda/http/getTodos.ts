import 'source-map-support/register'
import * as middy from 'middy'
import { cors } from 'middy/middlewares'
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getUserId } from '../utils'
import { getTodos } from '../../businessLogic/todos'

export const handler = middy(
  async (event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> => {
    const userId = getUserId(event)

    const items = await getTodos(userId)

    console.log('items to be returned: ' + JSON.stringify(items))

    return {
      statusCode: 200,
      body: JSON.stringify({
        items
      })
    }
  }
)

handler.use(
  cors({
    credentials: true
  })
)

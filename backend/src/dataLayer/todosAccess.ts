import * as AWS from 'aws-sdk'
import * as AWSXRay from 'aws-xray-sdk'
import { DocumentClient } from 'aws-sdk/clients/dynamodb'
import { TodoItem } from '../models/TodoItem'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'

const XAWS = AWSXRay.captureAWS(AWS)

export class TodoAccess {
  constructor(
    private readonly docClient: DocumentClient = new XAWS.DynamoDB.DocumentClient(),
    private readonly todosTable = process.env.TODOS_TABLE,
    private readonly createdAtIndex = process.env.CREATED_AT_INDEX
  ) {}

  async createTodo(todo: TodoItem): Promise<TodoItem> {
    await this.docClient
      .put({
        TableName: this.todosTable,
        Item: todo
      })
      .promise()

    return todo
  }

  async getTodos(userId: string): Promise<TodoItem[]> {
    console.log('Getting all todos for user ' + userId)

    const result = await this.docClient
      .query({
        TableName: this.todosTable,
        IndexName: this.createdAtIndex,
        KeyConditionExpression: 'userId = :userId',
        ExpressionAttributeValues: {
          ':userId': userId
        }
      })
      .promise()

    console.log('query result: ' + JSON.stringify(result))

    const items = result.Items
    return items as TodoItem[]
  }

  async updateTodo(
    userId: string,
    todoId: string,
    updatedTodo: UpdateTodoRequest
  ) {
    await this.docClient
      .update({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        },
        UpdateExpression:
          'set #name = :name, #dueDate = :duedate, #done = :done',
        ExpressionAttributeValues: {
          ':name': updatedTodo.name,
          ':duedate': updatedTodo.dueDate,
          ':done': updatedTodo.done
        },
        ExpressionAttributeNames: {
          '#name': 'name',
          '#dueDate': 'dueDate',
          '#done': 'done'
        }
      })
      .promise()
  }

  async deleteTodo(userId: string, todoId: string) {
    await this.docClient
      .delete({
        TableName: this.todosTable,
        Key: {
          userId,
          todoId
        }
      })
      .promise()
  }
}

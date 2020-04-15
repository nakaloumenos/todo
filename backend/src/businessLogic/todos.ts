import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'

const todoAccess = new TodoAccess()

const bucketName = process.env.TODO_IMAGES_S3_BUCKET

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  const itemId = uuid.v4()

  return await todoAccess.createTodo({
    todoId: itemId,
    createdAt: new Date().toISOString(),
    ...createTodoRequest,
    done: false,
    attachmentUrl: `https://${bucketName}.s3.amazonaws.com/${itemId}`,
    userId
  })
}
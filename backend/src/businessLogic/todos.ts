import * as uuid from 'uuid'
import { TodoItem } from '../models/TodoItem'
import { TodoAccess } from '../dataLayer/todosAccess'
import { CreateTodoRequest } from '../requests/CreateTodoRequest'
import { UpdateTodoRequest } from '../requests/UpdateTodoRequest'
import { createLogger } from '../utils/logger'

const logger = createLogger('auth')

const todoAccess = new TodoAccess()

const bucketName = process.env.TODO_IMAGES_S3_BUCKET

export async function createTodo(
  createTodoRequest: CreateTodoRequest,
  userId: string
): Promise<TodoItem> {
  logger.info('Generating uuid...')

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

export async function getTodos(userId: string): Promise<TodoItem[]> {
  return await todoAccess.getTodos(userId)
}

export async function updateTodo(
  userId: string,
  todoId: string,
  updatedTodo: UpdateTodoRequest
) {
  return await todoAccess.updateTodo(userId, todoId, updatedTodo)
}

export async function deleteTodo(userId: string, todoId: string) {
  return await todoAccess.deleteTodo(userId, todoId)
}

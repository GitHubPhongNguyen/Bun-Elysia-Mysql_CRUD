import swagger from "@elysiajs/swagger";
import { PrismaClient } from "@prisma/client";
import { Elysia } from "elysia";

interface Post {
  id?: number
  title: string
  path: string
  content: string
}

const prisma = new PrismaClient({
  log: ['info', 'warn', 'error']
})

const app = new Elysia().decorate('db', prisma).use(swagger()) 

app.get('/posts', ({db}) => {
  return db.post.findMany()
})

app.get('/posts/:id', ({db, params}) => {
  return db.post.findUnique({ where: { id: Number(params.id) } })
})

app.get('/posts/path/:path', ({db, params}) => {
  return db.post.findUnique({ where: { path: String(params.path) } })
})

app.post('/post', ({db, body}) => {
  return db.post.create({
    data: body as Post
  })
})

app.put('/post/:id', ({db, params, body}) => {
  return db.post.update({
    where: { id: Number(params.id)},
    data: body as Post
  })
})

app.delete('/post/:id', ({db, params}) => {
  return db.post.delete({
    where: { id: Number(params.id)}
  })
})

app.listen(process.env.API_PORT || 3000, () => {
  console.log(`🚀 ~ app.listen on port: ${app.server?.port}`)
})
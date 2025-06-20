import { Application, Request, Response } from "express"
import { booksRoutes } from "./app/controllers/books.controller"
import { borrowBooksRoutes } from "./app/controllers/borrowbooks.controller"

const express = require('express')
const app: Application = express()
app.use(express.json())

app.use('/api/books', booksRoutes)
app.use('/api/borrow', borrowBooksRoutes)
app.get('/', (req: Request, res: Response) => {
  res.send('Wellcome to Library management system')
})

export default app;
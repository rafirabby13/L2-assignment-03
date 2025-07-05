import { Application, Request, Response } from "express";
import { booksRoutes } from "./app/controllers/books.controller";
import { borrowBooksRoutes } from "./app/controllers/borrowbooks.controller";
var cors = require('cors')
const express = require("express");
const app: Application = express();
app.use(express.json());
app.use(cors({
    origin: ['https://library-management-client-indol.vercel.app']
   }))
app.use("/api/books", booksRoutes);
app.use("/api/borrow", borrowBooksRoutes);
app.get("/", (req: Request, res: Response) => {
  res.send("Wellcome to Library management system");
});
app.use((req, res, next) => {
  res.status(404).json({
    success: false,
    message: "404 Not Found",
  });
});

export default app;

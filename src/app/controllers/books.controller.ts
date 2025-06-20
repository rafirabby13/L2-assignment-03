import express, { Request, Response } from "express";
import { Books } from "../models/books.model";

export const booksRoutes = express.Router();

booksRoutes.get("/", async (req: Request, res: Response) => {
  const query: any = req.query;

  const filter = query.filter ? { genre: query.filter } : {};
  const limit = query.limit ? query.limit : Infinity;
  const sort = query.sort === "asc" ? 1 : -1;
  const sortBy: any = query.sortBy ? { createdAt: sort } : {};
  

  const data = await Books.find(filter).limit(limit).sort(sortBy);

  res.status(201).send({
    success: true,
    message: "Books retrieved successfully",
    data,
  });
});
booksRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  const data = await Books.create(body);

  console.log(body);
  res.status(201).send({
    success: true,
    message: "Book created successfully",
    data: data,
  });
});

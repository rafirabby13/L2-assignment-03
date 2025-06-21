import express, { Request, Response } from "express";
import { Books } from "../models/books.model";
import { z } from "zod";
import mongoose from "mongoose";

export const booksRoutes = express.Router();

const createBookZodschema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.string(),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number().positive(),
  available: z.boolean(),
});

booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = await createBookZodschema.parseAsync(req.body);
    const data = await Books.create(body);

    // console.log(body);
    res.status(201).send({
      success: true,
      message: "Book created successfully",
      data: data,
    });
  } catch (error: any) {
    // console.log({
    //   message: error.message,
    //   success: false,
    //   error,
    // })
    res.status(400).send({
      message: error.message,
      success: false,
      error,
    });
  }
});
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

booksRoutes.get("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  // console.log(bookId)
  if (!mongoose.Types.ObjectId.isValid(bookId)) {
    res.status(400).json({
      message: "Invalid book ID format",
      success: false,
    });
    return;
  }
  const data = await Books.findById(bookId);
  if (!data) {
    res.status(404).json({
      success: false,
      message: "Book not found",
    });
    return;
  }

  res.status(200).send({
    success: true,
    message: "Books retrieved successfully",
    data,
  });
});

booksRoutes.put("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;
  const updatedData = req.body;

  // console.log(bookId)
  const data = await Books.findByIdAndUpdate(bookId, updatedData, {
    new: true,
  });

  res.status(201).send({
    success: true,
    message: "Book updated successfully",
    data,
  });
});
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  // console.log(bookId)
  const data = await Books.findByIdAndDelete(bookId, { new: true });

  res.status(201).send({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});

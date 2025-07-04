import express, { Request, Response } from "express";
import { Books } from "../models/books.model";
import { z } from "zod";
import mongoose from "mongoose";
import { Borrowbook } from "../models/borrowbooks.model";

export const booksRoutes = express.Router();

const createBookZodschema = z.object({
  title: z.string(),
  author: z.string(),
  genre: z.enum([
    "FICTION",
    "NON_FICTION",
    "SCIENCE",
    "HISTORY",
    "BIOGRAPHY",
    "FANTASY",
  ]),
  isbn: z.string(),
  description: z.string().optional(),
  copies: z.number().positive(),
  available: z.boolean().optional(),
});

booksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    const body = await createBookZodschema.parseAsync(req.body);
    const data = await Books.create(body);

    console.log(body);
    res.status(201).send({
      success: true,
      message: "Book created successfully",
      data: data,
    });
  } catch (error: any) {
   
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
  const sortBy: any = query.sortBy ? { [query.sortBy]: sort } : {};

  try {
    const data = await Books.find(filter).limit(limit).sort(sortBy);

    res.status(200).send({
      success: true,
      message: "Books retrieved successfully",
      data,
    });
  } catch (error) {
    res.status(400).send({
      message: "Failed to retrieve books",
      success: false,
      error,
    });
  }
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

  // console.log(bookId, updatedData)
  try {
    let data;
     data = await Books.findByIdAndUpdate(bookId, updatedData, {
      new: true,
    });
    // console.log("data", data)
    if (data && data.copies > 0) {
     data = await Books.findByIdAndUpdate(
        bookId,
        { available: true },
        {
          new: true,
        }
      );
    }
    if (data && data.copies === 0) {
       await Borrowbook.updateAvailableStatus(bookId,data.available);
    }

    res.status(200).send({
      success: true,
      message: "Book updated successfully",
      data,
    });
  } catch (error: any) {
    res.status(200).send({
      success: false,
      message: error.message,
      error,
    });
  }
});
booksRoutes.delete("/:bookId", async (req: Request, res: Response) => {
  const bookId = req.params.bookId;

  // console.log(bookId)
  const data = await Books.findByIdAndDelete(bookId, { new: true });
  const deletedBooksFromBorrowTable = Borrowbook.deleteMany({bookId}) 

  res.status(200).send({
    success: true,
    message: "Book deleted successfully",
    data: null,
  });
});

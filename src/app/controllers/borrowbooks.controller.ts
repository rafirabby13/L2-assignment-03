import express, { Request, Response } from "express";
import { Borrowbook } from "../models/borrowbooks.model";

export const borrowBooksRoutes = express.Router();

borrowBooksRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  console.log(body);

  const data = await Borrowbook.create(body);

  res.status(201).send({
    success: true,
    message: "Book borrowed successfully",
    data,
  });
});

borrowBooksRoutes.get("/", async (req: Request, res: Response) => {
 
  const data = await Borrowbook.aggregate([
    {
      $lookup: {
        from: "books",
        localField: "book",
        foreignField: "_id",
        as: "book",
      },
    },
    {
      $unwind: "$book",
    },
    {
      $group: {
        _id: "$book._id",

        book: {
          $first: {
            title: "$book.title",
            isbn: "$book.isbn",
          },
        },

        totalQuantity: { $sum: "$quantity" },
      },
    },
    {
      $project: {
        _id: 0,
        book:1,
        totalQuantity:1
        // "book._id": 1
      },
    },
   
  ]);
  
  res.status(201).send({
    success: true,
    message: "Borrowed books summary retrieved successfully",
    data,
  });
});

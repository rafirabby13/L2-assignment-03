import express, { Request, Response } from "express";
import { Borrowbook } from "../models/borrowbooks.model";
import { Books } from "../models/books.model";

export const borrowBooksRoutes = express.Router();

borrowBooksRoutes.post("/", async (req: Request, res: Response) => {
  const body = req.body;
  // console.log(body);

  const bookToBorrow: any = await Books.findById(body.book);
  const availableCopiesOfbooks: number = Number(bookToBorrow?.copies);
  if (bookToBorrow?.available) {

    const quantityOfBorrow: number = Number(body.quantity);
    console.log(availableCopiesOfbooks, quantityOfBorrow);

    if (availableCopiesOfbooks) {
      if (availableCopiesOfbooks < quantityOfBorrow) {
        res.send(`you cant borrow ...${availableCopiesOfbooks} available`);
        return;
      }
    }

    const remainingCopiesOfBooks = availableCopiesOfbooks - quantityOfBorrow;
    await Books.findByIdAndUpdate(body.book, {
      copies: remainingCopiesOfBooks,
    });
    if (remainingCopiesOfBooks === 0) {
      await Books.findByIdAndUpdate(body.book, { available: false });
      return;
    }

    const data = await Borrowbook.create(body);

    res.status(201).send({
      success: true,
      message: "Book borrowed successfully",
      data,
    });
  }
  else{
     res.send(`you cant borrow ...${availableCopiesOfbooks} available`);
  }
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
        book: 1,
        totalQuantity: 1,
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

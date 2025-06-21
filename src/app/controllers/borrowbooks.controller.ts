import express, { Request, Response } from "express";
import { Borrowbook } from "../models/borrowbooks.model";
import { Books } from "../models/books.model";
import { z } from "zod";

export const borrowBooksRoutes = express.Router();
const createBorrowBookZodschema = z.object({
  book: z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
    message: "Invalid ObjectId format",
  }),
  quantity: z.number().positive(),
  dueDate: z.string().datetime(),
});

borrowBooksRoutes.post("/", async (req: Request, res: Response) => {
  try {
    // const body = req.body;
    const body = await createBorrowBookZodschema.parseAsync(req.body);
    // console.log(body);

    const bookToBorrow: any = await Books.findById(body.book);
    const availableCopiesOfbooks: number = Number(bookToBorrow?.copies);
    if (bookToBorrow?.available) {
      const quantityOfBorrow: number = Number(body.quantity);
      console.log(availableCopiesOfbooks, quantityOfBorrow);

      if (availableCopiesOfbooks) {
        if (availableCopiesOfbooks < quantityOfBorrow) {
          res.status(400).send({
            message: `you can't borrow--> ${availableCopiesOfbooks} boooks available`,
            success: false,
            error: {
              availableCopies: availableCopiesOfbooks,
              requestedQuantity: quantityOfBorrow,
            },
          });
          return;
        }
      }

      const remainingCopiesOfBooks = availableCopiesOfbooks - quantityOfBorrow;
      await Books.findByIdAndUpdate(body.book, {
        copies: remainingCopiesOfBooks,
      });
      if (remainingCopiesOfBooks === 0) {
        // await Books.findByIdAndUpdate(body.book, { available: false });
        await Borrowbook.updateAvailableStatus(
          body.book,
          bookToBorrow.available
        );
      }

      const data = await Borrowbook.create(body);

      res.status(201).send({
        success: true,
        message: "Book borrowed successfully",
        data,
      });
    } else {
      // res.send(`you cant borrow ...${availableCopiesOfbooks} available`);
      res.status(400).send({
        message: `you can't borrow--> ${availableCopiesOfbooks} books available`,
        success: false,
      });
    }
  } catch (error: any) {
    res.status(400).send({
      message: error.message,
      success: false,
      error,
    });
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

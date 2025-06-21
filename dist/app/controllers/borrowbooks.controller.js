"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.borrowBooksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const borrowbooks_model_1 = require("../models/borrowbooks.model");
const books_model_1 = require("../models/books.model");
const zod_1 = require("zod");
exports.borrowBooksRoutes = express_1.default.Router();
const createBorrowBookZodschema = zod_1.z.object({
    book: zod_1.z.string().refine((val) => /^[0-9a-fA-F]{24}$/.test(val), {
        message: "Invalid ObjectId format",
    }),
    quantity: zod_1.z.number().positive(),
    dueDate: zod_1.z.string().datetime(),
});
exports.borrowBooksRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        // const body = req.body;
        const body = yield createBorrowBookZodschema.parseAsync(req.body);
        // console.log(body);
        const bookToBorrow = yield books_model_1.Books.findById(body.book);
        const availableCopiesOfbooks = Number(bookToBorrow === null || bookToBorrow === void 0 ? void 0 : bookToBorrow.copies);
        if (bookToBorrow === null || bookToBorrow === void 0 ? void 0 : bookToBorrow.available) {
            const quantityOfBorrow = Number(body.quantity);
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
            yield books_model_1.Books.findByIdAndUpdate(body.book, {
                copies: remainingCopiesOfBooks,
            });
            if (remainingCopiesOfBooks === 0) {
                // await Books.findByIdAndUpdate(body.book, { available: false });
                yield borrowbooks_model_1.Borrowbook.updateAvailableStatus(body.book, bookToBorrow.available);
            }
            const data = yield borrowbooks_model_1.Borrowbook.create(body);
            res.status(201).send({
                success: true,
                message: "Book borrowed successfully",
                data,
            });
        }
        else {
            // res.send(`you cant borrow ...${availableCopiesOfbooks} available`);
            res.status(400).send({
                message: `you can't borrow--> ${availableCopiesOfbooks} books available`,
                success: false,
            });
        }
    }
    catch (error) {
        res.status(400).send({
            message: error.message,
            success: false,
            error,
        });
    }
}));
exports.borrowBooksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const data = yield borrowbooks_model_1.Borrowbook.aggregate([
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
}));

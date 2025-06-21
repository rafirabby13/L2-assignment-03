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
exports.booksRoutes = void 0;
const express_1 = __importDefault(require("express"));
const books_model_1 = require("../models/books.model");
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
exports.booksRoutes = express_1.default.Router();
const createBookZodschema = zod_1.z.object({
    title: zod_1.z.string(),
    author: zod_1.z.string(),
    genre: zod_1.z.string(),
    isbn: zod_1.z.string(),
    description: zod_1.z.string().optional(),
    copies: zod_1.z.number().positive(),
    available: zod_1.z.boolean(),
});
exports.booksRoutes.post("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const body = yield createBookZodschema.parseAsync(req.body);
        const data = yield books_model_1.Books.create(body);
        // console.log(body);
        res.status(201).send({
            success: true,
            message: "Book created successfully",
            data: data,
        });
    }
    catch (error) {
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
}));
exports.booksRoutes.get("/", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    const filter = query.filter ? { genre: query.filter } : {};
    const limit = query.limit ? query.limit : Infinity;
    const sort = query.sort === "asc" ? 1 : -1;
    const sortBy = query.sortBy ? { createdAt: sort } : {};
    const data = yield books_model_1.Books.find(filter).limit(limit).sort(sortBy);
    res.status(201).send({
        success: true,
        message: "Books retrieved successfully",
        data,
    });
}));
exports.booksRoutes.get("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    // console.log(bookId)
    if (!mongoose_1.default.Types.ObjectId.isValid(bookId)) {
        res.status(400).json({
            message: "Invalid book ID format",
            success: false,
        });
        return;
    }
    const data = yield books_model_1.Books.findById(bookId);
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
}));
exports.booksRoutes.put("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    const updatedData = req.body;
    // console.log(bookId)
    const data = yield books_model_1.Books.findByIdAndUpdate(bookId, updatedData, {
        new: true,
    });
    res.status(201).send({
        success: true,
        message: "Book updated successfully",
        data,
    });
}));
exports.booksRoutes.delete("/:bookId", (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const bookId = req.params.bookId;
    // console.log(bookId)
    const data = yield books_model_1.Books.findByIdAndDelete(bookId, { new: true });
    res.status(201).send({
        success: true,
        message: "Book deleted successfully",
        data: null,
    });
}));

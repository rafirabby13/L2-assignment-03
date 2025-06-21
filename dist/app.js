"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const books_controller_1 = require("./app/controllers/books.controller");
const borrowbooks_controller_1 = require("./app/controllers/borrowbooks.controller");
const express = require("express");
const app = express();
app.use(express.json());
app.use("/api/books", books_controller_1.booksRoutes);
app.use("/api/borrow", borrowbooks_controller_1.borrowBooksRoutes);
app.get("/", (req, res) => {
    res.send("Wellcome to Library management system");
});
app.use((req, res, next) => {
    res.status(404).json({
        success: false,
        message: "404 Not Found",
    });
});
exports.default = app;

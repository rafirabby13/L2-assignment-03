"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.Books = void 0;
const mongoose_1 = require("mongoose");
const mongoose_2 = require("mongoose");
const BookSchema = new mongoose_2.Schema({
    title: { type: String, required: true, trim: true },
    author: { type: String, required: true, trim: true },
    genre: {
        type: String,
        required: true,
        enum: {
            values: [
                "FICTION",
                "NON_FICTION",
                "SCIENCE",
                "HISTORY",
                "BIOGRAPHY",
                "FANTASY",
            ],
            message: "Genre is not valid. got {VALUE}",
        },
        uppercase: true,
    },
    isbn: {
        type: String,
        required: true,
        unique: [true, "Must be an Unique ISBN number"],
    },
    description: { type: String, trim: true },
    copies: {
        type: Number,
        required: true,
        min: [1, "You have to add minimum 1 copy"]
    },
    available: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false,
});
exports.Books = (0, mongoose_1.model)("Books", BookSchema);

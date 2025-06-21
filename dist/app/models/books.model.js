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
    },
    available: { type: Boolean, default: true },
}, {
    timestamps: true,
    versionKey: false,
});
BookSchema.post("findOneAndUpdate", function (doc, next) {
    return __awaiter(this, void 0, void 0, function* () {
        console.log("doc", this.getQuery(), doc);
        next();
    });
});
exports.Books = (0, mongoose_1.model)("Books", BookSchema);

const mongoose = require("mongoose");
import { Application, Request, Response } from "express";
import app from "./app";
const port = 5000;
require('dotenv').config()

const express = require("express");

async function main() {
  try {
    await mongoose.connect(
      `mongodb+srv://${process.env.DB_USER}:${process.env.DB_PASS}@cluster0.7ufsi.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0`
    );
    app.listen(port, () => {
      console.log(`Example app listening on port ${port}`);
    });
  } catch (error) {
    console.log(error);
  }
}

main();

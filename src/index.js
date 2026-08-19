// ? commonjs syntax
// require('dotenv').config({path:"./env"})

// ? modular js syntax 1
import "dotenv/config";

import mongoose from "mongoose"
import { DB_NAME } from "./constants.js"
import connectDB from "./db/index.js"
import { app } from "./app.js";

connectDB()
    .then(() => {

        app.on("error", (error) => {
            console.log("ERROR", error);
            throw error
        })

        app.listen(process.env.PORT || 8000, () => {
            console.log(`Server is running at port ${process.env.PORT}`);
        })
    })
    .catch((err) => {
        console.log("MONGODB connection failed!!", err);
    })
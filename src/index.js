// ? commonjs syntax
// require('dotenv').config({path:"./env"})

// ? modular js syntax 1
import "dotenv/config";

// ? modular js syntax 2
// import dotenv from "dotenv"
// dotenv.config({
//     path: "./.env"
// })

import mongoose from "mongoose"
import { DB_NAME } from "./constants.js"
import connectDB from "./db/index.js"

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















// import express from "express"
// const app = express()

//     (async () => {
//         try {
//             await mongoose.connect(`${process.env.MONGODB_URI}/${DB_NAME}`)

//             app.on("error", (error) => {
//                 console.log("ERROR : ", error);
//                 throw error

//             })

//             app.listen(process.env.PORT, () => {
//                 console.log(`App is listening on port ${process.env.PORT}`);

//             })

//         } catch (error) {
//             console.log(`ERROR : ${error}`);
//             throw error

//         }
//     })()
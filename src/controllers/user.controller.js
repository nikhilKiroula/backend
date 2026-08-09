import { asyncHandler } from "../utils/asyncHandler.js"

const regsterUser = asyncHandler(async (req, res) => {
    res.status(200).json({
        message: "hello bhaii!!"
    })
})

export { regsterUser }
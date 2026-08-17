import mongoose, { isValidObjectId } from "mongoose"
import { Tweet } from "../models/tweet.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const createTweet = asyncHandler(async (req, res) => {
    const { content } = req.body

    // Validate tweet content before creating the tweet
    if (!content?.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }

    //  Create a new tweet for the authenticated user
    const tweet = await Tweet.create({
        content: content.trim(),
        user: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, tweet, "Tweet created successfully"))

})


const getUserTweets = asyncHandler(async (req, res) => {

    const { userId } = req.params

    // Validate userId
    if (!isValidObjectId(userId)) {
        throw new ApiError(400, "Invalid user ID");
    }

    // Check if the user exists
    const user = await User.findById(userId)
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    // Find all tweets for the user
    const tweets = await Tweet
    .find({ owner: userId })
    .sort({ createdAt: -1 })

    return res
    .status(200)
    .json(new ApiResponse(200, tweets, "User tweets fetched successfully"))

})


const updateTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;
    const { content } = req.body;

    // Validate tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Validate tweet content
    if (!content?.trim()) {
        throw new ApiError(400, "Tweet content is required");
    }

    // Find the tweet by ID that needs to be updated
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Check if the authenticated user is the owner of the tweet
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this tweet");
    }

    // Update the tweet content
    tweet.content = content.trim();
    await tweet.save();

    return res
        .status(200)
        .json(new ApiResponse(200, tweet, "Tweet updated successfully"));

})


const deleteTweet = asyncHandler(async (req, res) => {

    const { tweetId } = req.params;

    // Validate tweetId
    if (!isValidObjectId(tweetId)) {
        throw new ApiError(400, "Invalid tweet ID");
    }

    // Find the tweet by ID that needs to be deleted
    const tweet = await Tweet.findById(tweetId);
    if (!tweet) {
        throw new ApiError(404, "Tweet not found");
    }

    // Allow only the tweet owner to delete the tweet
    if (tweet.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this tweet");
    }

    await tweet.deleteOne();

    return res
        .status(200)
        .json(new ApiResponse(200, {}, "Tweet deleted successfully"));

})

export {
    createTweet,
    getUserTweets,
    updateTweet,
    deleteTweet
}
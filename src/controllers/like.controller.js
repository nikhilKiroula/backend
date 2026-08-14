import mongoose, { isValidObjectId } from "mongoose"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"
import { Comment } from "../models/comment.model.js"
import { Tweet } from "../models/tweet.model.js"

const toggleVideoLike = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    // Validate the video ID before querying the database
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    // Check whether the video exists
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    // Check whether the current user has already liked this video
    const existingLike = await Like.findOne({
        video: videoId,
        likedBy: req.user._id
    });

    // Remove the existing like to unlike the video
    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Video unliked successfully"))
    }

    // Create a new like for the current user
    const createVideoLike = await Like.create({
        video: videoId,
        likedBy: req.user._id
    });

    return res
        .status(201)
        .json(new ApiResponse(201, createVideoLike, "Video liked successfully"))

})

const toggleCommentLike = asyncHandler(async (req, res) => {
    const { commentId } = req.params

    if (!isValidObjectId(commentId)) throw new ApiError(400, "Invalid comment ID");

    const comment = await Comment.findById(commentId);
    if (!comment) throw new ApiError(404, "Comment not found");

    const existingLike = await Like.findOne({
        comment: commentId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Comment unliked successfully"))
    }

    const createCommentLike = await Like.create({
        comment: commentId,
        likedBy: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, createCommentLike, "Comment liked successfully"))

})

const toggleTweetLike = asyncHandler(async (req, res) => {
    const { tweetId } = req.params

    if (!isValidObjectId(tweetId)) throw new ApiError(400, "Invalid tweet ID");

    const tweet = await Tweet.findById(tweetId);
    if (!tweet) throw new ApiError(404, "Tweet not found");

    const existingLike = await Like.findOne({
        tweet: tweetId,
        likedBy: req.user._id
    });

    if (existingLike) {
        await Like.findByIdAndDelete(existingLike._id);

        return res
            .status(200)
            .json(new ApiResponse(200, {}, "Tweet unliked successfully"))
    }

    const createTweetLike = await Like.create({
        tweet: tweetId,
        likedBy: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201, createTweetLike, "Tweet liked successfully"))

})

const getLikedVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    const pipeline = [];

    pipeline.push({
        $match: {
            likedBy: new mongoose.Types.ObjectId(req.user._id),
            video: { $ne: null }
        }
    })

    pipeline.push({
        $lookup: {
            from: "videos",
            localField: "video",
            foreignField: "_id",
            as: "video"
        }
    })

    pipeline.push({
        $unwind: "$video"
    });

    const aggregate = Like.aggregate(pipeline);

    const likedVideos = await Like.aggregatePaginate(
        aggregate,
        {
            page: Number(page),
            limit: Number(limit)
        }
    )

    return res
        .status(200)
        .json(
            new ApiResponse(200, likedVideos, "Liked videos fetched successfully"));
})

export {
    toggleCommentLike,
    toggleTweetLike,
    toggleVideoLike,
    getLikedVideos
}
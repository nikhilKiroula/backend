import mongoose from "mongoose"
import { Video } from "../models/video.model.js"
import { Subscription } from "../models/subscription.model.js"
import { Like } from "../models/like.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"

const getChannelStats = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    // Fetch all videos uploaded by the authenticated user
    const videos = await Video.find(
        { owner: userId },
        { _id: 1, views: 1 }
    );

    // Extract all video IDs uploaded by the channel
    const videoIds = videos.map(video => video._id);

    // Calculate the total number of views across all videos
    const totalViews = videos.reduce(
        (total, video) => total + video.views,
        0
    );

    // Count all likes received by the channel's videos
    const totalLikes = await Like.countDocuments({
        video: { $in: videoIds }
    });

    // Count all subscribers of the channel
    const totalSubscribers = await Subscription.countDocuments({
        channel: userId
    });

    const stats = {
        totalVideos: videos.length,
        totalViews,
        totalLikes,
        totalSubscribers
    };

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                stats,
                "Channel stats fetched successfully"
            )
        );
});


const getChannelVideos = asyncHandler(async (req, res) => {

    const userId = req.user._id;

    // Fetch all videos uploaded by the authenticated user
    const videos = await Video.find({
        owner: userId
    })
        .sort({ createdAt: -1 });

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                videos,
                "Channel videos fetched successfully"
            )
        );
});
export {
    getChannelStats,
    getChannelVideos
}
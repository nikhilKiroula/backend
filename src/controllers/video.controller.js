import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query
    //TODO: get all videos based on query, sort, pagination
})

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // TODO: get video, upload to cloudinary, create video

    const videoFilePath = req.files?.videoFile?.[0]?.path;
    const thumbnailPath = req.files?.thumbnail?.[0]?.path;

    if (!videoFilePath) throw new ApiError(400, "Video file is missing");
    if (!thumbnailPath) throw new ApiError(400, "Thumbnail is missing");

    const video = await uploadOnCloudinary(videoFilePath);
    if (!video?.url || !video?.public_id) throw new ApiError(400, "Error while uploading video..!!");

    const thumbnail = await uploadOnCloudinary(thumbnailPath);
    if (!thumbnail?.url || !thumbnail?.public_id) throw new ApiError(400, "Error while uploading thumbnail..!!");

    const createVideo = await Video.create({
        videoFile: {
            url: video.url,
            public_id: video.public_id
        },

        thumbnail: {
            url: thumbnail.url,
            public_id: thumbnail.public_id
        },

        title,
        description,
        duration: video.duration,
        owner: req.user._id
    });

    return res
    .status(200)
    .json(new ApiResponse(201, createVideo, "video published successfully..."))

});

const getVideoById = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: get video by id
})

const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: update video details like title, description, thumbnail

})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    //TODO: delete video
})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
import mongoose, { isValidObjectId } from "mongoose"
import { Video } from "../models/video.model.js"
import { User } from "../models/user.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { deleteFromCloudinary, uploadOnCloudinary } from "../utils/cloudinary.js"


const getAllVideos = asyncHandler(async (req, res) => {
    const { page = 1, limit = 10, query, sortBy, sortType, userId } = req.query

    // Filter videos by title or description when a search query is provided
    const pipeline = [];

    if (query?.trim()) {
        pipeline.push({
            $match: {
                $or: [
                    {
                        title: {
                            $regex: query,
                            $options: "i"
                        }
                    },
                    {
                        description: {
                            $regex: query,
                            $options: "i"
                        }
                    }
                ]
            }
        })
    }

    // Filter videos uploaded by a specific user
    if (userId) {

        if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user ID");

        pipeline.push({
            $match: {
                owner: new mongoose.Types.ObjectId(userId)
            }
        })
    }


    // Define allowed fields for sorting
    const allowedSortFields = [
        "createdAt", "views", "duration", "title"
    ];

    const sortField = allowedSortFields.includes(sortBy) ? sortBy : "createdAt";

    const sortOrder = sortType === "asc" ? 1 : -1;

    // Sort videos based on the requested field and order
    pipeline.push({
        $sort: {
            [sortField]: sortOrder
        }
    })

    // Join the owner information from the users collection
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        },
    })

    // Convert the owner array returned by $lookup into a single object
    pipeline.push({
        $unwind: "$owner"
    });

    const aggregate = Video.aggregate(pipeline);
    const options = {
        page: Number(page),
        limit: Number(limit)
    };

    const result = await Video.aggregatePaginate(
        aggregate,
        options
    );

    return res
        .status(200)
        .json(new ApiResponse(
            200,
            result,
            "Video fetched successfully"
        ));

});

const publishAVideo = asyncHandler(async (req, res) => {
    const { title, description } = req.body
    // get video, upload to cloudinary, create video

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

    // Validate the video ID before querying the database
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video id");

    // Find the video and populate basic owner information
    const video = await Video.findById(videoId)
        .populate("owner", "username fullName avatar")

    // Return an error if the requested video does not exist
    if (!video) throw new ApiError(404, "Video not found");

    return res
        .status(200)
        .json(new ApiResponse(200, video, "Video fetched successfully"));
})


const updateVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params
    const { title, description } = req.body;
    const thumbnailPath = req.files?.path;

    // Validate the video ID before querying the database
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const video = await Video.findById(videoId);

    // Check whether the requested video exists
    if (!video) throw new ApiError(404, "Video not found");

    if (video.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "You are not authorized to update this video");


    const updateData = {};

    if (title !== undefined) updateData.title = title;
    if (description !== undefined) updateData.description = description;


    // Upload and replace the thumbnail when a new one is provided
    if (thumbnailPath) {

        const newThumbnail = await uploadOnCloudinary(thumbnailPath);

        if (!newThumbnail?.url || !newThumbnail?.public_id)
            throw new ApiError(400, "Error while uploading new thumbnail")


        // Delete the old thumbnail from Cloudinary
        if (!video.thumbnail.public_id)
            await deleteFromCloudinary(video.thumbnail.public_id)

        // Store the new thumbnail information
        updateData.thumbnail = {
            url: newThumbnail.url,
            public_id: newThumbnail.public_id
        }

    }

    // Update the video document in MongoDB
    const updatedVideo = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: updateData
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .json(new ApiResponse(
            200, updatedVideo, "Video updated successfully"
        ))
})

const deleteVideo = asyncHandler(async (req, res) => {
    const { videoId } = req.params

    // Validate the video ID before querying the database
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    // Find the video that needs to be deleted
    const video = await Video.findById(videoId);

    // Check whether the video exists
    if (!video) throw new ApiError(404, "Video not found");

    // Allow only the video owner to delete the video
    if (video.owner.toString() !== req.user._id.toString()) throw new ApiError(403, "You are not authorized to delete this video")


    // Delete the video file from Cloudinary
    if (video.videoFile?.public_id) await deleteFromCloudinary(video.videoFile.public_id, "video")

    // Delete the thumbnail from Cloudinary
    if (video.thumbnail?.public_id) await deleteFromCloudinary(video.thumbnail.public_id, "image")

    // Delete the video document from MongoDB
    await Video.findByIdAndDelete(videoId)

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Video deleted successfully"
            )
        );

})

const togglePublishStatus = asyncHandler(async (req, res) => {
    const { videoId } = req.params;

    // Validate the video ID before querying the database
    if (!isValidObjectId(videoId))
        throw new ApiError(400, "Invalid video ID")


    // Find the video whose publish status needs to be changed
    const video = await Video.findById(videoId);

    if (!video)
        throw new ApiError(404, "Video not found")

    if (video.owner.toString() !== req.user._id.toString())
        throw new ApiError(403, "You are not authorized to update this video")

    const updatedVideoStatus = await Video.findByIdAndUpdate(
        videoId,
        {
            $set: {
                isPublished: !video.isPublished
            }
        },
        {
            new: true
        }
    )

    return res
    .status(200)
    .json(new ApiResponse(200, updatedVideoStatus, "Video publish status updated successfully"))
})

export {
    getAllVideos,
    publishAVideo,
    getVideoById,
    updateVideo,
    deleteVideo,
    togglePublishStatus
}
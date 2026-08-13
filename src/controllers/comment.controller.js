import mongoose, { isValidObjectId } from "mongoose"
import { Comment } from "../models/comment.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { Video } from "../models/video.model.js"


const getVideoComments = asyncHandler(async (req, res) => {

    const { videoId } = req.params
    const { page = 1, limit = 10 } = req.query

    // Validate the video ID before querying the database
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    const pipeline = [];

    // Match comments that belong to the requested video
    pipeline.push({
        $match: {
            video: new mongoose.Types.ObjectId(videoId)
        }
    })

    // Join the comment owner information from the users collection
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "owner",
            foreignField: "_id",
            as: "owner"
        }
    })

    // Convert the owner array into a single user object
    pipeline.push({
        $unwind: "$owner"
    })

    // Return only the fields required by the client
    pipeline.push({
        $project: {
            content: 1,
            video: 1,
            createdAt: 1,
            updatedAt: 1,
            owner: {
                _id: 1,
                username: 1,
                fullName: 1,
                avatar: 1
            }
        }
    })

    const aggregate = Comment.aggregate(pipeline);

    const comments = await Comment.aggregatePaginate(
        aggregate,
        {
            page: Number(page),
            limit: Number(limit)
        }
    )

    return res
        .status(200)
        .json(new ApiResponse(200, comments, "Comments fetched successfully"))

})

const addComment = asyncHandler(async (req, res) => {
    // TODO: add a comment to a video
    const { videoId } = req.params;
    const { content } = req.body;

    // Validate the video ID before querying the database
    if (!isValidObjectId(videoId)) throw new ApiError(400, "Invalid video ID");

    // Make sure the comment content is provided
    if (!content?.trim()) throw new ApiError(400, "Comment content is required");

    // Check whether the video exists
    const video = await Video.findById(videoId);
    if (!video) throw new ApiError(404, "Video not found");

    // Create a new comment for the authenticated user
    const comment = await Comment.create({
        content,
        video: videoId,
        owner: req.user._id
    })

    return res
        .status(200)
        .json(new ApiResponse(201, comment, "Comment added successfully"))
})

const updateComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;
    const { content } = req.body;

    // Validate the comment ID before querying the database
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Make sure the updated comment content is provided
    if (!content?.trim()) {
        throw new ApiError(400, "Comment content is required");
    }

    // Find the comment that needs to be updated
    const comment = await Comment.findById(commentId);

    // Check whether the comment exists
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Allow only the comment owner to update the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to update this comment"
        );
    }

    // Update the comment content in MongoDB
    const updatedComment = await Comment.findByIdAndUpdate(
        commentId,
        {
            $set: {
                content
            }
        },
        {
            new: true
        }
    );

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                updatedComment,
                "Comment updated successfully"
            )
        );
});

const deleteComment = asyncHandler(async (req, res) => {

    const { commentId } = req.params;

    // Validate the comment ID before querying the database
    if (!mongoose.isValidObjectId(commentId)) {
        throw new ApiError(400, "Invalid comment ID");
    }

    // Find the comment that needs to be deleted
    const comment = await Comment.findById(commentId);

    // Check whether the comment exists
    if (!comment) {
        throw new ApiError(404, "Comment not found");
    }

    // Allow only the comment owner to delete the comment
    if (comment.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(
            403,
            "You are not authorized to delete this comment"
        );
    }

    // Delete the comment from MongoDB
    await Comment.findByIdAndDelete(commentId);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                {},
                "Comment deleted successfully"
            )
        );
});
export {
    getVideoComments,
    addComment,
    updateComment,
    deleteComment
}
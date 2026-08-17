import mongoose, { isValidObjectId } from "mongoose"
import { Playlist } from "../models/playlist.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"
import { User } from "../models/user.model.js"
import { Video } from "../models/video.model.js"


const createPlaylist = asyncHandler(async (req, res) => {
    const { name, description } = req.body

    if (!name?.trim() || !description?.trim()) throw new ApiError(400, "Playlist name and description is required");

    const playlist = await Playlist.create({
        name,
        description,
        owner: req.user._id
    })

    return res
        .status(201)
        .json(new ApiResponse(201,
            playlist,
            "Playlist created successfuly"
        ))


})

const getUserPlaylists = asyncHandler(async (req, res) => {
    const { userId } = req.params

    if (!isValidObjectId(userId)) throw new ApiError(400, "Invalid user id");

    const user = await User.findById(userId);
    if (!user) throw new ApiError(404, "User not found");

    const playlists = await Playlist.find({ owner: userId });

    return res
        .status(200)
        .json(new ApiResponse(200, playlists, "User playlists fetched successfully"));
})

const getPlaylistById = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id");

    const playlist = await Playlist
        .findById(playlistId)
        .populate("videos");

    if (!playlist) throw new ApiError(404, "Playlist not found");

    return res
        .status(200)
        .json(new ApiResponse(200, playlist, "Playlist fetched successfully"));
})


const addVideoToPlaylist = asyncHandler(async (req, res) => {

    const { videoId, playlistId } = req.params;

    // Validate both IDs before querying the database
    if (
        !isValidObjectId(videoId) ||
        !isValidObjectId(playlistId)
    ) {
        throw new ApiError(
            400,
            "Invalid video or playlist ID"
        );
    }

    // Check whether the video exists
    const video = await Video.findById(videoId);

    if (!video) {
        throw new ApiError(404, "Video not found");
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId);

    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Allow only the playlist owner to modify the playlist
    if (
        playlist.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to modify this playlist"
        );
    }

    // Prevent adding the same video multiple times
    const alreadyExists = playlist.videos.some(
        (id) => id.toString() === videoId.toString()
    );

    if (alreadyExists) {
        throw new ApiError(
            400,
            "Video is already added to this playlist"
        );
    }

    // Add the video to the playlist
    playlist.videos.push(videoId);

    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video added to playlist successfully"
            )
        );
});

const removeVideoFromPlaylist = asyncHandler(async (req, res) => {

    const { videoId, playlistId } = req.params;

    // Validate both IDs before querying the database
    if (
        !isValidObjectId(videoId) ||
        !isValidObjectId(playlistId)
    ) {
        throw new ApiError(
            400,
            "Invalid video or playlist ID"
        );
    }

    // Find the playlist
    const playlist = await Playlist.findById(playlistId);

    // Check whether the playlist exists
    if (!playlist) {
        throw new ApiError(404, "Playlist not found");
    }

    // Allow only the playlist owner to modify the playlist
    if (
        playlist.owner.toString() !==
        req.user._id.toString()
    ) {
        throw new ApiError(
            403,
            "You are not authorized to modify this playlist"
        );
    }

    // Find the video inside the playlist
    const videoIndex = playlist.videos.findIndex(
        (id) => id.toString() === videoId.toString()
    );

    // Check whether the video exists in the playlist
    if (videoIndex === -1) {
        throw new ApiError(
            404,
            "Video not found in playlist"
        );
    }

    // Remove the video from the playlist
    playlist.videos.splice(videoIndex, 1);

    // Save the updated playlist
    await playlist.save();

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                playlist,
                "Video removed from playlist successfully"
            )
        );
});
const deletePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id");

    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    // Allow only the playlist owner to delete the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to delete this playlist");
    }

    await Playlist.findByIdAndDelete(playlistId);

    return res
        .status(200)
        .json(new ApiResponse(200, null, "Playlist deleted successfully"));

})

const updatePlaylist = asyncHandler(async (req, res) => {
    const { playlistId } = req.params
    console.log(req.body);
    const { name, description } = req.body

    if (!isValidObjectId(playlistId)) throw new ApiError(400, "Invalid playlist id");


    // Find the playlist that needs to be updated
    const playlist = await Playlist.findById(playlistId);
    if (!playlist) throw new ApiError(404, "Playlist not found");

    // Allow only the playlist owner to update the playlist
    if (playlist.owner.toString() !== req.user._id.toString()) {
        throw new ApiError(403, "You are not authorized to update this playlist");
    }

    // Make sure at least one field is provided for the update
    if (!name?.trim() && !description?.trim()) {
        throw new ApiError(400, "At least one field (name or description) is required for update");
    }

    const updatedData = {};
    if (name?.trim()) updatedData.name = name.trim();

    if (description?.trim()) updatedData.description = description.trim();

    const updatedPlaylist = await Playlist.findOneAndUpdate(
        { _id: playlistId },
        {
            $set: updatedData
        },
        {
            returnDocument: "after",
            runValidators: true
        }
    );

console.log("UPDATE DONE:", updatedPlaylist);

return res
    .status(200)
    .json(
        new ApiResponse(
            200,
            updatedPlaylist,
            "Playlist updated successfully"
        )
    );
})

export {
    createPlaylist,
    getUserPlaylists,
    getPlaylistById,
    addVideoToPlaylist,
    removeVideoFromPlaylist,
    deletePlaylist,
    updatePlaylist
}
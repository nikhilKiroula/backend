import mongoose, { isValidObjectId } from "mongoose"
import { User } from "../models/user.model.js"
import { Subscription } from "../models/subscription.model.js"
import { ApiError } from "../utils/ApiError.js"
import { ApiResponse } from "../utils/ApiResponse.js"
import { asyncHandler } from "../utils/asyncHandler.js"


const toggleSubscription = asyncHandler(async (req, res) => {
    const { channelId } = req.params
    // TODO: toggle subscription

    // Validate the channel ID before querying the database
    if (!isValidObjectId(channelId)) throw new ApiError(400, "Invalid channel ID");

    // Check whether the channel exists
    const channel = await User.findById(channelId);
    if (!channel) throw new ApiError(404, "Channel not found");

    // Prevent users from subscribing to their own channel
    if (channelId.toString() === req.user._id.toString()) throw new ApiError(400, "You cannot subscribe to your own channel");

    // Check whether the current user has already subscribed
    const existingSubscription = await Subscription.findOne({
        subscriber: req.user._id,
        channel: channelId
    });

    // Remove the existing subscription to unsubscribe
    if (existingSubscription) {

        await Subscription.findByIdAndDelete(
            existingSubscription._id
        );

        return res
            .status(200)
            .json(
                new ApiResponse(
                    200,
                    {},
                    "Channel unsubscribed successfully"
                )
            );
    }

    // Create a new subscription
    const subscription = await Subscription.create({
        subscriber: req.user._id,
        channel: channelId
    });

    return res
        .status(201)
        .json(
            new ApiResponse(
                201,
                subscription,
                "Channel subscribed successfully"
            )
        );
})

// controller to return subscriber list of a channel
const getUserChannelSubscribers = asyncHandler(async (req, res) => {

    const { channelId } = req.params;

    // Validate the channel ID before querying the database
    if (!isValidObjectId(channelId)) {
        throw new ApiError(400, "Invalid channel ID");
    }

    // Check whether the channel exists
    const channel = await User.findById(channelId);

    if (!channel) {
        throw new ApiError(404, "Channel not found");
    }

    const pipeline = [];

    // Find all subscriptions belonging to the requested channel
    pipeline.push({
        $match: {
            channel: new mongoose.Types.ObjectId(channelId)
        }
    });

    // Join subscriber information from the users collection
    pipeline.push({
        $lookup: {
            from: "users",
            localField: "subscriber",
            foreignField: "_id",
            as: "subscriber"
        }
    });

    // Convert the subscriber array into a single user object
    pipeline.push({
        $unwind: "$subscriber"
    });

    // Return only the required subscriber information
    pipeline.push({
        $project: {
            _id: 1,
            subscriber: {
                _id: 1,
                username: 1,
                fullName: 1,
                avatar: 1
            },
            createdAt: 1
        }
    });

    const subscribers = await Subscription.aggregate(pipeline);

    return res
        .status(200)
        .json(
            new ApiResponse(
                200,
                subscribers,
                "Channel subscribers fetched successfully"
            )
        );
});

// controller to return channel list to which user has subscribed
const getSubscribedChannels = asyncHandler(async (req, res) => {
    const { subscriberId } = req.params;

    if (!isValidObjectId(subscriberId)) throw new ApiError(400, "Invalid subscriber ID");

    const subscriber = await User.findById(subscriberId);
    if (!subscriberId) throw new ApiError(404, "Subscriber not found");

    const pipeline = [];

    pipeline.push({
        $match: {
            subscriber: new mongoose.Types.ObjectId(subscriberId)
        }
    });

    pipeline.push({
        $lookup: {
            from: "users",
            localField: "channel",
            foreignField: "_id",
            as: "channel"
        }
    });

    pipeline.push({
        $project: {
            _id: 1,
            channel: {
                _id: 1,
                username: 1,
                fullName: 1,
                avatar: 1
            },
            createdAt: 1
        }
    });

    const subscribedChannels = await Subscription.aggregate(pipeline)

    return res
        .status(200)
        .json(new ApiResponse(200, subscribedChannels, "Subscribed channels fetched successfully"));
})

export {
    toggleSubscription,
    getUserChannelSubscribers,
    getSubscribedChannels
}
import feedModel from "../Model/feedModel.js";
import connectionmodel from "../Model/connectionModel.js";
import  sendNotification from "../Util/pushNotification.js";
import { getUserSubscription } from "../Model/pushSubscriptionsModel.js";
const getFeed = async (req, res) => {
    try {
        const userId = parseInt(req.user?.userId);
        if (!userId) {
            throw new Error("Invalid userId");
        }
        const { cursor, limit = 10 } = req.query;

        const { feeds, nextCursor } = await feedModel.getFeed(userId, cursor ? parseInt(cursor) : null, parseInt(limit));

        res.status(200).json({
            success: true,
            message: "Get feed success",
            body: { currentUserId: userId, feeds, cursor: nextCursor },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Get feed failed",
            error: error.message || null,
        });
    }
};

const createFeed = async(req, res) => {
    try {
        const user_id = req.user?.userId;
        if (!user_id) {
            throw new Error("Invalid userId");
        }
        const { content } = req.body;
        
        const newFeed = await feedModel.createFeed(user_id, content);
        
        res.status(201).json({
            success: true,
            message: "Create feed success",
            body: {
                ...newFeed,
                id: Number(newFeed.id),
                user_id: Number(newFeed.user_id)
            }
        });
        const connections = await connectionmodel.getUserConnections(user_id);
        const payload = {
          title: 'New Post',
          body: `${newFeed.user.username} has a new post`,
          url: `/post/${newFeed.id}`
        };
    
        for (const connection of connections) {
          const subscriptions = await getUserSubscription(connection.id);
          subscriptions.forEach(subscription => {
            sendNotification(subscription, payload);
          });
        }
    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Create feed failed",
            error: error.message || null
        });
    }
}

const updateFeed = async(req, res) => {
    try {
        const { post_id } = req.params;
        const { content } = req.body;
        
        const updatedFeed = await feedModel.updateFeed(post_id, content);
        
        res.status(200).json({
            success: true,
            message: "Update feed success",
            body: {
                ...updatedFeed,
                id: Number(updatedFeed.id),
                user_id: Number(updatedFeed.user_id)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Update feed failed",
            error: error.message || null
        });
    }
}

const deleteFeed = async(req, res) => {
    try {
        const { post_id } = req.params;
        
        const deletedFeed = await feedModel.deleteFeed(post_id);
        
        res.status(200).json({
            success: true,
            message: "Delete feed success",
            body: {
                ...deletedFeed,
                id: Number(deletedFeed.id),
                user_id: Number(deletedFeed.user_id)
            }
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Delete feed failed",
            error: error.message || null
        });
    }
}

const getFeedByUserID = async (req, res) => {
    try {
        const userId = parseInt(req.params);
        if (!userId) {
            throw new Error("Invalid userId");
        }
        const { cursor, limit = 10 } = req.query;

        const { feeds, nextCursor } = await feedModel.getFeed(userId, cursor ? parseInt(cursor) : null, parseInt(limit));

        res.status(200).json({
            success: true,
            message: "Get feed success",
            body: { currentUserId: userId, feeds, cursor: nextCursor },
        });

    } catch (error) {
        res.status(500).json({
            success: false,
            message: "Get feed failed",
            error: error.message || null,
        });
    }
};

const feedController = {
    getFeed,
    createFeed,
    updateFeed,
    deleteFeed,
    getFeedByUserID,
};


export default feedController;

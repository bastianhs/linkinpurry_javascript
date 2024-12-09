import prisma from "../database/prismaClient.js";

export const getPushSubscriptions = async () => {
	return await prisma.push_subscriptions.findMany();
};

export const createPushSubscription = async (endpoint, user_id, keys) => {
	return await prisma.push_subscriptions.create({
		data: { endpoint, user_id, keys, created_at: new Date() },
	});
};

export const deletePushSubscription = async (endpoint) => {
	return await prisma.push_subscriptions.delete({
		where: { endpoint },
	});
};
export const getUserSubscription = async (user_id) => {
	return await prisma.push_subscriptions.findMany({
		where: { user_id },
	});
}
const pushSubscriptionModel = {getPushSubscriptions,createPushSubscription,deletePushSubscription, getUserSubscription};
export default pushSubscriptionModel;
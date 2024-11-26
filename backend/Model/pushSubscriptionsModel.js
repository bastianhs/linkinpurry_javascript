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

const pushSubscriptionModel = {getPushSubscriptions,createPushSubscription,deletePushSubscription};
export default pushSubscriptionModel;
import prisma from "../database/prismaClient.js";

const getUsers = async () => {
	return await prisma.users.findMany();
};

const getUser = async (id) => {
	return await prisma.users.findUnique({
		where: { id: id },
	});
};

const getUserByEmailOrUsername = async (email, username) => {
	return await prisma.users.findFirst({
		where: {
			OR: [{ email: email }, { username: username }],
		},
	});
};

const getUsersByUsernameSubstring = async (substring) => {
	return await prisma.users.findMany({
		where: {
			username: {
				contains: substring,
				mode: "insensitive",
			},
		},
	});
};

const createUser = async (username, email, full_name, password_hash) => {
	const profile_photo_path = "";
	return await prisma.users.create({
		data: {
			username,
			email,
			password_hash,
			full_name,
			work_history: "",
			skills: "",
			profile_photo_path,
			created_at: new Date(),
			updated_at: new Date(),
		},
	});
};

const updateUser = async (id, data) => {
	return await prisma.users.update({
		where: { id },
		data: { ...data, updated_at: new Date() },
	});
};

const deleteUser = async (id) => {
	return await prisma.users.delete({
		where: { id },
	});
};
export async function updateProfile(id, updates = {}) {
	try {
		if (!id) {
			throw new Error("Invalid user ID");
		}
		const userId = BigInt(id);
		const updateData = {
			...(updates.email && { email: updates.email }),
			...(updates.username && { username: updates.username }),
			...(updates.work_history && { work_history: updates.work_history }),
			...(updates.skills && { skills: updates.skills }),
			...(updates.full_name && { full_name: updates.full_name }),
			updated_at: new Date(),
		};
		const updatedUser = await prisma.users.update({
			where: {
				id: userId,
			},
			data: updateData,
		});
		// console.log("Updated user:", updatedUser);
		return updatedUser;
	} catch (error) {
		console.error("Update profile error:", error);
		throw new Error(`Failed to update profile: ${error.message}`);
	}
}
const userModel = {
	getUser,
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	getUserByEmailOrUsername,
	getUsersByUsernameSubstring,
	updateProfile,
};

export default userModel;

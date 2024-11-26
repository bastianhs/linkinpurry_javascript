import prisma from "../prismaClient.js";

export const getUsers = async () => {
	return await prisma.users.findMany();
};

export const getUser = async (id) => {
	return await prisma.users.findUnique({
		where: { id: 1 },
	});
};

export const createUser = async (username, email, full_name, password_hash) => {
	const profile_photo_path = "";
	return await prisma.users.create({
		data: {
			username,
			email,
			password_hash,
			full_name,
			profile_photo_path,
			created_at: new Date(),
			updated_at: new Date(),
		},
	});
};

export const updateUser = async (id, data) => {
	return await prisma.users.update({
		where: { id },
		data: { ...data, updated_at: new Date() },
	});
};

export const deleteUser = async (id) => {
	return await prisma.users.delete({
		where: { id },
	});
};

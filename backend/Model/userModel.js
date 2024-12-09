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
			skills:"",
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

const userModel = {
	getUser,
	getUsers,
	createUser,
	updateUser,
	deleteUser,
	getUserByEmailOrUsername,
	getUsersByUsernameSubstring,
};

export default userModel;

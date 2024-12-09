import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();
const firstNames = [
	"Bambang",
	"Siti",
	"Ahmad",
	"Dewi",
	"Budi",
	"Rina",
	"Agus",
	"Sri",
	"Wahyu",
	"Ani",
	"Dedi",
	"Putri",
	"Rudi",
	"Nina",
	"Eko",
	"Maya",
	"Hendra",
	"Dina",
	"Joko",
	"Lina",
	"Salsa",
];

const lastNames = [
	"Wijaya",
	"Kusuma",
	"Suryadi",
	"Wati",
	"Santoso",
	"Sari",
	"Putra",
	"Dewi",
	"Hermawan",
	"Permata",
	"Saputra",
	"Utami",
	"Nugroho",
	"Indah",
	"Pratama",
	"Lestari",
	"Hidayat",
	"Mulia",
	"Susanto",
	"Pertiwi",
];

function getRandomFullName() {
	const firstName = firstNames[Math.floor(Math.random() * firstNames.length)];
	const lastName = lastNames[Math.floor(Math.random() * lastNames.length)];
	return `${firstName} ${lastName}`;
}
async function truncateAllTables() {
	try {

		// Truncate tables in order (children first, then parents)
		await prisma.$transaction([
			prisma.$executeRaw`TRUNCATE TABLE "chat" CASCADE;`,
			prisma.$executeRaw`TRUNCATE TABLE "connection" CASCADE;`,
			prisma.$executeRaw`TRUNCATE TABLE "connection_request" CASCADE;`,
			prisma.$executeRaw`TRUNCATE TABLE "feed" CASCADE;`,
			prisma.$executeRaw`TRUNCATE TABLE "push_subscriptions" CASCADE;`,
			prisma.$executeRaw`TRUNCATE TABLE "users" CASCADE;`,
		]);



		console.log("All tables truncated successfully");
	} catch (error) {
		console.error("Error truncating tables:", error);
		throw error;
	}
}
async function main() {
	await truncateAllTables();
	// Create 20 users

	const users = [];
	for (let i = 1; i <= 20; i++) {
		const user = await prisma.users.create({
			data: {
				username: `user${i}`,
				email: `user${i}@example.com`,
				password_hash:
					"$2b$10$KaHUqj4h2aJG0k1qySOhceF3iYPFrfvtzzPzkI8IYct1G4vSh7oKK",
				full_name: getRandomFullName(),
				work_history: `Software Engineer at Company ${i}`,
				skills: `JavaScript, Python, SQL, React ${i}`,
				profile_photo_path: `uploads/default-avatar.png`,
				updated_at: new Date(),
			},
		});
		users.push(user);
	}

	// Create connections (each user connects with 5 random others)
	for (const user of users) {
		const otherUsers = users.filter((u) => u.id !== user.id);
		const randomConnections = otherUsers
			.sort(() => Math.random() - 0.5)
			.slice(0, 5);

		for (const connection of randomConnections) {
			try {
				await prisma.connection.create({
					data: {
						from_id: user.id,
						to_id: connection.id,
						created_at: new Date(),
					},
				});
			} catch (error) {
				// Skip if connection already exists
				continue;
			}
		}
	}

	const connections = await prisma.connection.findMany();

	// Create chat messages only between connected users
	const chatMessages = [
		"Hey, how are you?",
		"Let's catch up soon!",
		"Great work on the project!",
		"Can we schedule a meeting?",
		"Thanks for connecting!",
		"Interesting article you shared!",
		"Happy to connect with you!",
		"Looking forward to collaborating!",
		"Congratulations on your new role!",
		"Would love to learn more about your work!",
	];

	// Create 200 chat messages between connected users
	for (let i = 0; i < 200; i++) {
		// Get random connection
		const randomConnection =
			connections[Math.floor(Math.random() * connections.length)];

		// Create message using connected users
		await prisma.chat.create({
			data: {
				from_id: randomConnection.from_id,
				to_id: randomConnection.to_id,
				message: chatMessages[Math.floor(Math.random() * chatMessages.length)],
				timestamp: new Date(
					Date.now() - Math.floor(Math.random() * 10000000000)
				),
			},
		});
	}

	// Create feed posts
	const feedContents = [
		"Excited to share my latest project!",
		"Just completed a certification in...",
		"Looking for new opportunities in...",
		"Great conference today about...",
		"Happy to announce my new role at...",
		"Sharing my thoughts on the latest tech trends...",
		"Celebrating 5 years in the industry!",
		"Check out my new blog post about...",
		"Grateful for my amazing team!",
		"Learning something new today...",
	];

	// Create 100 feed posts
	for (let i = 0; i < 100; i++) {
		const randomUser = users[Math.floor(Math.random() * users.length)];
		await prisma.feed.create({
			data: {
				content: feedContents[Math.floor(Math.random() * feedContents.length)],
				user_id: randomUser.id,
				updated_at: new Date(),
			},
		});
	}

	// Create connection requests only for non-connected users
	for (let i = 0; i < 50; i++) {
		const randomUser1 = users[Math.floor(Math.random() * users.length)];
		const randomUser2 = users[Math.floor(Math.random() * users.length)];

		if (randomUser1.id !== randomUser2.id) {
			try {
				// Check if users are already connected
				const existingConnection = await prisma.connection.findFirst({
					where: {
						OR: [
							{
								AND: [{ from_id: randomUser1.id }, { to_id: randomUser2.id }],
							},
							{
								AND: [{ from_id: randomUser2.id }, { to_id: randomUser1.id }],
							},
						],
					},
				});

				// Only create request if not connected
				if (!existingConnection) {
					await prisma.connection_request.create({
						data: {
							from_id: randomUser1.id,
							to_id: randomUser2.id,
							created_at: new Date(),
						},
					});
				}
			} catch (error) {
				// Skip if request already exists
				continue;
			}
		}
	}

	// Create push subscriptions
	for (let i = 0; i < 30; i++) {
		const randomUser = users[Math.floor(Math.random() * users.length)];
		await prisma.push_subscriptions.create({
			data: {
				endpoint: `https://fcm.googleapis.com/fcm/send/${Math.random()
					.toString(36)
					.substring(7)}`,
				user_id: randomUser.id,
				keys: {
					auth: Math.random().toString(36).substring(7),
					p256dh: Math.random().toString(36).substring(7),
				},
			},
		});
	}
}

main()
	.catch((e) => {
		console.error(e);
		process.exit(1);
	})
	.finally(async () => {
		await prisma.$disconnect();
	});

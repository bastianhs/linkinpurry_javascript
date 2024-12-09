export class ConnectionRequestDTO {
	constructor(data) {
		this.fromId = Number(data.fromId);
		this.toId = Number(data.toId);
	}
}

export class ConnectionResponseDTO {
	constructor(connection) {
		this.id = Number(connection.id);
		this.username = connection.username;
		this.profilePhotoPath = connection.profile_photo_path;
		this.createdAt = connection.created_at;
	}

	static fromArray(connections) {
		return connections.map((c) => new ConnectionResponseDTO(c));
	}
}

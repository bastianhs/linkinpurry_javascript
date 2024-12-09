export class ChatRequestDTO {
	constructor(data) {
		this.fromId = data.from_id;
		this.toId = data.to_id;
		this.message = data.message;
	}
}

export class ChatResponseDTO {
	constructor(chat) {
		this.id = chat.id.toString();
		this.message = chat.message;
		this.timestamp = chat.timestamp;
		this.otherUser = new UserResponseDTO(chat.otherUser);
	}
}

export class LoginRequestDTO {
	constructor(data) {
		this.email = data.email;
		this.password = data.password;
	}
}

export class RegisterRequestDTO {
	constructor(data) {
		this.username = data.username;
		this.email = data.email;
		this.password = data.password;
		this.name = data.name;
	}
}

export class UserResponseDTO {
	constructor(user) {
		this.id = user.id.toString();
		this.username = user.username;
		this.email = user.email;
		this.fullName = user.full_name;
		this.profilePhoto = user.profile_photo_path;
		this.createdAt = user.created_at;
	}
}

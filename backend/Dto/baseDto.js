export class BaseResponseDTO {
	static success(data, message = "Success") {
		return {
			success: true,
			message,
			data,
		};
	}

	static error(message, errors = null) {
		return {
			success: false,
			message:message,
			errors,
		};
	}
}

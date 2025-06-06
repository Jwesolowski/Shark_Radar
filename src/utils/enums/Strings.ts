const Strings = Object.freeze({
	INVALID_ENDPOINT: "Invalid endpoint",
	EDIT: "Edit",
	DELETE: "Delete",
	SUCCESS: "Success!",
	SUBMIT: "Submit",
	REQUIRED_FIELDS: "* Required fields",
	UNREAD_MESSAGES: "Unread Messages",
	NO_MESSAGES: "No messages"
});

type StringsType = typeof Strings[keyof typeof Strings];

export { Strings, StringsType };

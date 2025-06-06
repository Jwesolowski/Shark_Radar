const Method = Object.freeze({
	GET: "get",
	POST: "post",
	PUT: "put",
	DELETE: "delete"
});

type MethodType = typeof Method[keyof typeof Method];

export { Method, MethodType };

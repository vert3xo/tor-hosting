package types

type Response struct {
	Data	interface{} `json:"data"`
	Error	interface{} `json:"error"`
}

type AuthRequest struct {
	Username		string `json:"username"`
	Password		string `json:"password"`
}

type Error struct {
	Msg		string	`json:"msg"`
	Code	int		`json:"code"`
}

type UserUpdateRequest struct {
	Password	string	`json:"password"`
}

type CreateUserRequest struct {
	Username	string	`json:"username"`
	Password	string	`json:"password"`
	Admin		bool	`json:"admin"`
}

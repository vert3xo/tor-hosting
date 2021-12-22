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
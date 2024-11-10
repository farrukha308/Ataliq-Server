import CONSTANT from "../constant/constant"

export interface DefaultResponse {
    status: "fail" | "success",
    message: string,
    code: number,
    data: object 
}
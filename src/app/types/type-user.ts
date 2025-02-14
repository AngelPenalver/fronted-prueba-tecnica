export type UserData = {
    email: string;
    password: string;
}

export type UserForm = {
    email: string;
    password: string;
}
export type ResponseUser = {
   
        email:string,
        token: string
   
}
export type ErrorResponseUser = {
    error:{
        message:string,
        error: string,
        statusCode: number
    }
}
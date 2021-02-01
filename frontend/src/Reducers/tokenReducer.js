import { TOKEN_CREATE, TOKEN_GET } from "../constants/tokenConstants"

export const tokenCreateReducer = (state = {}, action) => {
    switch (action.type) {
        case TOKEN_CREATE:
            return {
                token: action.payload
            }
        default:
            return {...state }
    }
}

export const tokenGetReducer = (state = {}, action) => {
    switch (action.type) {
        case TOKEN_GET:
            return {
                token: action.payload
            }
        default:
            return {...state }
    }
}
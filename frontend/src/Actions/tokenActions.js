import { TOKEN_CREATE, TOKEN_GET } from "../constants/tokenConstants"

export const getToken = () => (dispatch, getState) => {
    const token = sessionStorage.getItem('token') ? Number(JSON.parse(sessionStorage.getItem('token'))) : getState().tokenGet.token
    dispatch({
        type: TOKEN_GET,
        payload: token
    })
}

export const createToken = (token) => (dispatch, getState) => {
    dispatch({
        type: TOKEN_CREATE,
        payload: Number(token)
    })
    sessionStorage.setItem('token', JSON.stringify(Number(token)))
}
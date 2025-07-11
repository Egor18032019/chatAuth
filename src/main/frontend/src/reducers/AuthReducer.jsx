 
export const initialState = {
    isLoggedIn: false,
    email: '',
    token: ''
};

export function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: true,
                email: action.payload.email,
                token: action.payload.token
            };
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                email: action.payload.email,
                token: action.payload.token
            };
        default:
            return initialState;
    }
}


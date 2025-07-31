
export const initialState = {
    isLoggedIn: false,
    email: '',
    role: '',
    token: ''
};

export function authReducer(state, action) {
    switch (action.type) {
        case 'LOGIN':
            return {
                ...state,
                isLoggedIn: true,
                email: action.payload.email,
                role: action.payload.role,
                token: action.payload.token
            };
        case 'LOGOUT':
            return {
                ...state,
                isLoggedIn: false,
                email: "",
                role: "",
                token: ""
            };
        default:
            return initialState;
    }
}


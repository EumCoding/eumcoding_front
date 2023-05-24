const initialState = {
    accessToken: null,
};

const reducer = (state = initialState, action) => {
    switch (action.type) {
        case 'SET_ACCESS_TOKEN':
            return {
                ...state,
                accessToken: action.payload,
            };
        case 'CLEAR_ACCESS_TOKEN':
            return {
                ...state,
                accessToken: null,
            };
        default:
            return state;
    }
};

export default reducer;
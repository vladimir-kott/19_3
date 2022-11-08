import { createSlice, createAction } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";

const commentsSlice = createSlice({
    name: "comments",
    initialState: {
        entities: null,
        isLoading: true,
        error: null
    },
    reducers: {
        commentsRequested: (state) => {
            state.isLoading = true;
        },
        commentsReceived: (state, action) => {
            state.entities = action.payload;
            state.isLoading = false;
        },
        commentsRequestFailed: (state, action) => {
            state.error = action.payload;
            state.isLoading = false;
        },
        commnetsAdded: (state, action)=>{
            state.entities.push(action.payload);
        },
        commentsDeleted: (state, action) => {
            console.log(state)
            console.log(action)
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const { commentsRequested, commentsReceived, commentsRequestFailed, commnetsAdded ,commentsDeleted } = actions;


const userAddedRequested = createAction("comments/userAddedRequested");
const userAddedFailed = createAction("comments/userAddedFailed");
const userDeleteRequested = createAction("comments/userDeleteRequested");
const userDeleteFailed = createAction("comments/userDeleteFailed");

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const addedComments = (userId) => async (dispatch) => {
    dispatch(userAddedRequested())
    try {
        //const { content } = await commentService.removeComment(userId);
        //dispatch(commentsDeleted(content))
        /*if (content === null) {
            setComments((prevState) =>
                prevState.filter((c) => c._id !== id)
            );
        }*/
    } catch (error) {
        dispatch(userAddedFailed(error.message))
        //errorCatcher(error);
    }
}

export const deleteComments = (userId) => async (dispatch) => {
    dispatch(userDeleteRequested())
    try {
        const { content } = await commentService.removeComment(userId);
        dispatch(commentsDeleted(content))
        /*if (content === null) {
            setComments((prevState) =>
                prevState.filter((c) => c._id !== id)
            );
        }*/
    } catch (error) {
        dispatch(userDeleteFailed(error.message))
        //errorCatcher(error);
    }
}

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;

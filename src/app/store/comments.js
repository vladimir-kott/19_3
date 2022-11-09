import { createSlice, createAction } from "@reduxjs/toolkit";
import commentService from "../services/comment.service";
import { nanoid } from "nanoid";

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
            state.entities = state.entities.filter((c) => c._id !== action.payload)
        }
    }
});

const { reducer: commentsReducer, actions } = commentsSlice;
const { commentsRequested, commentsReceived, commentsRequestFailed, commnetsAdded ,commentsDeleted } = actions;


const commentsAddedRequested = createAction("comments/userAddedRequested");
const commentsAddedFailed = createAction("comments/userAddedFailed");
const commentsDeleteRequested = createAction("comments/userDeleteRequested");
const commentsDeleteFailed = createAction("comments/userDeleteFailed");

export const loadCommentsList = (userId) => async (dispatch) => {
    dispatch(commentsRequested());
    try {
        const { content } = await commentService.getComments(userId);
        dispatch(commentsReceived(content));
    } catch (error) {
        dispatch(commentsRequestFailed(error.message));
    }
};

export const addedComments = (commentStr) => async (dispatch) => {
    dispatch(commentsAddedRequested())
    try {
        const { content } = await commentService.createComment(commentStr);
        dispatch(commnetsAdded(content))
    } catch (error) {
        dispatch(commentsAddedFailed(error.message))
    }
}

export const deleteComments = (userId, payload) => async (dispatch) => {
    dispatch(commentsDeleteRequested())
    try {
        const { content } = await commentService.removeComment(userId);
        dispatch(commentsDeleted(userId))
    } catch (error) {
        dispatch(commentsDeleteFailed(error.message))
    }
}

export const getComments = () => (state) => state.comments.entities;
export const getCommentsLoadingStatus = () => (state) =>
    state.comments.isLoading;

export default commentsReducer;

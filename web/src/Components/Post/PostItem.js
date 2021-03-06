import React,{Component} from "react";
import {
    MDBBadge,
    MDBBtn,
    MDBCard,
    MDBCardBody, MDBCarousel, MDBCarouselInner, MDBCarouselItem,
    MDBCol,
    MDBIcon, MDBPopover, MDBPopoverBody, MDBPopoverHeader,
    MDBRow,
    MDBTooltip, MDBView
} from "mdbreact";
import {setProfilePicture} from "../../Helpers";
import {Link} from "react-router-dom";
import TimeAgo from "react-timeago";
import SingleComment from "../PostComment/SingleComment";
import CommentInput from "../PostComment/CommentInput";
import LikeButton from "./LikeButton";
import PostShare from "./PostShare";
import PropTypes from 'prop-types';
import CommentList from "../PostComment/CommentList";
import PostLikes from "./PostLikes";
import {POST_IMAGE} from "../../Config";

export default class PostItem extends Component{
    constructor(props) {
        super(props);
        this.state = {
            inputVisibility: false
        };

        this.handleInputVisibility = this.handleInputVisibility.bind(this);
    }

    handleInputVisibility() {
        this.setState((prevState) => ({inputVisibility: !prevState.inputVisibility}))
    }

    render() {
        const {post,sendingComment,onHandlePostLike,onHandlePostComment,
            sendingCommentReply,onHandleCommentReply,onHandleCommentLike,
            getComments,hasMoreComments,loadingComments,
            loadingMoreComments,onCommentModalCloseHandler,getSubComments,
            loadingMoreSubComments,hasMoreSubComments,
            loadingMoreSubCommentsId,sendingCommentId,sendingCommentReplyId,
            loadingPostLikes,loadingMorePostLikes,getPostLikes,likes,hasMorePostLikes,
            onPostLikesModalCloseHandler
        } = this.props;
        const {inputVisibility} = this.state;
        return (
            <MDBRow center>
                <MDBCol size={12} md={12} lg={10} xl={8}>
                    <MDBCard className={'my-3'}>
                        <MDBCardBody>
                            <MDBRow className={'mb-3'}>
                                <MDBCol xs={2} className={'pr-0 d-flex justify-content-start align-items-center'}>
                                    <Link  to={'/profile/' + post.profileName}>
                                        <img
                                            className={'img-fluid rounded-circle'}
                                            style={{width: 45,height:45}}
                                            src={post.profilePicture ? post.profilePicture : setProfilePicture(post.firstName,post.lastName)}
                                        />
                                    </Link>
                                </MDBCol>
                                <MDBCol xs={10} className={'pl-3'}>
                                    <h5 className={'mb-0'}>
                                        <MDBTooltip>
                                            <Link
                                                className={'text-dark'}
                                                to={'/profile/' + post.profileName}
                                            >
                                                {post.profileName}
                                            </Link>
                                            <div>{post.firstName+' '+post.lastName}</div>
                                        </MDBTooltip>
                                    </h5>
                                    <small className={'text-muted'} style={{fontSize: 11}}><TimeAgo
                                        date={post.createdAt}/></small>
                                </MDBCol>
                            </MDBRow>
                            <MDBRow>
                                <MDBCol>
                                    <p>{post.text}</p>
                                </MDBCol>
                                {post.images.length > 0 ?
                                    <>
                                    <MDBCol className={'p-0 m-0'} size={12} style={{display: 'flex',alignItems: 'center',justifyContent: 'center'}}>
                                        <MDBCarousel
                                            activeItem={1}
                                            length={post.images.length}
                                            showControls={post.images.length > 1 ? true : false}
                                            showIndicators={post.images.length > 1 ? true : false}
                                            mobileGesture={true}
                                        >
                                            <MDBCarouselInner>
                                                {post.images.map((image,index) => (
                                                    <MDBCarouselItem itemId={index+1} key={index}>
                                                        <img className="d-block img-fluid" style={{height: 400}} src={POST_IMAGE(post.profileName,image)} />
                                                    </MDBCarouselItem>
                                                ))}
                                            </MDBCarouselInner>
                                        </MDBCarousel>
                                    </MDBCol>
                                    </>
                                    : ""
                                }
                            </MDBRow>
                            <hr/>
                            <MDBRow>
                                <MDBCol>
                                    <PostLikes
                                        postId={post.id}
                                        likes={likes}
                                        likeCount={post.likes}
                                        getPostLikes={getPostLikes}
                                        loadingPostLikes={loadingPostLikes}
                                        loadingMorePostLikes={loadingMorePostLikes}
                                        hasMorePostLikes={hasMorePostLikes}
                                        onPostLikesModalCloseHandler={onPostLikesModalCloseHandler}
                                    />
                                    <CommentList
                                        comments={post.comments}
                                        getComments={getComments}
                                        hasMoreComments={hasMoreComments}
                                        loadingComments={loadingComments}
                                        loadingMoreComments={loadingMoreComments}
                                        onHandlePostComment={onHandlePostComment}
                                        sendingCommentReply={sendingCommentReply}
                                        onHandleCommentReply={onHandleCommentReply}
                                        onHandleCommentLike={onHandleCommentLike}
                                        onCommentModalCloseHandler={onCommentModalCloseHandler}
                                        getSubComments={getSubComments}
                                        loadingMoreSubComments={loadingMoreSubComments}
                                        hasMoreSubComments={hasMoreSubComments}
                                        commentCount={post.commentCount}
                                        postId={post.id}
                                        sendingComment={sendingComment}
                                        loadingMoreSubCommentsId={loadingMoreSubCommentsId}
                                        sendingCommentId={sendingCommentId}
                                        sendingCommentReplyId={sendingCommentReplyId}
                                        showMoreTag={false}
                                    />
                                    <MDBBadge style={{fontSize: 14}} color={'black'}>{post.commentCount}</MDBBadge>
                                </MDBCol>
                            </MDBRow>
                            <hr/>
                            <MDBRow>
                                <MDBCol col={12}>
                                    {post.comments.length > 0 &&
                                        <SingleComment
                                            onHandlePostComment={onHandlePostComment}
                                            comment={post.comments[0]}
                                            sendingCommentReply={sendingCommentReply}
                                            onHandleCommentReply={onHandleCommentReply}
                                            onHandleCommentLike={onHandleCommentLike}
                                            getSubComments={getSubComments}
                                            loadingMoreSubComments={loadingMoreSubComments}
                                            loadingMoreSubCommentsId={loadingMoreSubCommentsId}
                                            sendingCommentId={sendingCommentId}
                                            sendingCommentReplyId={sendingCommentReplyId}
                                        />
                                    }

                                    {post.commentCount > 1 &&
                                    <CommentList
                                        comments={post.comments}
                                        getComments={getComments}
                                        hasMoreComments={hasMoreComments}
                                        loadingComments={loadingComments}
                                        loadingMoreComments={loadingMoreComments}
                                        onHandlePostComment={onHandlePostComment}
                                        sendingCommentReply={sendingCommentReply}
                                        onHandleCommentReply={onHandleCommentReply}
                                        onHandleCommentLike={onHandleCommentLike}
                                        onCommentModalCloseHandler={onCommentModalCloseHandler}
                                        getSubComments={getSubComments}
                                        loadingMoreSubComments={loadingMoreSubComments}
                                        hasMoreSubComments={hasMoreSubComments}
                                        commentCount={post.commentCount}
                                        postId={post.id}
                                        sendingComment={sendingComment}
                                        loadingMoreSubCommentsId={loadingMoreSubCommentsId}
                                        sendingCommentId={sendingCommentId}
                                        sendingCommentReplyId={sendingCommentReplyId}
                                        showMoreTag={true}
                                    />}
                                </MDBCol>
                            </MDBRow>

                            <CommentInput
                                onHandlePostComment={onHandlePostComment}
                                inputVisibility={inputVisibility}
                                sendingComment={sendingComment}
                                sendingCommentId={sendingCommentId}
                                postId={post.id}
                            />

                            <MDBRow center={true} className={'text-center'}>
                                <MDBCol size={4}>
                                    <LikeButton
                                        liked={post.liked}
                                        id={post.id}
                                        onHandlePostLike={onHandlePostLike}
                                    />
                                </MDBCol>
                                <MDBCol size={4}>
                                    <MDBBtn
                                        color={'white'}
                                        block={true}
                                        style={{boxShadow: 'none'}}
                                        onClick={this.handleInputVisibility}
                                    >
                                        <MDBIcon far={true} icon={'comment'} size={'2x'}/>
                                    </MDBBtn>
                                </MDBCol>
                                <MDBCol size={4}>
                                    <PostShare />
                                </MDBCol>
                            </MDBRow>
                        </MDBCardBody>
                    </MDBCard>
                </MDBCol>
            </MDBRow>
        );
    }

    static defaultProps = {
        onlyMe: null
    }
}

PostItem.propTypes = {
    post: PropTypes.object.isRequired,
    likes: PropTypes.array.isRequired,
    getComments: PropTypes.func.isRequired,
    hasMoreComments: PropTypes.bool.isRequired,
    loadingComments: PropTypes.bool.isRequired,
    onCommentModalCloseHandler: PropTypes.func.isRequired,
    loadingMoreComments: PropTypes.bool.isRequired,
    sendingComment: PropTypes.bool.isRequired,
    onHandlePostLike: PropTypes.func.isRequired,
    sendingCommentReply: PropTypes.bool.isRequired,
    onHandleCommentReply: PropTypes.func.isRequired,
    onHandleCommentLike: PropTypes.func.isRequired,
    getSubComments: PropTypes.func.isRequired,
    loadingMoreSubComments: PropTypes.bool.isRequired,
    loadingMoreSubCommentsId: PropTypes.number.isRequired,
    sendingCommentId: PropTypes.number.isRequired,
    sendingCommentReplyId: PropTypes.number.isRequired,
    getPostLikes: PropTypes.func.isRequired,
    loadingPostLikes: PropTypes.bool.isRequired,
    loadingMorePostLikes: PropTypes.bool.isRequired,
    hasMorePostLikes: PropTypes.bool.isRequired,
    onPostLikesModalCloseHandler: PropTypes.func.isRequired,
    onlyMe: PropTypes.bool
}
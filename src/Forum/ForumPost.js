import React from 'react';
import ReactDOM from 'react-dom';
import { connect } from 'react-redux';
import auth from '../client.js';
import { togglePost } from '../Actions/ForumActions';
import ReplyPost from './ReplyPost';
import Replies from './Replies';

const ForumPost = React.createClass({

  render() {
    console.log('KEEEEEEEEY', this.props.post._id)
  //create get request for original posters profile pic
  let profilePic = {
    backgroundImage: 'url(' + this.props.post.profile + ')',
    backgroundRepeat: 'no-repeat',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  }

  var postType = this.props.post.isShort;
  console.log("Here is the post type, ", postType)
  let message;
  let title;

  if (postType) {
    if (this.props.message.split(" ").length < 100) {
       if (this.props.replies.length) {
        message = this.props.message.split(" ").slice(0, 100).join(" ") + "...Click to see replies";
        title = this.props.title.split(" ").slice(0, 20).join(" ");
      } else {
        title = this.props.title;
        message = this.props.message;
      }
    } else {
      message = this.props.message.split(" ").slice(0, 100).join(" ") + "...Click to Expand";
      title = this.props.title.split(" ").slice(0, 20).join(" ");
    }
  } else {
    message = this.props.message;
    title = this.props.title;
  }

    return(
      <div>
        <div className="row" onClick = {() => {
            this.props.dispatchTogglePost(this.props.post._id);
            }} >
          <div className="col-md-1" style={profilePic}>
          { this.props.nickname }
          </div>
          <div className="col-md-11 offset-md-0">
            <div className="row">
              <span className="forumTitle">{ title }</span>
            </div>
            <div className="row">
              { message }
            </div>
          </div>
        </div>
          <div>
            <div>
              {this.props.replies.map((reply, i) => {
                if (!postType) {
                   return <Replies key={i} reply={reply} />
                }
              }
              )}
            </div>
            <ReplyPost post={this.props.post}/>
          </div>
      </div>
    )
  }
})

const mapStateToProps = (state) => {
  return {
    posts: state.forumReducer.posts,
    currentPost: state.forumReducer.currentPost
  };
};

const mapDispatchToProps = (dispatch) => {
  return {

    dispatchTogglePost(id) {
      dispatch(togglePost(id));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(ForumPost);
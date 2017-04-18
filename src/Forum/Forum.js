import React from 'react';
import ReactDOM from 'react-dom'
import { connect } from 'react-redux';
import ForumPost from './ForumPost';
// import ForumPostDetails from './ForumPostDetails';
import CreateNewPost from './CreateNewPost';
import axios from 'axios';
import { setPosts } from '../Actions/ForumActions';


const Forum = React.createClass({

   getPost() {
    axios.get('/api/forum')
    .then((res) => {
      console.log('this props FORUM', this.props)
      var dbPostData = res.data;
      this.props.dispatchSetPost(dbPostData)
    }).catch((err) => {
      console.error(err);
      console.log("Error in Forum()");
    });
  },

  render() {
    console.log('this props POST', this.props.posts)
    return(
        <div className="row">
          <button type="submit" onClick={ () => {
            this.getPost();
          }} >Get Request Here</button>
          <div className="col-md-6">
            <CreateNewPost />
          </div>
          <div className="col-md-6">
            {this.props.posts.map((post, i) =>
                <ForumPost key={i} post={post} nickname={post.nickname} title={post.title} message={post.message} />
            )}
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

    dispatchSetPost(message) {
      dispatch(setPosts(message));
    }
  };
};

export default connect(mapStateToProps, mapDispatchToProps)(Forum);
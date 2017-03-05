/**
 * React Starter Kit (https://www.reactstarterkit.com/)
 *
 * Copyright © 2014-present Kriasoft, LLC. All rights reserved.
 *
 * This source code is licensed under the MIT license found in the
 * LICENSE.txt file in the root directory of this source tree.
 */

import React, { PropTypes } from 'react';
import withStyles from 'isomorphic-style-loader/lib/withStyles';
import s from './Home.css';

class Home extends React.Component {
  static propTypes = {
    alerts: PropTypes.arrayOf(PropTypes.shape({
      term: PropTypes.string.isRequired,
      subreddit: PropTypes.string.isRequired,
    })).isRequired,

    createAlert: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    this.createAlert = this.createAlert.bind(this);
  }
/*
<h2>Top Authors</h2>
{
  this.props.data.authors.map(author =>
    (
      <section>
        <div>
          <h3><a target="_blank" href={`https://www.reddit.com/user/${author.name}`}>{author.name}</a>
            {' '}<a target="_blank" href={`https://www.reddit.com/message/compose?to=${author.name}`}>(message)</a></h3>
        </div>
        <div>
          <h3>Reputation</h3>
          <div>{author.about.data.link_karma} link karma</div>
          <div>{author.about.data.comment_karma} comment karma</div>
          <div>Member since {new Date(author.about.data.created_utc * 1000).toString()}</div>
        </div>
        <div>
          <h3>Recent Posts</h3>
          {
            author.posts.recent20.data.children.map((post) => {
              return <div>
                <div>[{post.data.score}] /r/{post.data.subreddit} - {post.data.title} - {post.data.domain}</div>
                <hr />
              </div>;
            })
          }
        </div>
        <div>
          <h3>Comments</h3>
          {
            Object.keys(author.comments).map((key) => {
              const comments = author.comments[key].data.children;
              return comments.map(comment => <div>
                <div>[{comment.data.score}] /r/{comment.data.subreddit} - {comment.data.link_title}</div>
                <div>{comment.data.body}</div>
                <hr />
              </div>);
            })
          }
        </div>
      </section>
    ),
  )
}*/

  createAlert(e) {
    e.preventDefault();

    const term = e.target.querySelector('[name="term"]').value;
    const subreddit = e.target.querySelector('[name="subreddit"]').value;

    this.props.createAlert(term, subreddit);
  }

  render() {
    return (
      <div className={s.root}>
        <div className={s.container}>
          <h1>My Alerts</h1>
          <div>
            {
              this.props.alerts.map(alert => <div>
                <div>/r/{alert.subreddit} - {alert.term}</div>
              </div>)
            }
          </div>
          <h1>Create Alert</h1>
          <form onSubmit={this.createAlert}>
            <div>Term: <input type="text" name="term" /></div>
            <div>Subreddit: <input type="text" name="subreddit" /></div>
            <div><input type="submit" value="Create" /></div>
          </form>
        </div>
      </div>
    );
  }
}

export default withStyles(s)(Home);

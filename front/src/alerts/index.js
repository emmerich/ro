import { readdirSync, readFileSync } from 'fs';
import { join } from 'path';
import { contains, append } from 'ramda';
import Alert from '../data/models/Alert';

const sent = {};

const checkAlerts = (alerts, posts) => {
  let alertsToSend = [];

  posts.forEach((post) => {
    const title = post.title || '';
    const selftext = post.selftext || '';

    alerts.forEach((alert) => {
      const inTitle = contains(alert.term, title);
      const inSelfText = contains(alert.term, selftext);

      if ((inTitle || inSelfText) && !contains(post.id, (sent[alert.id] || []))) {
        alertsToSend = append({
          type: 'post',
          in: inTitle ? 'title' : inSelfText ? 'selftext' : null,
          alert,
          data: post,
        }, alertsToSend);

        sent[alert.id] = append(post.id, (sent[alert.id] || []));
      }
    });

    post.comments.forEach((comment) => {
      alerts.forEach((alert) => {
        const body = comment.body || '';
        if (contains(alert.term, body) && !contains(comment.id, (sent[alert.id] || []))) {
          alertsToSend = append({
            type: 'comment',
            alert,
            data: comment,
          }, alertsToSend);

          sent[alert.id] = append(comment.id, (sent[alert.id] || []));
        }
      });
    });
  });

  alertsToSend.forEach(alert => console.log('alert!', alert.type, alert.alert.term, alert.data));
};

const DATA_DIR = join(__dirname, '..', '..', 'reddit-outreach', 'data');

const run = async () => {
  const subreddits = readdirSync(DATA_DIR);
  const alertInstances = await Alert.findAll();
  const alerts = alertInstances.map(instance => instance.get({ plain: true }));

  subreddits.forEach((subreddit) => {
    const data = JSON.parse(readFileSync(join(DATA_DIR, subreddit)));
    checkAlerts(alerts, data);
  });
};

export default () => {
  run();
  setInterval(() => run(), 1000 * 60);
};

import Alert from './Alert';

export default async () => {
  const alerts = await Alert.findAll();

  if (!alerts || alerts.length) {
    return;
  }

  await Alert.create({
    term: 'newcastle',
    subreddit: 'soccer',
  });
};

import fetch from './fetch';

export default async body => fetch('/graphql', {
  method: 'post',
  headers: {
    Accept: 'application/json',
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(body),
  credentials: 'include',
});

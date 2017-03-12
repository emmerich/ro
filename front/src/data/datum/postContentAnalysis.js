
const topDomains = async () => ({
  data: [
    {
      x: 'google.com',
      y: 10,
    },
    {
      x: 'facebook.com',
      y: 40,
    },
    {
      x: 'gify.net',
      y: 30,
    },
  ],
});

export default async () => ({
  topDomains: await topDomains(),
});

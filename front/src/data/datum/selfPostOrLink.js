
const percentageDifference = async () => ({
  data: [
    {
      slice: 'selfpost',
      size: 43.12,
    },
    {
      slice: 'external',
      size: 100 - 43.12,
    },
  ],
});

const postPosition = async () => ({
  rows: [
    ['Self-post', '1', '100', '200'],
    ['Link', '10', '50', '500'],
  ],
});

const numberOfUpvotes = async () => ({
  rows: [
    ['Self-post', '1', '100', '200'],
    ['Link', '10', '50', '500'],
  ],
});

export default async () => ({
  percentageDifference: await percentageDifference(),
  postPosition: await postPosition(),
  numberOfUpvotes: await numberOfUpvotes(),
});

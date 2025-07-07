import { API } from 'aws-amplify';

const getBestScores = async () => {
  const apiName = 'scoresApi';
  const path = '/scores';

  const scores = await API.get(apiName, path);
  console.log('scores fetched', scores);
  return scores;
};

const createScore = async ({ score, username }) => {
  console.log('new score will be created', { score, username });
  const apiName = 'scoresApi';
  const path = '/scores';
  const payload = {
      body: {
        score,
        user: username
      },
  };
  
  await API.post(apiName, path, payload);
  console.log('score created');
};

export { getBestScores, createScore };
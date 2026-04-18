import { getQuizResults } from '../actions';
import ResultsClient from './ResultsClient';

export const revalidate = 0; 

export default async function ResultsPage() {
  const results = await getQuizResults();

  return (
    <div className="admin-container">
      <ResultsClient initialResults={results} />
    </div>
  );
}
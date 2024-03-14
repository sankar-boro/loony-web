import Markdown from 'react-markdown';
import { useHistory } from './Router';

const View = () => {
  const { state } = useHistory();

  return (
    <div>
      <div className='page-title'>{state.title}</div>
      <Markdown>{state.body}</Markdown>
    </div>
  );
};

export default View;

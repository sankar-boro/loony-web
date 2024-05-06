import CreateFormComponent from './form/index';

export default function Create() {
  const searchParams = new URLSearchParams(window.location.search);
  const name = searchParams.get('name');

  if (name === 'blog') {
    return <CreateFormComponent url='/blog/create' title='Create Blog' />;
  }

  if (name === 'book') {
    return <CreateFormComponent editNode='' url='/book/create' title='Create Book' />;
  }
}

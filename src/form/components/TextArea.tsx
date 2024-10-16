import MathsMarkdown from '../../components/MathsMarkdown.tsx';
import { marked } from 'marked'
import DOMPurify from 'dompurify';

type TextAreaProps = {
  formBody: string,
  setFormBody: (_: string) => void,
  theme: number,
  setTheme: (_: number) => void
}

export const TextArea = (props: TextAreaProps) => {
  const { formBody, setFormBody, theme, setTheme } = props;

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        border: '1px solid #ccc',
        borderTopLeftRadius: 5,
        borderTopRightRadius: 5,
      }}
    >
      <div className='flex-row' style={{ width: '100%' }}>
        <div
          className='group-btn'
          style={{
            borderRight: '1px solid #dfdfdf',
            backgroundColor: theme === 11 ? '#ffffff' : '#f4f4f4',
          }}
          onClick={() => {
            setTheme(11);
          }}
        >
          Basic
        </div>
        <div
          className='group-btn'
          style={{
            borderRight: '1px solid #dfdfdf',
            backgroundColor: theme === 24 ? '#ffffff' : '#f4f4f4',
          }}
          onClick={() => {
            setTheme(24);
          }}
        >
          Markdown
        </div>
        <div
          className='group-btn'
          style={{
            backgroundColor: theme === 41 ? '#ffffff' : '#f4f4f4',
          }}
          onClick={() => {
            setTheme(41);
          }}
        >
          Markdown & Maths
        </div>
      </div>
      <div>
        <textarea
          onChange={(e) => {
            setFormBody(e.target.value);
          }}
          rows={24}
          cols={120}
          value={formBody}
          style={{
            border: 'none',
          }}
          placeholder='Body'
        />

        <div style={{ flex: 1, minHeight: 100, marginTop: 24, padding: 5 }}>
          {theme === 11 ? (
            formBody
          ) : theme === 24 ? (
            DOMPurify.sanitize(marked.parse(formBody))
          ) : theme === 41 ? (
            <MathsMarkdown source={formBody} />
          ) : null}
        </div>
      </div>
    </div>
  );
};

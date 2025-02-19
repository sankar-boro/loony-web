// import MathsMarkdown from '../../components/MathsMarkdown.tsx'
// import MarkdownPreview from '@uiw/react-markdown-preview'

type TextAreaProps = {
  formContent: string
  setFormContent: (_: string) => void
  theme: number
  setTheme: (_: number) => void
}

export const TextArea = (props: TextAreaProps) => {
  const { formContent, setFormContent, theme, setTheme } = props

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
      <div className="flex-row" style={{ width: '100%' }}>
        <div
          className="group-btn"
          style={{
            borderRight: '1px solid #dfdfdf',
            backgroundColor: theme === 11 ? '#ffffff' : '#f4f4f4',
          }}
          onClick={() => {
            setTheme(11)
          }}
        >
          Basic
        </div>
        <div
          className="group-btn"
          style={{
            borderRight: '1px solid #dfdfdf',
            backgroundColor: theme === 24 ? '#ffffff' : '#f4f4f4',
          }}
          onClick={() => {
            setTheme(24)
          }}
        >
          Markdown
        </div>
        <div
          className="group-btn"
          style={{
            backgroundColor: theme === 41 ? '#ffffff' : '#f4f4f4',
          }}
          onClick={() => {
            setTheme(41)
          }}
        >
          Markdown & Maths
        </div>
      </div>
      <div>
        <textarea
          onChange={(e) => {
            setFormContent(e.target.value)
          }}
          rows={5}
          cols={100}
          value={formContent}
          style={{
            border: 'none',
          }}
          placeholder="Body"
        />

        {/* <div style={{ flex: 1, minHeight: 100, marginTop: 24, padding: 5 }}>
          {theme === 11 ? (
            formContent
          ) : theme === 24 ? (
            <MarkdownPreview
              source={formContent}
              wrapperElement={{ 'data-color-mode': 'light' }}
            />
          ) : theme === 41 ? (
            <MathsMarkdown source={formContent} />
          ) : null}
        </div> */}
      </div>
    </div>
  )
}

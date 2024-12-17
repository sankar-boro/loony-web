import MarkdownPreview from '@uiw/react-markdown-preview'

export default function BasicMarkdown({ source }: { source: string }) {
  return (
    <MarkdownPreview
      source={source}
      wrapperElement={{ 'data-color-mode': 'light' }}
    />
  )
}

// import React from 'react'
// import MarkdownPreview from '@uiw/react-markdown-preview';
// import { getCodeString } from 'rehype-rewrite';
// import katex from 'katex';
import 'katex/dist/katex.css';
import { marked } from 'marked'
import DOMPurify from 'dompurify';


export default function MathsMarkdown({ source }: { source: string }) {
  return DOMPurify.sanitize(marked.parse(source));

  // return <MarkdownPreview
  //   source={source}
  //   wrapperElement={{ 'data-color-mode': 'light' }}
  //   components={{
  //     code: ({ children = [], className, node }: { children: React.ReactNode, className: string, node: { children: ElementContent[] } }) => {
  //       if (typeof children === 'string' && /^\$\$(.*)\$\$/.test(children)) {
  //         const html = katex.renderToString(children.replace(/^\$\$(.*)\$\$/, '$1'), {
  //           throwOnError: false,
  //         });
  //         return (
  //           <code
  //             dangerouslySetInnerHTML={{ __html: html }}
  //             style={{ background: 'transparent' }}
  //           />
  //         );
  //       }
  //       const code = node && node.children ? getCodeString(node.children) : children;
  //       if (
  //         typeof code === 'string' &&
  //         typeof className === 'string' &&
  //         /^language-katex/.test(className.toLocaleLowerCase())
  //       ) {
  //         const html = katex.renderToString(code, {
  //           throwOnError: false,
  //         });
  //         return <code style={{ fontSize: '150%' }} dangerouslySetInnerHTML={{ __html: html }} />;
  //       }
  //       return <code className={String(className)}>{children}</code>;
  //     },
  //   }}
  // />
}

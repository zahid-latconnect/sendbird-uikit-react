import React from 'react';
import ReactMarkdown from 'react-markdown';
import visit from 'unist-util-visit';
console.log(visit);
const find = /[\t ]*(?:\r?\n|\r)/g

const retextSentenceSpacing = () => {
    return (tree) => {
        visit(tree, (node, index, parent) => {
            /** @type {PhrasingContent[]} */
            const result = []
            let start = 0
            // console.log(node);
            find.lastIndex = 0

            let match = find.exec(node.value)

            while (match) {
                const position = match.index

                if (start !== position) {
                    result.push({ type: 'text', value: node.value.slice(start, position) })
                }

                result.push({ type: 'break' })
                start = position + match[0].length
                match = find.exec(node.value)
            }

            if (result.length > 0 && parent && typeof index === 'number') {
                if (start < node.value.length) {
                    result.push({ type: 'text', value: node.value.slice(start) })
                }

                parent.children.splice(index, 1, ...result)
                return index + result.length
            }
        })
    }
}
interface MarkdownRendererProps {
    markdown: string
}
const MarkdownRenderer = ({ markdown }: MarkdownRendererProps) => {
    console.log('markdown', markdown);
    return <div><ReactMarkdown remarkPlugins={[retextSentenceSpacing]}>{markdown}</ReactMarkdown></div>
}

export default MarkdownRenderer;
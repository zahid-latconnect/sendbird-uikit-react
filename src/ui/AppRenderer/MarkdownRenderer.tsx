import React from 'react';
import ReactMarkdown from 'react-markdown';
import visit from 'unist-util-visit';
console.log(visit);
const find = /[\t ]*(?:\r?\n|\r)/g

// move own to own file or repo
function remarkButtonSyntax(options) {
    console.log('--- options', options)
    return (tree) => {
        visit(tree, (node, index, parent) => {

            if (node.tagName === 'a' && node.type === 'element') {
                if (node.children[0].value.includes("button:")) {
                    node.children[0].value = node.children[0].value.split(":")[1];
                    node.tagName = 'button';
                    const properties = node.properties.href.split('=').reduce((prev, current, index) => {
                        const isEven = index % 2 === 0;
                        if (isEven) {
                            prev[current] = "";
                        } else {
                            prev[node.properties.href.split('=')[index - 1]] = current;
                        }
                        return prev;
                    }, {});
                    node.properties = properties;
                }
                console.log('1234', node);

            }
        })
    }
}
interface MarkdownRendererProps {
    markdown: string
}
const MarkdownRenderer = ({ markdown, handleButtonClick }: MarkdownRendererProps): JSX.Element => {
    console.log('markdown', markdown);

    const mockMarkdown = '[button:shuffle](id=1)[regular link](http://google.com)'
    return <div className='markdown-container'>
        <ReactMarkdown components={{
            'button': ({ node }) => {
                return <button className="app-button-secondary" onClick={() => handleButtonClick(node.properties)}>{node.children[0].value}</button>
            }
        }}
            rehypePlugins={[remarkButtonSyntax]}
            children={markdown} />
    </div>
}

export default MarkdownRenderer;
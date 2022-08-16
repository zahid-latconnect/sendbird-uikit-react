import React from 'react';
import ReactMarkdown from 'react-markdown';
import visit from 'unist-util-visit';
console.log(visit);
const find = /[\t ]*(?:\r?\n|\r)/g

// move own to own file or repo
function remarkMessageExtentionSyntax(options) {
    const getElementProperties = (node) => {
        const properties = node.properties.href.split(",").reduce((prev, current, index) => {
            const keyValues = current.split("=")
            prev[keyValues[0]] = keyValues[1];
            return prev;
        }, {});
        return properties;
    }
    return (tree) => {
        visit(tree, (node, index, parent) => {

            if (node.tagName === 'a' && node.type === 'element') {
                console.log('1234', node)
                // if button
                if (node.children[0].value.includes("button:")) { //need better matching. Too loose
                    node.children[0].value = node.children[0].value.split(":")[1];

                    node.tagName = 'button';
                    node.properties.id = node.children[0].value;
                    // const properties = getElementProperties(node);
                    // node.properties = properties;
                }

                // if poll 
                if (node.children[0].value.includes("poll:")) {
                    node.children[0].value = node.children[0].value.split(":")[1];
                    node.tagName = 'poll';
                    const properties = getElementProperties(node);

                    node.properties = properties;
                }

            }


        })
    }
}
interface MarkdownRendererProps {
    markdown: string
}
const MarkdownRenderer = ({ markdown, handleButtonClick }: MarkdownRendererProps): JSX.Element => {
    console.log('markdown', markdown);
    const [showPollResults, setPollShowResults] = React.useState(false);
    const mockPollMarkdown = "[poll: Do you prefer JavaScript or TypeScript?](option1=JavaScript,option2=TypeScript,option1Result=39,option2Result=60)"


    return <div className='markdown-container'>
        <ReactMarkdown components={{
            'button': ({ node }) => {
                return <button className="app-button-secondary" onClick={() => handleButtonClick(node.properties)}>{node.children[0].value}</button>
            },
            'poll': ({ node }) => {
                if (showPollResults) {
                    return <>
                        <h1>{node.children[0].value}</h1>
                        <div>
                            {node.properties.option1} {node.properties.option1Result}

                        </div>
                        <div>
                            {node.properties.option2} {node.properties.option2Result}
                        </div>
                    </>
                }
                return (
                    <>
                        <h1>{node.children[0].value}</h1>
                        <button className="app-button-secondary"
                            onClick={() => {
                                setPollShowResults(true);
                                handleButtonClick({ id: 1 });
                            }
                            }>
                            {node.properties.option1}
                        </button>
                        <button className="app-button-secondary"
                            onClick={
                                () => {
                                    setPollShowResults(true);
                                    handleButtonClick({ id: 2 })
                                }
                            }>
                            {node.properties.option2}
                        </button>

                    </>
                )
            }
        }}
            rehypePlugins={[remarkMessageExtentionSyntax]}
            children={markdown} />
    </div >
}

export default MarkdownRenderer;
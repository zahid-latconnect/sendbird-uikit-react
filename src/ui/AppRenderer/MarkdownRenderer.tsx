import React from 'react';
import ReactMarkdown from 'react-markdown';
import visit from 'unist-util-visit';
import Label, { LabelTypography, LabelColors } from '../Label';
import Button, { ButtonTypes, ButtonSizes } from '../Button';

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
const MarkdownRendererMemo = ({ markdown, handleButtonClick }: MarkdownRendererProps): JSX.Element => {
    const [showPollResults, setPollShowResults] = React.useState(false);
    const mockPollMarkdown = "[poll: Do you prefer JavaScript or TypeScript?](option1=JavaScript,option2=TypeScript,option1Result=39,option2Result=60)"
    const mockMarkdown = "![alt promotion hero image](https://scout-poc.pages.dev/static/media/banner-renew.fa578f5b.png#hero)  &nbsp;\n  #### Renew today and get 20% off annual subscription! That's free for 2 months. \n &nbsp; [button:Renew]()"
    const mockMarkdownTwoLines = 'Line 1 \nLine 2'
    const ReactMarkdownMemo = React.useMemo(() => {

        console.log('markdown', markdown);



        return (
            <ReactMarkdown components={{
                p: ({ node, ...props }) => <Label color={LabelTypography.PRIMARY} type={LabelTypography.BODY_1} {...props} />,
                h4: ({ node, ...props }) => <Label color={LabelTypography.PRIMARY} type={LabelTypography.SUBTITLE_2} {...props} />,
                'button': ({ node }) => {
                    return <Button
                        className="sendbird-app__button"
                        type={ButtonTypes.SECONDARY}
                        size={ButtonSizes.SMALL}
                        onClick={() => handleButtonClick(node.properties)}>{node.children[0].value}</Button>
                }
            }}
                remarkPlugins={[]}
                rehypePlugins={[remarkMessageExtentionSyntax]}
                children={mockMarkdown}
            />
        )
    }, [markdown]);
    return ReactMarkdownMemo
}

const MarkdownRenderer = React.memo(MarkdownRendererMemo);

export default MarkdownRenderer;
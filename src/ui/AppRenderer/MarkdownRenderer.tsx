import React from 'react';
import ReactMarkdown from 'react-markdown';
import visit from 'unist-util-visit';
import Label, { LabelTypography, LabelColors } from '../Label';
import Button, { ButtonTypes, ButtonSizes } from '../Button';
import remarkGfm from 'remark-gfm'

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

            // support header in table
            if (node.tagName === 'td' && node.type === 'element') {


                if (node.children[0].value && node.children[0].value.substring(0, 2) === "# ") {
                    node.properties.header = 'h1';
                    node.children[0].value = node.children[0].value.substring(2, node.children[0].value.length);
                }

            }


        })
    }
}
interface MarkdownRendererProps {
    markdown: string
}
const MarkdownRendererMemo = ({ markdown, handleButtonClick }: MarkdownRendererProps): JSX.Element => {
    console.log('23840923804', markdown)
    const [showPollResults, setPollShowResults] = React.useState(false);
    const mockPollMarkdown = "[poll: Do you prefer JavaScript or TypeScript?](option1=JavaScript,option2=TypeScript,option1Result=39,option2Result=60)";
    const mockPromotionMarkdown = "![alt promotion hero image](https://scout-poc.pages.dev/static/media/banner-renew.fa578f5b.png#hero)  &nbsp;\n Renew today and get 20% off annual subscription! That's free for 2 months. \n &nbsp; [button:Renew]()";

    const mockOrderTrackingMarkdown = `
|   |   |
| - | - |
| ![sushi](https://scout-poc.pages.dev/static/media/sushi.3245adb1.jpg) | **Sushi Son Dinner set-A with coke** |
### Paid with
Visa 5454
&nbsp;
### Ship to
1995 Nassau Dr., Vancouver, BC V5P 3Z2
&nbsp;
***
|    |       |
| :- |    -: |
| Total | # $60 |

`;
    const mockProductsMarkdown = `
|    |       |
| :- |    :- |
| ![chocolate box silver](https://scout-poc.pages.dev/static/media/chocolate-box-silver.cfd908e1.jpg#hero) | ![chocolate box gold](https://scout-poc.pages.dev/static/media/chocolate-box-gold.f07fbf2d.jpg#hero) |
| Chocolate Lover Birthday Box - Silver | Chocolate Lover Birthday Box - Gold |
| # $100 | # $150 |
| [button:Select]() | [button:Select]() |
`;

    const ReactMarkdownMemo = React.useMemo(() => {

        console.log('markdown', markdown);



        return (
            <ReactMarkdown components={{
                p: ({ node, ...props }) => <Label color={LabelTypography.PRIMARY} type={LabelTypography.BODY_1} {...props} />,
                strong: ({ node, ...props }) => <Label color={LabelTypography.PRIMARY} type={LabelTypography.H_2} {...props} />,
                td: ({ node, ...props }) => {
                    console.log('inside td', node);
                    const fontType = node.properties.header === 'h1' ? LabelTypography.H_1 : LabelTypography.BODY_1;
                    return <td className={node.properties.align}><Label color={LabelTypography.PRIMARY} type={fontType} {...props} /></td>
                },

                h1: ({ node, ...props }) => <Label color={LabelTypography.PRIMARY} type={LabelTypography.H_1} {...props} />,
                h2: ({ node, ...props }) => <Label color={LabelTypography.PRIMARY} type={LabelTypography.H_2} {...props} />,
                h3: ({ node, ...props }) => <Label color={LabelTypography.SECONDARY} type={LabelTypography.BODY_2} {...props} />,

                h4: ({ node, ...props }) => <Label color={LabelTypography.PRIMARY} type={LabelTypography.SUBTITLE_2} {...props} />,
                'button': ({ node }) => {
                    return <Button
                        className="sendbird-app__button"
                        type={ButtonTypes.SECONDARY}
                        size={ButtonSizes.SMALL}
                        onClick={() => handleButtonClick(node.properties)}>{node.children[0].value}</Button>
                }
            }}
                remarkPlugins={[remarkGfm]}
                rehypePlugins={[remarkMessageExtentionSyntax]}
                children={markdown}
            />
        )
    }, [markdown]);
    return ReactMarkdownMemo
}

const MarkdownRenderer = React.memo(MarkdownRendererMemo);

export default MarkdownRenderer;
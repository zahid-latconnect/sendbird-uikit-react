import React, { useState, useRef } from 'react';

interface Label {
    type: String
    text: String
    emoji: Boolean
}
interface Element {
    type: String
    action_id: string
    text?: String
    value?: String
}

interface InputBlock {
    type: 'input'
    element: Element
}

interface ActionBlock {
    type: 'actions',
    elements: [Element]
}

interface SimpleInputBlock extends InputBlock {
    label: Label
}

interface ButtonBlock extends ActionBlock {

}

interface BlockData {
    blocks: [SimpleInputBlock | ButtonBlock]
}

interface Manifest {
    name: string
    url: string
}

interface BlockAppProps {
    blockData: BlockData
    manifest: Manifest
}

interface BlockRendererProps {
    block: SimpleInputBlock | ButtonBlock
    updateState: (string, any) => void
    handleClick: (string) => void

}

interface ElementRendererProps {
    element: Element
    updateState: (string, any) => void
    handleClick?: (string) => void

}


const ElementRenderer = ({ element, updateState, handleClick }: ElementRendererProps) => {

    switch (element.type) {
        case "plain_text_input":
            const handleChange = (e) => {
                const value = e.target.value;
                updateState(element.action_id, value);

            }
            return <div>
                <input onChange={handleChange} id="simple-input" type="text" />
            </div>
        case "button":
            return <div>
                <button id="button" onClick={() => handleClick(element.action_id)}>{element.value}</button>
            </div>
        default:
            return <div></div>
    }
}


const BlockRenderer = ({ block, updateState, handleClick }: BlockRendererProps) => {
    switch (block.type) {
        case "input":
            return <div>
                <label>{block.label.text}</label>
                <ElementRenderer element={block.element} updateState={updateState} />
            </div>
        case "actions":
            return <div>
                {block.elements.map((element, i) => {
                    return <ElementRenderer key={i} element={element} updateState={updateState} handleClick={handleClick} />

                })}
            </div>
        default:
            return <div></div>
    }
}
const BlockApp = ({ blockData, manifest }: BlockAppProps) => {
    const [state, setState] = useState({});
    const updateState = (action_id, incomingState) => {
        let newState = {};
        newState[action_id] = incomingState;
        setState({ ...newState, ...state })
    }
    const handleClick = (action_id) => {
        console.log(`call backend ${manifest.url} with ${action_id}, and state ${state}`);
    }
    return <div>{
        blockData.blocks.map((block, i) => {
            return <BlockRenderer key={i} block={block} updateState={updateState} handleClick={handleClick} />
        })
    }</div>
}

export default BlockApp;

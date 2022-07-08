import React, { useState, useRef } from 'react';
import MarkdownRenderer from './MarkdownRenderer';




interface Manifest {
    name: string
    url: string
}

interface AppRendererProps {
    markdown: string
    manifest: Manifest
}


const AppRenderer = ({ markdown, manifest }: AppRendererProps) => {
    const [state, setState] = useState({});
    const updateState = (action_id, incomingState) => {
        let newState = {};
        newState[action_id] = incomingState;
        setState({ ...newState, ...state })
    }
    const handleClick = (action_id) => {
        console.log(`call backend ${manifest.url} with ${action_id}, and state ${state}`);
    }
    return <div>
        <MarkdownRenderer markdown={markdown} />

    </div>
}

export default AppRenderer;

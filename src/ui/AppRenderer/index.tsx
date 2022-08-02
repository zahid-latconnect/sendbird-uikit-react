import React, { useState, useRef } from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import './style.css'



interface Manifest {
    name: string
    url: string
}

interface AppRendererProps {
    markdown: string
    manifest: Manifest
}


const AppRenderer = ({ markdown, manifest }: AppRendererProps) => {

    return <div className='app-ui'>
        <MarkdownRenderer markdown={markdown} />

    </div>
}

export default AppRenderer;

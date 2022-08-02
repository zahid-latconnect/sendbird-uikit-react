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


const AppRenderer = ({ message, manifest, sendCommand }: AppRendererProps) => {

    const handleButtonClick = async (nodeProperties) => {
        const params = {
            buttonClick: true,
            buttonId: nodeProperties.id
        }
        console.log('333', message);
        const url = manifest.url;
        const command = null;
        const channelUrl = message.channelUrl;
        const messageId = message.messageId;
        const messageText = message.message;
        sendCommand(url, params, 'button', messageText, channelUrl, messageId);
    }
    return <div className='app-ui'>
        <MarkdownRenderer markdown={JSON.parse(message.data).sb_app_ui} handleButtonClick={handleButtonClick} />

    </div>
}

export default AppRenderer;

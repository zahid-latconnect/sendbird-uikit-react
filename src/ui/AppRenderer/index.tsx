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



const AppRenderer = ({ message, manifests, sendCommand }: AppRendererProps) => {

    const handleButtonClick = async (nodeProperties) => {
        const params = {
            buttonClick: true,
            buttonId: nodeProperties.id
        }
        const parsedMessageData = Object.keys(JSON.parse(message.data));
        const appName = parsedMessageData.find((key) => { return key.includes('sb_app') });
        console.log(appName);
        debugger;
        const appManifest = manifests.find((manifest) => { return manifest.name === 'sb_app_ui' });
        debugger;
        const url = appManifest.url;
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

import React, { useState, useRef } from 'react';
import { getClassName } from '../../utils';

import MarkdownRenderer from './MarkdownRenderer';
import './index.scss'



interface Manifest {
    name: string
    url: string
}

interface AppRendererProps {
    markdown: string
    manifest: Manifest
}



const AppRenderer = ({ className, message, appManifests, sendCommand, isByMe }: AppRendererProps) => {
    console.log('2390842309480', message)
    const appData = JSON.parse(message.data).sb_app;
    if (!!appData.isDraft && !isByMe) {
        return null;
    }
    const handleButtonClick = async (nodeProperties) => {
        const params = {
            buttonClick: true,
            buttonId: nodeProperties.id
        }
        const appManifest = appManifests.find((manifest) => (manifest.name === appData.name));

        const url = appManifest.url;
        const channelUrl = message.channelUrl;
        const messageId = message.messageId;
        const messageText = message.message;
        sendCommand(url, params, 'button', messageText, channelUrl, messageId);
    }
    return <div className={getClassName([
        className,
        'sendbird-text-message-item-body',
        'sendbird-app',
        isByMe ? 'outgoing' : 'incoming',

    ])}>
        <MarkdownRenderer markdown={appData.ui} handleButtonClick={handleButtonClick} isByMe={isByMe} />

    </div >
}

export default AppRenderer;

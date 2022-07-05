import React from 'react';
import renderer from 'react-test-renderer';
import { mount } from 'enzyme';

import BlockApp from '../index';

describe('block app', () => {
    it('allows input to be sent to server', () => {
        const blockData = {
            "blocks": [
                {
                    "type": "input",
                    "element": {
                        "type": "plain_text_input",
                        "action_id": "plain_text_input-action"
                    },
                    "label": {
                        "type": "plain_text",
                        "text": "Label",
                        "emoji": true
                    }
                },
                {
                    "type": "actions",
                    "elements": [
                        {
                            "type": "button",
                            "text": {
                                "type": "plain_text",
                                "text": "Click Me",
                                "emoji": true
                            },
                            "value": "click_me_123",
                            "action_id": "action_id-0"
                        }
                    ]
                }
            ]
        }

        const manifest = {
            name: 'my-chat-app',
            url: 'https://my-chat-app.com'
        }
        const component = mount(
            <BlockApp blockData={blockData} manifest={manifest} />,
        );

        const input = component.find('#simple-input');

        input.simulate('change', { target: { value: 'Hello' } });


        const button = component.find('#button')
        button.simulate('click');

    });
});
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
                        "type": "simple-input",
                        "actionId": "plain_text_input-action"
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
                            "actionId": "actionId-0"
                        }
                    ]
                }
            ]
        }
        const component = mount(
            <BlockApp blockData={blockData} />,
        );
        console.log(component.debug());
        const input = component.find('#simple-input');

        input.simulate('change', { target: { value: 'Hello' } });


        const button = component.find('#button')
        button.simulate('click');

    });
});
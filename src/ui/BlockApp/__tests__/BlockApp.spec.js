import React from 'react';
import { mount } from 'enzyme';

import BlockApp from '../index';

describe('block app', () => {
    it('allows input to be sent to server', () => {
        const markdown = "# Here is a link to sendbird \n [Sendbird](https://sendbird.com)";

        const manifest = {
            name: 'my-chat-app',
            url: 'https://my-chat-app.com'
        }
        const component = mount(
            <BlockApp markdown={markdown} manifest={manifest} />,
        );

        console.log(component.debug());

        // const input = component.find('#simple-input');

        // input.simulate('change', { target: { value: 'Hello' } });


        // const button = component.find('#button')
        // button.simulate('click');

    });
});
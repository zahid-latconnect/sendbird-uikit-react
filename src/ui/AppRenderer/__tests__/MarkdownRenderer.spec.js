import React from 'react';
import { mount } from 'enzyme';

import MarkdownRenderer from '../MarkdownRenderer';


describe('markdown renderer', () => {
    it('renders basic markdown', () => {
        const markdown = "# Here is a link to sendbird \n [Sendbird](https://sendbird.com)";
        const component = mount(<MarkdownRenderer markdown={markdown} />)
        // console.log(component.debug());
    });
});
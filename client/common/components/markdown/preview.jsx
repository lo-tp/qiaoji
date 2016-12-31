import React, { PropTypes } from 'react';
import mkd from 'markdown';

const Preview = ({ content, preview }) => (
  <div
    style = { {
      display: preview ? 'inline-block' : 'none',
    } }
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML = {
      { __html: mkd.markdown.toHTML(content) }
    }
  />
);

Preview.propTypes = {
  preview: PropTypes.bool,
  content: PropTypes.string,
};

export default Preview;

import React, { PropTypes } from 'react';
import showdown from 'showdown';

const converter = new showdown.Converter();

const Preview = ({ content, preview }) => (
  <div
    style = { {
      display: preview ? 'inline-block' : 'none',
    } }
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML = {
      { __html: converter.makeHtml(content) }
    }
  />
);

Preview.propTypes = {
  preview: PropTypes.bool,
  content: PropTypes.string,
};

export default Preview;

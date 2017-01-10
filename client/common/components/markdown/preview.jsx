import React, { PropTypes } from 'react';
import Mkd from 'markdown-it';

const mkd = new Mkd();

const Preview = ({ content, preview }) => (
  <div
    style = { {
      display: preview ? 'inline-block' : 'none',
    } }
    // eslint-disable-next-line react/no-danger
    dangerouslySetInnerHTML = {
      { __html: mkd.render(content) }
    }
  />
);

Preview.propTypes = {
  preview: PropTypes.bool,
  content: PropTypes.string,
};

export default Preview;

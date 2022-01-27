import React, { useState } from 'react';
import { Button } from 'reactstrap';
import { Copy } from 'react-feather';

import { CopyToClipboard } from 'react-copy-to-clipboard';

const CopyClipboard = ({ text }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };
  return (
    <CopyToClipboard text={text} onCopy={onCopyText}>
      <Button color="link" className="btn-copy p-0 " title="Copy to clipboard" onClick={(e) => e.preventDefault()}>
        <Copy className=" text-muted" size={12} />
        <small className="text-secondary text-lowercase">{isCopied ? ' Copied!' : ''}</small>
      </Button>
    </CopyToClipboard>
  );
};

export default CopyClipboard;

// @packages
import React, { useState } from "react";
import { Button } from "reactstrap";
import { Copy } from "react-feather";
import { CopyToClipboard } from "react-copy-to-clipboard";
import { PropTypes } from "prop-types";

const CopyClipboard = ({ text, className }) => {
  const [isCopied, setIsCopied] = useState(false);

  const onCopyText = () => {
    setIsCopied(true);
    setTimeout(() => {
      setIsCopied(false);
    }, 1000);
  };

  return (
    <CopyToClipboard text={text} onCopy={onCopyText}>
      <Button color="link" className={`${className} btn-copy p-0`} title="Copy to clipboard" onClick={(e) => e.preventDefault()}>
        <Copy className=" text-muted" size={12} />
        <small className="text-secondary text-lowercase">{isCopied ? " Copied!" : ""}</small>
      </Button>
    </CopyToClipboard>
  );
};

CopyClipboard.propTypes = {
  text: PropTypes.string.isRequired,
  className: PropTypes.string
};

CopyClipboard.defaultProp = {
  className: ""
};

export default CopyClipboard;

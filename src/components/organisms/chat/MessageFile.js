// @packages
import Proptypes from "prop-types";
import { Button, Spinner } from "reactstrap";
import { Truncate } from "@twilio-paste/core";
import { X, File, Download } from "react-feather";
import { useEffect, useState } from "react";

// @scripts
import { getFileUrl } from "./Apis";

// @styles
import "./MessageFile.scss";

const MessageFile = ({
  file,
  isImage,
  media,
  onDownload,
  onOpen,
  onRemove,
  sending,
  type,
  loading = false
}) => {
  const { filename: name, size } = media;

  const [imageUrl, setImageUrl] = useState("");

  useEffect(() => {
    if (!file && isImage && !sending) {
      getFileUrl(media).then((url) => setImageUrl(url));
    }
  }, []);

  if (isImage && type === "view") {
    return (
      <div
        className="message-file-container"
        onClick={file ? onOpen : onDownload}
      >
        <div
          className="message-file-sub"
          style={{ display: file ? "none" : "block" }}
        >
          {sending || loading ? (
            <Spinner
              color="primary"
              size='sm'
              title="Loading"
            />
          ) : (
            <Download
              color="primary"
              size={24}
              title="Download File"
            />
          )}
        </div>
        <img
          className="message-image-url"
          style={{ filter: !file ? "blur(4px)" : "none" }}
          src={
            !file
              ? imageUrl
              : (window.URL || window.webkitURL).createObjectURL(file)
          }
        />
      </div>
    );
  } else {
    return (
      <div
        className="message-download-url"
        style={{
          width: type === "view" ? "calc(100% - 12px)" : "calc(25% - 20px)",
          maxWidth: type === "view" ? "300px" : "200px",
          cursor: type === "view" ? "pointer" : "default"
        }}
        onClick={type === "view" ? (file ? onOpen : onDownload) : undefined}
      >
        <div
          className="message-file"
        >
          {!file && type === "view" ? (
            loading || sending ? (
              <Spinner
                decorative={false}
                color="colorTextLink"
                title="Loading"
              />
            ) : (
              <Download
                className="message-text"
                color="black"
                size={24}
                title="Download File"
              />
            )
          ) : (
            <File
              className="message-text"
              color="black"
              size={24}
              title="Open File"
            />
          )}
        </div>

        <div className="message-text-container" >
          <p fontWeight="fontWeightMedium">
            <Truncate title={name}>{name}</Truncate>
          </p>
          {loading || sending ? (
            <p color="colorTextInverseWeaker">
              {loading ? "Downloading..." : "Uploading..."}
            </p>
          ) : (
            <p color="colorTextInverseWeaker">
              {Math.round((size / Math.pow(2, 20)) * 100) / 100} MB
              {!file && type === "view" ? " - Click to download" : ""}
            </p>
          )}
        </div>

        {onRemove ? (
          <Button 
            className="message-remove"
            color="primary" 
            onClick={onRemove} 
            size="sm"
            variant="link" 
          >
            <div className="message-remove-icon">
              <X
                color="white"
                size={20}
                title="Remove file"
              />
            </div>
          </Button>
        ) : null}
      </div>
    );
  }
};

MessageFile.propTypes = {
  file: Proptypes.object,
  isImage: Proptypes.bool,
  media: Proptypes.object.isRequired,
  onDownload: Proptypes.func,
  onOpen: Proptypes.func,
  onRemove: Proptypes.func,
  sending: Proptypes.bool,
  type: Proptypes.string,
  loading: Proptypes.bool
};

export default MessageFile;

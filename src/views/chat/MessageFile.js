// @packages
import { Text, Truncate } from "@twilio-paste/core";
import { Button, Spinner } from 'reactstrap';
import { X, File } from "react-feather";
import { DownloadIcon } from "@twilio-paste/icons/cjs/DownloadIcon";
import { useEffect, useState } from "react";

// @scripts
import { getFileUrl } from "./Apis";

const MessageFile = ({
  media,
  onRemove,
  onDownload,
  onOpen,
  type,
  file,
  isImage,
  sending,
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
        style={{
          minHeight: "200px",
          minWidth: "200px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          position: "relative",
          borderRadius: "4px"
        }}
        onClick={file ? onOpen : onDownload}
      >
        <div
          style={{
            display: file ? "none" : "block",
            zIndex: 7,
            position: "absolute",
            cursor: "pointer"
          }}
        >
          {sending || loading ? (
            <Spinner
              size='sm'
              decorative={false}
              color="colorTextInverse"
              title="Loading"
            />
          ) : (
            <DownloadIcon
              decorative={false}
              title="Download File"
              size='12px'
              color="colorTextInverse"
              style={{
                fontWeight: "bold"
              }}
            />
          )}
        </div>
        <img
          style={{
            maxHeight: "300px",
            zIndex: 6,
            maxWidth: "400px",
            filter: !file ? "blur(4px)" : "none",
            width: "100%",
            borderRadius: "4px"
          }}
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
        style={{
          display: "flex",
          alignItems: "center",
          padding: "12px 16px",
          margin: "6px 6px 0 6px",
          border: "1px solid #CACDD8",
          boxSizing: "border-box",
          borderRadius: "4px",
          width: type === "view" ? "calc(100% - 12px)" : "calc(25% - 20px)",
          maxWidth: type === "view" ? "300px" : "200px",
          minWidth: "150px",
          backgroundColor: "#fff",
          cursor: type === "view" ? "pointer" : "default"
        }}
        onClick={type === "view" ? (file ? onOpen : onDownload) : undefined}
      >
        <div
          style={{
            marginRight: "16px",
            alignItems: "start"
          }}
        >
          {!file && type === "view" ? (
            loading || sending ? (
              <Spinner
                decorative={false}
                color="colorTextLink"
                title="Loading"
              />
            ) : (
              <DownloadIcon
                decorative={false}
                title="Download File"
                size="sizeIcon60"
                color="colorTextLink"
                style={{
                  fontWeight: "bold"
                }}
              />
            )
          ) : (
            <File
              title="Open File"
              size={25}
              color="black"
              style={{
                fontWeight: "bold"
              }}
            />
          )}
        </div>

        <div
          style={{
            maxWidth: "calc(100% - 42px)"
          }}
        >
          <Text as="p" fontWeight="fontWeightMedium">
            <Truncate title={name}>{name}</Truncate>
          </Text>
          {loading || sending ? (
            <Text as="p" color="colorTextInverseWeaker">
              {loading ? "Downloading..." : "Uploading..."}
            </Text>
          ) : (
            <Text as="p" color="colorTextInverseWeaker">
              {Math.round((size / Math.pow(2, 20)) * 100) / 100} MB
              {!file && type === "view" ? " - Click to download" : ""}
            </Text>
          )}
        </div>

        {onRemove ? (
          <Button 
            variant="link" 
            onClick={onRemove} 
            color="primary" 
            size="sm"
            style={{
              borderRadius:'300px',
              width: 10,
              height: 30,
              position: 'relative',
              top: '-40px'
            }}
          >
            <div 
              style={{
                marginLeft: '-9.2px',
                marginTop: '-2px'
              }}
            >
              <X
                title="Remove file"
                color="white"
                size={20}
              />
            </div>
          </Button>
        ) : null}
      </div>
    );
  }
};

export default MessageFile;

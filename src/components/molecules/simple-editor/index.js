import React, { useEffect, useState } from "react";
// import dynamic from "next/dynamic";
import { ContentState, EditorState, convertFromHTML} from "draft-js";
import { convertToHTML } from "draft-convert";
import {Editor} from "react-draft-wysiwyg";
// const Editor = dynamic(
//   () => import("react-draft-wysiwyg").then(mod => mod.Editor),
//   { ssr: false }
// );
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";

const SimpleEditor = ({classOptionsView, initialContent = null, onChangeContent}) => {

  const [onChangeFired, setOnChangeFired] = useState(false);
  const [editorState, setEditorState] = useState(() => {
    return EditorState.createEmpty();
  }
  );

  useEffect(() => {
    if (!onChangeFired) {
      const blocksFromHTML = convertFromHTML(initialContent);
      const state = ContentState.createFromBlockArray(
        blocksFromHTML?.contentBlocks,
        blocksFromHTML?.entityMap
      );
      setEditorState(EditorState.createWithContent(state));
    }
  }, [initialContent]);

  const handleEditorChange = (state) => {
    setEditorState(state);
    convertContentToHTML();
  };

  const convertContentToHTML = () => {
    const currentContentAsHTML = convertToHTML(editorState.getCurrentContent());
    onChangeContent(currentContentAsHTML);
    setOnChangeFired(true);
  };


  return (
    <div className="App">
      <div style={{ border: "1px solid #ebedec", padding: "2px",  maxHeight: "500px" }}>
        <Editor
          editorState={editorState}
          onEditorStateChange={handleEditorChange}
        />
      </div>
    </div>
  );
};

export default SimpleEditor;

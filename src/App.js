import { useMemo, useRef } from "react";
import axios from "axios";
import ReactQuill from "react-quill";
import "react-quill/dist/quill.snow.css";

function App() {
  const editorRef = useRef(null);
  const imageHandler = (a) => {
    const input = document.createElement("input");
    input.setAttribute("type", "file");
    input.setAttribute("accept", "image/*");
    input.click();

    input.onchange = () => {
      const file = input.files[0];

      // file type is only image.
      if (/^image\//.test(file.type)) {
        saveToServer(file);
      } else {
        console.warn("You could only upload images.");
      }
    };
  };

  function saveToServer(file) {
    const fd = new FormData();

    axios
      .post("http://localhost:3600/image", fd)
      .then((res) => res.json())
      .then((res) => {
        console.log(res);
        const url = res.data["secure_url"];
        insertToEditor(url);
      })
      .catch((err) => console.log(err));
  }

  function insertToEditor(url) {
    editorRef.current.getEditor().insertEmbed(null, "image", url);
  }

  const modules = useMemo(() => ({
    toolbar: {
      container: [["image"]],

      handlers: {
        image: imageHandler,
      },
    },
  }));
  return <ReactQuill modules={modules} forwardedRef={editorRef} />;
}

export default App;

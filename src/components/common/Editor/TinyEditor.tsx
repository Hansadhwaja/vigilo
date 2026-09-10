import { Editor } from "@tinymce/tinymce-react";

interface Props {
  value: string;
  onChange: (v: string) => void;
}

const TinyEditor = ({ value, onChange }: Props) => {
  const apiKey = import.meta.env.VITE_TINY_MCE_API_KEY;
  return (
    <Editor
      apiKey={apiKey}
      init={{
        plugins:
          "anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount",
        toolbar:
          "undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table | align lineheight | numlist bullist indent outdent | emoticons charmap | removeformat",
      }}
      value={value}
      onEditorChange={onChange}
    />
  );
};

export default TinyEditor;

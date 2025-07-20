import { useCallback, useEffect, useRef, useState } from 'react';
import ReactQuill from 'react-quill-new';
import 'react-quill-new/dist/quill.snow.css';
import DOMPurify from 'dompurify';

const QuillEditor = ({
  value = '',
  onChange,
  placeholder,
  className = '',
  height = 400,
  readOnly = false,
  showPreview = false,
}) => {
  const quillRef = useRef();
  const [editorValue, setEditorValue] = useState(value);

  // Initialize DOMPurify
  const sanitize = DOMPurify.sanitize;

  useEffect(() => {
    setEditorValue(value);
  }, [value]);

  const handleChange = useCallback(
    (content, delta, source, editor) => {
      const html = editor.getHTML();
      setEditorValue(html);
      onChange?.(html);
    },
    [onChange]
  );

  const modules = {
    toolbar: readOnly
      ? false
      : [
          ['bold', 'italic', 'underline', 'strike'],
          ['blockquote', 'code-block'],
          [{ header: 1 }, { header: 2 }],
          [{ list: 'ordered' }, { list: 'bullet' }],
          ['link', 'image'],
          ['clean'],
        ],
    clipboard: {
      matchVisual: false,
    },
  };

  const formats = [
    'header',
    'bold',
    'italic',
    'underline',
    'strike',
    'blockquote',
    'list',
    'link',
    'image',
    'code-block',
  ];

  const cleanHtml = sanitize(editorValue || '', {
    ALLOWED_TAGS: [
      'p',
      'br',
      'strong',
      'em',
      'ul',
      'ol',
      'li',
      'a',
      'h1',
      'h2',
      'h3',
      'blockquote',
    ],
    ALLOWED_ATTR: ['href', 'target', 'rel'],
    ADD_ATTR: ['target', 'rel'],
  });

  // Add security attributes to links
  const secureHtml = cleanHtml.replace(
    /<a\s+href=/gi,
    '<a target="_blank" rel="noopener noreferrer" href='
  );

  if (readOnly) {
    return (
      <div
        className={`prose max-w-none ${className}`}
        dangerouslySetInnerHTML={{ __html: secureHtml }}
      />
    );
  }

  return (
    <div className={`rich-text-editor ${className}`}>
      <div style={{ height: `${height}px` }}>
        <ReactQuill
          ref={quillRef}
          value={editorValue}
          onChange={handleChange}
          placeholder={placeholder || 'Write your content here...'}
          theme="snow"
          style={{ height: `${height - 42}px` }}
          modules={modules}
          formats={formats}
        />
      </div>

      {showPreview && (
        <div className="mt-4">
          <h4 className="text-sm font-medium text-gray-700 mb-2">Preview:</h4>
          <div
            className="prose max-w-none border rounded p-3 bg-white"
            dangerouslySetInnerHTML={{ __html: secureHtml }}
          />
        </div>
      )}
    </div>
  );
};

export default QuillEditor;

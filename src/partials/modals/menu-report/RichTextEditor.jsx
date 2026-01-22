import { useState, useEffect, useRef } from "react";
import { EditorContent, useEditor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";
import { Link } from "@tiptap/extension-link";
import { TextAlign } from "@tiptap/extension-text-align";
import Underline from "@tiptap/extension-underline";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableCell } from "@tiptap/extension-table-cell";
import { TableHeader } from "@tiptap/extension-table-header";
import { Translateapi } from "@/services/apiServices";

function RichTextEditor() {
  const [isTranslating, setIsTranslating] = useState(false);
  const [showTableMenu, setShowTableMenu] = useState(false);
  const [tableRows, setTableRows] = useState(3);
  const [tableCols, setTableCols] = useState(3);
  const [showMoreMenu, setShowMoreMenu] = useState(false);
  const [fontSize, setFontSize] = useState("16px");
  const [debounceTimer, setDebounceTimer] = useState(null);

  const [gujaratiContent, setGujaratiContent] = useState("");
  const [hindiContent, setHindiContent] = useState("");

  const editor = useEditor({
    extensions: [
      StarterKit,
      TextStyle,
      Color,
      Underline,
      Highlight.configure({ multicolor: true }),
      Link.configure({
        openOnClick: false,
        HTMLAttributes: { class: "text-blue-600 underline" },
      }),
      TextAlign.configure({ types: ["heading", "paragraph"] }),
      Table.configure({
        resizable: true,
        HTMLAttributes: {
          class: "border-collapse border border-gray-400",
        },
      }),
      TableRow,
      TableHeader,
      TableCell,
    ],
    content: "<p>Start typing here...</p>",
  });
  const guEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: false, // auto-filled
  });

  const hiEditor = useEditor({
    extensions: [StarterKit],
    content: "",
    editable: false,
  });
  if (!editor) return null;

  const insertTable = () => {
    editor
      .chain()
      .focus()
      .insertTable({ rows: tableRows, cols: tableCols, withHeaderRow: true })
      .run();
    setShowTableMenu(false);
  };

  const applyFontSize = (size) => {
    setFontSize(size);
    if (editor) {
      editor.view.dom.style.fontSize = `${size}`;
    }
  };

  const triggerTranslate = (text) => {
    if (!text?.trim()) return;

    if (debounceTimer) clearTimeout(debounceTimer);

    const timer = setTimeout(() => {
      setIsTranslating(true);

      Translateapi(text)
        .then((res) => {
          const gu = res?.data?.gujarati || "";
          const hi = res?.data?.hindi || "";

          setGujaratiContent(gu);
          setHindiContent(hi);

          guEditor?.commands.setContent(`<p>${gu}</p>`);
          hiEditor?.commands.setContent(`<p>${hi}</p>`);
        })
        .catch((err) => console.error("Translation error:", err))
        .finally(() => setIsTranslating(false));
    }, 500);

    setDebounceTimer(timer);
  };
  useEffect(() => {
    if (!editor) return;

    const updateHandler = () => {
      const text = editor.getText();
      triggerTranslate(text);
    };

    editor.on("update", updateHandler);

    return () => {
      editor.off("update", updateHandler);
    };
  }, [editor]);

  return (
    <div className="max-w-6xl mx-auto  bg-gray-50 ">
      <div className="bg-white rounded-lg shadow-xl overflow-hidden">
        {/* Header */}

        {/* Main Toolbar */}
        <div className="bg-gray-100 border-b p-2">
          <div className="flex gap-1 flex-wrap items-center">
            {/* Paragraph/Heading Dropdown */}
            <select
              onChange={(e) => {
                const level = Number(e.target.value);
                if (level === 0) {
                  editor.chain().focus().setParagraph().run();
                } else {
                  editor.chain().focus().toggleHeading({ level }).run();
                }
              }}
              className="px-3 py-1.5 border border-gray-300 rounded bg-white text-sm min-w-[120px]"
            >
              <option value="0">Paragraph</option>
              <option value="1">Heading 1</option>
              <option value="2">Heading 2</option>
              <option value="3">Heading 3</option>
              <option value="4">Heading 4</option>
              <option value="5">Heading 5</option>
              <option value="6">Heading 6</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Bold */}
            <button
              onClick={() => editor.chain().focus().toggleBold().run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive("bold") ? "bg-blue-100" : ""
              }`}
              title="Bold (Ctrl+B)"
            >
              <strong className="text-lg">B</strong>
            </button>

            {/* Italic */}
            <button
              onClick={() => editor.chain().focus().toggleItalic().run()}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive("italic") ? "bg-blue-100" : ""
              }`}
              title="Italic (Ctrl+I)"
            >
              <em className="text-lg">I</em>
            </button>

            {/* Underline Dropdown */}
            <div className="relative">
              <button
                onClick={() => editor.chain().focus().toggleUnderline().run()}
                className={`p-2 rounded hover:bg-gray-200 flex items-center gap-1 ${
                  editor.isActive("underline") ? "bg-blue-100" : ""
                }`}
                title="Underline"
              >
                <u className="text-lg">U</u>
                <span className="text-xs">▼</span>
              </button>
            </div>

            {/* Text Color */}
            <div className="relative">
              <label className="p-2 rounded hover:bg-gray-200 cursor-pointer flex items-center gap-1">
                <span className="text-lg font-bold">A</span>
                <input
                  type="color"
                  onInput={(e) =>
                    editor.chain().focus().setColor(e.target.value).run()
                  }
                  className="w-0 h-0 opacity-0 absolute"
                />
                <span className="text-xs">▼</span>
              </label>
            </div>

            {/* Background Color */}
            <div className="relative">
              <label className="p-2 rounded hover:bg-gray-200 cursor-pointer flex items-center gap-1">
                <span className="text-lg font-bold bg-yellow-300 px-1">A</span>
                <input
                  type="color"
                  onInput={(e) =>
                    editor
                      .chain()
                      .focus()
                      .toggleHighlight({ color: e.target.value })
                      .run()
                  }
                  className="w-0 h-0 opacity-0 absolute"
                />
                <span className="text-xs">▼</span>
              </label>
            </div>

            {/* Font Size */}
            <select
              value={fontSize}
              onChange={(e) => applyFontSize(e.target.value)}
              className="px-2 py-1.5 border border-gray-300 rounded bg-white text-sm"
            >
              <option value="8px">8</option>
              <option value="10px">10</option>
              <option value="12px">12</option>
              <option value="14px">14</option>
              <option value="16px">16</option>
              <option value="18px">18</option>
              <option value="20px">20</option>
              <option value="24px">24</option>
              <option value="28px">28</option>
              <option value="32px">32</option>
              <option value="36px">36</option>
            </select>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Bullet List */}
            <div className="relative">
              <button
                onClick={() => editor.chain().focus().toggleBulletList().run()}
                className={`p-2 rounded hover:bg-gray-200 flex items-center gap-1 ${
                  editor.isActive("bulletList") ? "bg-blue-100" : ""
                }`}
                title="Bullet List"
              >
                <span className="text-lg">•</span>
                <span className="text-xs">▼</span>
              </button>
            </div>

            {/* Numbered List */}
            <div className="relative">
              <button
                onClick={() => editor.chain().focus().toggleOrderedList().run()}
                className={`p-2 rounded hover:bg-gray-200 flex items-center gap-1 ${
                  editor.isActive("orderedList") ? "bg-blue-100" : ""
                }`}
                title="Numbered List"
              >
                <span className="text-lg">1.</span>
                <span className="text-xs">▼</span>
              </button>
            </div>

            <div className="w-px h-6 bg-gray-300 mx-1"></div>

            {/* Decrease Indent */}

            {/* Increase Indent */}

            {/* Link */}
            <button
              onClick={() => {
                const url = window.prompt("Enter URL:");
                if (url) editor.chain().focus().setLink({ href: url }).run();
              }}
              className={`p-2 rounded hover:bg-gray-200 ${
                editor.isActive("link") ? "bg-blue-100" : ""
              }`}
              title="Insert Link"
            >
              <span className="text-lg">🔗</span>
            </button>
            <div className="bg-gray-50 border-b p-2">
              <div className="flex gap-1 flex-wrap items-center">
                {/* Quote */}

                {/* Table */}

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Align Left */}
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("left").run()
                  }
                  className={`px-3 py-1.5 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: "left" }) ? "bg-blue-100" : ""
                  }`}
                  title="Align Left"
                >
                  ≡
                </button>

                {/* Align Center */}
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("center").run()
                  }
                  className={`px-3 py-1.5 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: "center" })
                      ? "bg-blue-100"
                      : ""
                  }`}
                  title="Align Center"
                >
                  ≣
                </button>

                {/* Align Right */}
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("right").run()
                  }
                  className={`px-3 py-1.5 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: "right" }) ? "bg-blue-100" : ""
                  }`}
                  title="Align Right"
                >
                  ≡
                </button>

                {/* Justify */}
                <button
                  onClick={() =>
                    editor.chain().focus().setTextAlign("justify").run()
                  }
                  className={`px-3 py-1.5 rounded hover:bg-gray-200 ${
                    editor.isActive({ textAlign: "justify" })
                      ? "bg-blue-100"
                      : ""
                  }`}
                  title="Justify"
                >
                  ≣
                </button>

                <div className="w-px h-6 bg-gray-300 mx-1"></div>

                {/* Undo */}
                <button
                  onClick={() => editor.chain().focus().undo().run()}
                  disabled={!editor.can().undo()}
                  className="px-3 py-1.5 rounded hover:bg-gray-200 disabled:opacity-30"
                  title="Undo"
                >
                  ↶
                </button>

                {/* Redo */}
                <button
                  onClick={() => editor.chain().focus().redo().run()}
                  disabled={!editor.can().redo()}
                  className="px-3 py-1.5 rounded hover:bg-gray-200 disabled:opacity-30"
                  title="Redo"
                >
                  ↷
                </button>

                <div className="flex-1"></div>
              </div>
            </div>
            {/* More Options */}
          </div>
        </div>

        {/* Secondary Toolbar */}

        {/* Editor Content */}
        <div className="bg-white max-h-[300px] overflow-y-auto">
          <EditorContent
            editor={editor}
            className="prose max-w-none focus:outline-none"
            style={{ fontSize }}
          />
        </div>

        {/* Footer Stats */}
        <div className="bg-gray-50 border-t p-3 flex justify-between text-sm text-gray-600">
          <span>
            Words: {editor.getText().split(/\s+/).filter(Boolean).length}
          </span>
          <span>Characters: {editor.getText().length}</span>
        </div>

        {/* Styles */}
        <style jsx>{`
          :global(.ProseMirror) {
            outline: none;
          }
          :global(.ProseMirror strong) {
            font-weight: bold;
          }
          :global(.ProseMirror em) {
            font-style: italic;
          }
          :global(.ProseMirror u) {
            text-decoration: underline;
          }
          :global(.ProseMirror s) {
            text-decoration: line-through;
          }
          :global(.ProseMirror ul) {
            list-style-type: disc;
            padding-left: 1.5rem;
            margin: 0.75rem 0;
          }
          :global(.ProseMirror ol) {
            list-style-type: decimal;
            padding-left: 1.5rem;
            margin: 0.75rem 0;
          }
          :global(.ProseMirror li) {
            margin: 0.25rem 0;
          }
          :global(.ProseMirror h1) {
            font-size: 2em;
            font-weight: bold;
            margin: 1rem 0;
          }
          :global(.ProseMirror h2) {
            font-size: 1.5em;
            font-weight: bold;
            margin: 0.875rem 0;
          }
          :global(.ProseMirror h3) {
            font-size: 1.25em;
            font-weight: bold;
            margin: 0.75rem 0;
          }
          :global(.ProseMirror h4) {
            font-size: 1.1em;
            font-weight: bold;
            margin: 0.5rem 0;
          }
          :global(.ProseMirror h5) {
            font-size: 1em;
            font-weight: bold;
            margin: 0.5rem 0;
          }
          :global(.ProseMirror h6) {
            font-size: 0.9em;
            font-weight: bold;
            margin: 0.5rem 0;
          }
          :global(.ProseMirror blockquote) {
            border-left: 4px solid #d1d5db;
            padding-left: 1rem;
            margin: 1rem 0;
            color: #6b7280;
            font-style: italic;
          }
          :global(.ProseMirror code) {
            background-color: #f3f4f6;
            padding: 0.125rem 0.25rem;
            border-radius: 3px;
            font-family: monospace;
            font-size: 0.9em;
          }
          :global(.ProseMirror pre) {
            background-color: #1f2937;
            color: #f9fafb;
            padding: 1rem;
            border-radius: 0.5rem;
            overflow-x: auto;
            margin: 1rem 0;
          }
          :global(.ProseMirror pre code) {
            background: none;
            color: inherit;
            padding: 0;
          }
          :global(.ProseMirror hr) {
            border: none;
            border-top: 2px solid #e5e7eb;
            margin: 2rem 0;
          }
          :global(.ProseMirror mark) {
            background-color: #fef08a;
            padding: 0.125rem 0.25rem;
          }
          :global(.ProseMirror table) {
            border-collapse: collapse;
            table-layout: fixed;
            width: 100%;
            margin: 1rem 0;
            overflow: hidden;
          }
          :global(.ProseMirror td),
          :global(.ProseMirror th) {
            border: 2px solid #d1d5db;
            padding: 0.5rem;
            vertical-align: top;
            box-sizing: border-box;
            position: relative;
            min-width: 100px;
          }
          :global(.ProseMirror th) {
            background-color: #f3f4f6;
            font-weight: bold;
            text-align: left;
          }
          :global(.ProseMirror .selectedCell) {
            background-color: #e0e7ff;
          }
          :global(.ProseMirror td),
          :global(.ProseMirror th) {
            max-height: 60px;
            overflow: hidden;
            text-overflow: ellipsis;
            white-space: nowrap;
          }
        `}</style>
      </div>
    </div>
  );
}

export default RichTextEditor;

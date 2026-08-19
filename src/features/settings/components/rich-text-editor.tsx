"use client";

import { useRef, useEffect } from "react";
import {
  Bold,
  Italic,
  Underline,
  List,
  ListOrdered,
  AlignLeft,
  AlignCenter,
} from "lucide-react";

interface RichTextEditorProps {
  value: string;
  onChange: (val: string) => void;
}

export function RichTextEditor({ value, onChange }: RichTextEditorProps) {
  const editorRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (editorRef.current && editorRef.current.innerHTML !== value) {
      editorRef.current.innerHTML = value;
    }
  }, [value]);

  const execCommand = (command: string, valueArg: string | undefined = undefined) => {
    document.execCommand(command, false, valueArg);
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  const handleInput = () => {
    if (editorRef.current) {
      onChange(editorRef.current.innerHTML);
    }
  };

  return (
    <div className="rounded-2xl border border-gray-200 bg-white overflow-hidden shadow-2xs">
      {/* Editor Toolbar matching reference screenshot */}
      <div className="flex flex-wrap items-center gap-4 px-5 py-3 border-b border-gray-100 bg-gray-50/70 text-gray-600 text-xs">
        {/* Font Selector */}
        <select
          onChange={(e) => execCommand("fontName", e.target.value)}
          className="bg-transparent font-semibold text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="Poppins">Poppins</option>
          <option value="Inter">Inter</option>
          <option value="Arial">Arial</option>
          <option value="Times New Roman">Times New Roman</option>
        </select>

        <div className="h-4 w-px bg-gray-200" />

        {/* Size Selector */}
        <select
          onChange={(e) => execCommand("fontSize", e.target.value)}
          className="bg-transparent font-semibold text-gray-700 focus:outline-none cursor-pointer"
        >
          <option value="3">14px</option>
          <option value="4">16px</option>
          <option value="5">18px</option>
          <option value="6">24px</option>
          <option value="7">32px</option>
        </select>

        <div className="h-4 w-px bg-gray-200" />

        {/* Formatting Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => execCommand("bold")}
            className="p-1 hover:bg-gray-200/70 rounded text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            title="Bold"
          >
            <Bold className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("italic")}
            className="p-1 hover:bg-gray-200/70 rounded text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            title="Italic"
          >
            <Italic className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("underline")}
            className="p-1 hover:bg-gray-200/70 rounded text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            title="Underline"
          >
            <Underline className="h-4 w-4" />
          </button>
        </div>

        <div className="h-4 w-px bg-gray-200" />

        {/* List & Alignment Buttons */}
        <div className="flex items-center gap-3">
          <button
            type="button"
            onClick={() => execCommand("insertUnorderedList")}
            className="p-1 hover:bg-gray-200/70 rounded text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            title="Bullet List"
          >
            <List className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("insertOrderedList")}
            className="p-1 hover:bg-gray-200/70 rounded text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            title="Numbered List"
          >
            <ListOrdered className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyLeft")}
            className="p-1 hover:bg-gray-200/70 rounded text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            title="Align Left"
          >
            <AlignLeft className="h-4 w-4" />
          </button>
          <button
            type="button"
            onClick={() => execCommand("justifyCenter")}
            className="p-1 hover:bg-gray-200/70 rounded text-gray-700 hover:text-gray-900 transition-colors cursor-pointer"
            title="Align Center"
          >
            <AlignCenter className="h-4 w-4" />
          </button>
        </div>
      </div>

      {/* Interactive contentEditable Div with pre-wrap whitespace for perfect line breaks & paragraph spacing */}
      <div
        ref={editorRef}
        contentEditable
        onInput={handleInput}
        className="w-full min-h-[350px] p-6 text-xs md:text-sm text-gray-700 leading-relaxed focus:outline-none font-normal overflow-y-auto whitespace-pre-wrap space-y-3"
      />
    </div>
  );
}

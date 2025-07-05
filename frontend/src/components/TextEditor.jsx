import { useEditor, EditorContent, mergeAttributes } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import Toolbar from "./subComponents/Toolbar";
import { useCallback, useEffect } from "react";
import Link from "@tiptap/extension-link";
import Heading from "@tiptap/extension-heading";

export default function TextEditor({ description, onChange, placeholder, resetEditor, notUpd }) {
  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        heading: false,
        blockquote: {
          HTMLAttributes: {
            class: "my-custom-class",
          },
        },
      }),

      Heading.extend({
        levels: [2, 4],
        renderHTML({ node, HTMLAttributes }) {
          const level = this.options.levels.includes(node.attrs.level)
            ? node.attrs.level
            : this.options.levels[0];

          const classes = {
            2: "text-2xl font-[600]",
            4: "text-lg font-[500]",
          };

          return [
            `h${level}`,
            mergeAttributes(this.options.HTMLAttributes, HTMLAttributes, {
              class: classes[level],
            }),
            0,
          ];
        },
      }).configure({ levels: [2, 4] }),

      Link.configure({
        openOnClick: true,
        autolink: true,
        defaultProtocol: "https",
      }),

      Placeholder.configure({
        placeholder,
      }),
    ],
    content: description || "",
    editorProps: {
      attributes: {
        class:
          "w-full min-h-[194px] .tiptap resize-none rounded-xl py-[10px] px-3 bg-[#212121] tracking-wide font-main border-[1px] border-[#ffffff05] transition-colors duration-[250ms] font-[300] outline-0",
      },
    },
    onUpdate({ editor }) {
      onChange(editor.getHTML());
    },
  });

  useEffect(() => {
    if (editor && description) editor.commands.setContent(description);
  }, [editor, notUpd ? null : description]);

  useEffect(() => {
    if (resetEditor) {
      editor.commands.clearContent();
    }
  }, [resetEditor, editor]);

  const setLink = useCallback(() => {
    const previousUrl = editor.getAttributes("link").href;
    const url = window.prompt("URL", previousUrl);

    // cancelled
    if (url === null) {
      return;
    }

    // empty
    if (url === "") {
      editor.chain().focus().extendMarkRange("link").unsetLink().run();

      return;
    }

    // update link
    try {
      editor
        .chain()
        .focus()
        .extendMarkRange("link")
        .setLink({ href: url })
        .run();
    } catch (e) {
      alert(e.message);
    }
  }, [editor]);

  return (
    <div className="flex flex-col justify-stretch gap-2">
      <div className="flex sm:flex-row flex-col sm:justify-between w-full h-auto gap-1.5 sm:gap-5">
        <label
          className={`text-white text-sm font-[300] leading-[16.8px] font-main tracking-wide flex sm:justify-center items-center`}
        >
          Description
        </label>
        <Toolbar editor={editor} setLink={setLink} />
      </div>
      <EditorContent editor={editor} />
    </div>
  );
}
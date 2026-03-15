"use client";

import { BlockNoteSchema, defaultBlockSpecs } from "@blocknote/core";
import { 
  createReactBlockSpec, 
  useCreateBlockNote,
} from "@blocknote/react";
import { BlockNoteView } from "@blocknote/mantine";
import "@blocknote/core/fonts/inter.css";
import "@blocknote/mantine/style.css";
import dynamic from "next/dynamic";
import { useMemo } from "react";
import * as PhosphorIcons from "@phosphor-icons/react";

// Dynamically import ExcalidrawWrapper
const ExcalidrawWrapper = dynamic(() => import("../visual/excalidraw-wrapper"), {
  ssr: false,
});

// Define the custom Excalidraw block
const ExcalidrawBlock = createReactBlockSpec(
  {
    type: "excalidraw",
    propSchema: {
      data: {
        default: "{}",
      },
    },
    content: "none",
  },
  {
    render: (props: any) => {
      return (
        <div className="my-4">
          <ExcalidrawWrapper
            initialData={props.block.props.data}
            onChange={(data) => {
              props.editor.updateBlock(props.block, {
                props: { ...props.block.props, data },
              });
            }}
            isEditable={props.editor.isEditable}
          />
        </div>
      );
    },
  }
);

// Create the schema
const schema = BlockNoteSchema.create({
  blockSpecs: {
    ...defaultBlockSpecs,
    excalidraw: ExcalidrawBlock(),
  },
});

interface EditorProps {
  initialContent?: string;
  onChange: (content: string) => void;
  editable?: boolean;
}

export default function Editor({ initialContent, onChange, editable = true }: EditorProps) {
  const editor = useCreateBlockNote({
    schema,
    initialContent: initialContent ? JSON.parse(initialContent) : undefined,
  });

  return (
    <div className="min-h-[400px] bg-background border border-border rounded-lg overflow-hidden font-sans">
      <BlockNoteView
        editor={editor}
        editable={editable}
        theme="dark"
        onChange={() => {
          onChange(JSON.stringify(editor.document));
        }}
      />
    </div>
  );
}

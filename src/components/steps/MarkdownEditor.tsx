import React, { useState } from "react";
import { useWizard } from "../../context/WizardContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card } from "../ui/Card";
import {
  Bold,
  Italic,
  List,
  Link as LinkIcon,
  Variable,
  Eye,
  ChevronLeft,
  ChevronRight,
  Hash,
} from "lucide-react";
import { marked } from "marked";
import DOMPurify from "dompurify";

export function MarkdownEditor() {
  const { state, dispatch } = useWizard();
  const [showPreview, setShowPreview] = useState(false);

  const availableVariables = React.useMemo(() => {
    const standard = ["email", "name"];
    if (state.recipients.length > 0) {
      const first = state.recipients[0];
      return Array.from(
        new Set([...standard, ...Object.keys(first).filter((k) => k !== "id")]),
      );
    }
    return standard;
  }, [state.recipients]);

  const insertVariable = (varName: string) => {
    const textarea = document.getElementById(
      "email-editor",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = state.emailContent;
    const insertion = `{{${varName}}}`;

    const newText = text.substring(0, start) + insertion + text.substring(end);

    dispatch({ type: "UPDATE_EMAIL_CONTENT", payload: newText });

    setTimeout(() => {
      textarea.focus();
      textarea.setSelectionRange(
        start + insertion.length,
        start + insertion.length,
      );
    }, 0);
  };

  const insertMarkdown = (syntax: string) => {
    const textarea = document.getElementById(
      "email-editor",
    ) as HTMLTextAreaElement;
    if (!textarea) return;

    const start = textarea.selectionStart;
    const end = textarea.selectionEnd;
    const text = state.emailContent;

    let insertion = "";
    // let offset = 0; // Unused for now

    switch (syntax) {
      case "bold":
        insertion = `**${text.substring(start, end) || "bold text"}**`;
        // offset = 2;
        break;
      case "italic":
        insertion = `*${text.substring(start, end) || "italic text"}*`;
        // offset = 1;
        break;
      case "list":
        insertion = `\n- ${text.substring(start, end) || "item"}`;
        // offset = 3;
        break;
      case "h1":
        insertion = `\n# ${text.substring(start, end) || "Heading"}`;
        // offset = 3;
        break;
      case "link":
        insertion = `[${text.substring(start, end) || "link text"}](url)`;
        // offset = 1;
        break;
      default:
        return;
    }

    const newText = text.substring(0, start) + insertion + text.substring(end);
    dispatch({ type: "UPDATE_EMAIL_CONTENT", payload: newText });
  };

  const renderPreview = () => {
    const html = DOMPurify.sanitize(marked.parse(state.emailContent) as string);
    return { __html: html };
  };

  return (
    <div className="space-y-6 h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Write Your Email</h2>
        <p className="text-slate-500">
          Draft your message using Markdown and personalized variables.
        </p>
      </div>

      <div className="space-y-4 flex-1 flex flex-col">
        <Input
          label="Email Subject"
          placeholder="e.g. Special Offer for {{name}}!"
          value={state.subject}
          onChange={(e) =>
            dispatch({ type: "UPDATE_SUBJECT", payload: e.target.value })
          }
        />

        <Card className="flex-1 flex flex-col overflow-hidden shadow-sm border-slate-300">
          <div className="flex items-center gap-1 p-2 border-b border-slate-200 bg-slate-50">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown("h1")}
              title="Heading"
            >
              <Hash className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown("bold")}
              title="Bold"
            >
              <Bold className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown("italic")}
              title="Italic"
            >
              <Italic className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown("list")}
              title="List"
            >
              <List className="w-4 h-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => insertMarkdown("link")}
              title="Link"
            >
              <LinkIcon className="w-4 h-4" />
            </Button>

            <div className="w-px h-6 bg-slate-300 mx-1" />

            <div className="relative group">
              <Button
                variant="ghost"
                size="sm"
                className="text-blue-600 hover:bg-blue-50"
              >
                <Variable className="w-4 h-4 mr-1" /> Insert Variable
              </Button>
              <div className="absolute top-full left-0 mt-1 w-48 bg-white rounded-md shadow-lg border border-slate-200 py-1 hidden group-hover:block z-10">
                {availableVariables.map((v) => (
                  <button
                    key={v}
                    onClick={() => insertVariable(v)}
                    className="w-full text-left px-4 py-2 text-sm hover:bg-slate-50 text-slate-700"
                  >
                    {`{{${v}}}`}
                  </button>
                ))}
              </div>
            </div>

            <div className="ml-auto">
              <Button
                variant={showPreview ? "secondary" : "ghost"}
                size="sm"
                onClick={() => setShowPreview(!showPreview)}
              >
                <Eye className="w-4 h-4 mr-2" />
                {showPreview ? "Edit Mode" : "Preview"}
              </Button>
            </div>
          </div>

          <div className="flex-1 relative">
            {showPreview ? (
              <div
                className="absolute inset-0 p-4 prose prose-slate max-w-none overflow-y-auto"
                dangerouslySetInnerHTML={renderPreview()}
              />
            ) : (
              <textarea
                id="email-editor"
                className="w-full h-full p-4 resize-none outline-none font-mono text-sm"
                placeholder="Hi {{name}},&#10;&#10;Use markdown to write your content..."
                value={state.emailContent}
                onChange={(e) =>
                  dispatch({
                    type: "UPDATE_EMAIL_CONTENT",
                    payload: e.target.value,
                  })
                }
              />
            )}
          </div>
        </Card>

        <div className="flex justify-between pt-2">
          <Button
            variant="outline"
            onClick={() => dispatch({ type: "PREV_STEP" })}
          >
            <ChevronLeft className="w-4 h-4 mr-2" /> Back
          </Button>
          <Button onClick={() => dispatch({ type: "NEXT_STEP" })}>
            Next: Signature <ChevronRight className="w-4 h-4 ml-2" />
          </Button>
        </div>
      </div>
    </div>
  );
}

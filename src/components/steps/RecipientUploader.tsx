import React, { useState, useCallback } from "react";
import Papa, { type ParseResult } from "papaparse";
import * as XLSX from "xlsx";
import { useWizard } from "../../context/WizardContext";
import { Button } from "../ui/Button";
import { Card, CardContent } from "../ui/Card";
import { Input } from "../ui/Input";
import { ConfirmationModal } from "../ui/ConfirmationModal";
import {
  Upload,
  FileSpreadsheet,
  Trash2,
  CheckCircle,
  AlertCircle,
  Users,
  UserPlus,
} from "lucide-react";
import { cn } from "../../lib/utils";
import type { Recipient } from "../../types";

export function RecipientUploader() {
  const { state, dispatch } = useWizard();
  const [isDragging, setIsDragging] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [manualEntry, setManualEntry] = useState({ name: "", email: "" });
  const [showManualInput, setShowManualInput] = useState(false);
  const [showClearConfirm, setShowClearConfirm] = useState(false);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  }, []);

  const processFile = async (file: File) => {
    setIsLoading(true);
    setError(null);

    try {
      if (file.type === "text/csv" || file.name.endsWith(".csv")) {
        Papa.parse(file, {
          header: true,
          skipEmptyLines: true,
          complete: (results: ParseResult<Record<string, string>>) => {
            processData(results.data);
          },
          error: (err: Error) => {
            setError(`CSV Error: ${err.message}`);
            setIsLoading(false);
          },
        });
      } else if (file.name.endsWith(".xlsx") || file.name.endsWith(".xls")) {
        const reader = new FileReader();
        reader.onload = (e) => {
          const data = new Uint8Array(e.target?.result as ArrayBuffer);
          const workbook = XLSX.read(data, { type: "array" });
          const sheetName = workbook.SheetNames[0];
          const worksheet = workbook.Sheets[sheetName];
          const jsonData = XLSX.utils.sheet_to_json(worksheet) as Record<
            string,
            string
          >[];
          processData(jsonData);
        };
        reader.readAsArrayBuffer(file);
      } else {
        setError("Unsupported file type. Please upload a CSV or Excel file.");
        setIsLoading(false);
      }
    } catch (err) {
      setError("Failed to process file.");
      setIsLoading(false);
      console.error(err);
    }
  };

  const processData = (data: Record<string, string>[]) => {
    if (data.length === 0) {
      setError("The file appears to be empty.");
      setIsLoading(false);
      return;
    }

    const headers = Object.keys(data[0]);

    const recipients: Recipient[] = data.map((row, index) => {
      const emailKey =
        headers.find((h) => h.toLowerCase().includes("email")) ||
        headers.find((h) => row[h]?.toString().includes("@"));

      const nameKey = headers.find((h) => h.toLowerCase().includes("name"));

      const email = emailKey ? row[emailKey]?.toString().trim() : "";

      const recipient: Recipient = {
        id: `rec-${index}-${Date.now()}`,
        email: email,
        name: nameKey ? row[nameKey]?.toString().trim() : "",
        ...row,
      };

      return recipient;
    });

    const validCount = recipients.filter(
      (r) => r.email && r.email.includes("@"),
    ).length;

    if (validCount === 0) {
      setError(
        "No valid email addresses found. Please check your file columns.",
      );
    } else {
      dispatch({ type: "SET_RECIPIENTS", payload: recipients });
    }

    setIsLoading(false);
  };

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) processFile(file);
  }, []);

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) processFile(file);
  };

  const clearRecipients = () => {
    dispatch({ type: "SET_RECIPIENTS", payload: [] });
    setShowClearConfirm(false);
  };

  const addManualRecipient = () => {
    if (!manualEntry.email || !manualEntry.email.includes("@")) {
      setError("Please enter a valid email address.");
      return;
    }

    const newRecipient: Recipient = {
      id: `manual-${Date.now()}`,
      email: manualEntry.email,
      name: manualEntry.name,
    };

    dispatch({
      type: "SET_RECIPIENTS",
      payload: [...state.recipients, newRecipient],
    });
    setManualEntry({ name: "", email: "" });
    setError(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h2 className="text-2xl font-bold bg-gradient-to-r from-slate-900 to-slate-700 bg-clip-text text-transparent">
            Import Contacts
          </h2>
          <p className="text-slate-500">
            Upload a CSV or Excel file with your recipient list.
          </p>
        </div>
        {state.recipients.length > 0 && (
          <Button
            variant="outline"
            onClick={() => setShowClearConfirm(true)}
            className="text-red-500 hover:text-red-600 hover:bg-red-50 border-slate-200 w-full sm:w-auto"
          >
            <Trash2 className="w-4 h-4 mr-2" />
            Clear List
          </Button>
        )}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {/* File Upload Zone */}
        {state.recipients.length === 0 && !showManualInput ? (
          <Card
            className={cn(
              "border-2 border-dashed transition-all duration-200 cursor-pointer overflow-hidden group",
              isDragging
                ? "border-blue-500 bg-blue-50/50"
                : "border-slate-300 hover:border-blue-400 hover:bg-slate-50",
              error ? "border-red-300 bg-red-50" : "",
            )}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            onClick={() => document.getElementById("file-upload")?.click()}
          >
            <CardContent className="flex flex-col items-center justify-center py-16 text-center">
              <div
                className={cn(
                  "w-16 h-16 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-110 duration-200",
                  isDragging
                    ? "bg-blue-100 text-blue-600"
                    : "bg-slate-100 text-slate-400",
                )}
              >
                <Upload className="w-8 h-8" />
              </div>
              <h3 className="text-lg font-semibold text-slate-900 mb-1">
                Drag & Drop or Click to Upload
              </h3>
              <p className="text-slate-500 text-sm max-w-sm mx-auto mb-6">
                Support for .csv and .xlsx files. Auto-detection of Name and
                Email columns.
              </p>
              <Button
                variant="secondary"
                onClick={(e) => {
                  e.stopPropagation();
                  document.getElementById("file-upload")?.click();
                }}
              >
                <FileSpreadsheet className="w-4 h-4 mr-2" />
                Select File
              </Button>
              <input
                id="file-upload"
                type="file"
                className="hidden"
                accept=".csv,.xlsx,.xls"
                onChange={handleFileSelect}
              />
              {error && (
                <div className="mt-4 flex items-center text-red-600 text-sm bg-red-100 px-4 py-2 rounded-full">
                  <AlertCircle className="w-4 h-4 mr-2" />
                  {error}
                </div>
              )}
              {isLoading && (
                <p className="mt-4 text-sm text-blue-600 animate-pulse">
                  Processing file...
                </p>
              )}
            </CardContent>
          </Card>
        ) : null}

        <Card
          className={cn(
            "border-2 border-dashed border-slate-200 hover:border-blue-300 transition-all",
            showManualInput ? "border-blue-400 bg-blue-50/30" : "",
          )}
        >
          <CardContent className="flex flex-col items-center justify-center py-12 text-center h-full">
            {showManualInput ? (
              <div className="w-full max-w-xs space-y-3">
                <h3 className="font-semibold text-slate-800">Add Recipient</h3>
                <Input
                  placeholder="Name (Optional)"
                  value={manualEntry.name}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, name: e.target.value })
                  }
                  className="bg-white"
                />
                <Input
                  placeholder="Email Address"
                  value={manualEntry.email}
                  onChange={(e) =>
                    setManualEntry({ ...manualEntry, email: e.target.value })
                  }
                  className="bg-white"
                />
                <div className="flex gap-2 pt-2">
                  <Button
                    variant="secondary"
                    size="sm"
                    className="flex-1"
                    onClick={() => setShowManualInput(false)}
                  >
                    Cancel
                  </Button>
                  <Button
                    size="sm"
                    className="flex-1"
                    onClick={addManualRecipient}
                  >
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <div
                className="cursor-pointer w-full h-full flex flex-col items-center justify-center"
                onClick={() => setShowManualInput(true)}
              >
                <div className="w-12 h-12 rounded-full bg-slate-100 text-slate-400 flex items-center justify-center mb-3 group-hover:bg-blue-100 group-hover:text-blue-600">
                  <UserPlus className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-semibold text-slate-700">
                  Add Manually
                </h3>
                <p className="text-slate-500 text-sm">
                  Type in name and email one by one.
                </p>
              </div>
            )}
          </CardContent>
        </Card>
      </div>

      {state.recipients.length > 0 && (
        <div className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <Card className="bg-green-50/50 border-green-100 shadow-none">
              <CardContent className="p-4 flex items-center">
                <div className="w-10 h-10 rounded-full bg-green-100 text-green-600 flex items-center justify-center mr-3">
                  <Users className="w-5 h-5" />
                </div>
                <div>
                  <p className="text-sm text-green-600 font-medium">
                    Total Recipients
                  </p>
                  <p className="text-2xl font-bold text-green-700">
                    {state.recipients.length}
                  </p>
                </div>
              </CardContent>
            </Card>
            {/* Add more stats if needed */}
          </div>

          <Card className="overflow-hidden">
            <div className="overflow-x-auto max-h-[400px]">
              <table className="w-full text-sm text-left">
                <thead className="text-xs text-slate-500 uppercase bg-slate-50 sticky top-0">
                  <tr>
                    <th className="px-6 py-3">Name</th>
                    <th className="px-6 py-3">Email</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100">
                  {state.recipients.slice(0, 100).map((recipient) => (
                    <tr
                      key={recipient.id}
                      className="bg-white hover:bg-slate-50"
                    >
                      <td className="px-6 py-3 font-medium text-slate-900">
                        {recipient.name || "-"}
                      </td>
                      <td className="px-6 py-3 text-slate-500">
                        {recipient.email}
                        {!recipient.email.includes("@") && (
                          <span className="ml-2 text-xs text-red-500 font-bold">
                            !
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            <div className="bg-slate-50 p-3 text-xs text-center text-slate-500 border-t border-slate-100">
              Showing first 100 recipients.
            </div>
          </Card>

          <div className="flex justify-end pt-4 mb-4">
            <Button
              onClick={() => dispatch({ type: "NEXT_STEP" })}
              className="w-full md:w-auto"
            >
              Continue to Content <CheckCircle className="w-4 h-4 ml-2" />
            </Button>
          </div>
        </div>
      )}

      <ConfirmationModal
        isOpen={showClearConfirm}
        onClose={() => setShowClearConfirm(false)}
        onConfirm={clearRecipients}
        title="Clear Subscriber List?"
        description="Are you sure you want to remove all recipients? This action cannot be undone."
        confirmLabel="Yes, Clear List"
        variant="danger"
      />
    </div>
  );
}

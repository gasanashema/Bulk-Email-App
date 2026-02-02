import { useWizard } from "../../context/WizardContext";
import { Button } from "../ui/Button";
import { Input } from "../ui/Input";
import { Card, CardContent } from "../ui/Card";
import { ChevronLeft, ChevronRight, LayoutTemplate } from "lucide-react";
import { cn } from "../../lib/utils";

export function BrandingManager() {
  const { state, dispatch } = useWizard();

  const themes = [
    { id: "modern", name: "Modern", color: "#3b82f6" },
    { id: "corporate", name: "Corporate", color: "#1e293b" },
    { id: "minimal", name: "Minimal", color: "#64748b" },
  ];

  return (
    <div className="space-y-8 max-w-4xl mx-auto h-full flex flex-col">
      <div>
        <h2 className="text-2xl font-bold text-slate-900">Branding & Footer</h2>
        <p className="text-slate-500">
          Customize looks and add compliance details.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 flex-1">
        {/* Controls Side */}
        <div className="space-y-6 overflow-y-auto pr-2">
          {/* Visual Identity */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center gap-2 mb-2">
                <LayoutTemplate className="w-5 h-5 text-slate-400" />
                <h3 className="font-semibold text-slate-800">
                  Visual Identity
                </h3>
              </div>

              <div className="space-y-3">
                <label className="text-sm font-medium text-slate-700">
                  Theme Preset
                </label>
                <div className="grid grid-cols-3 gap-2">
                  {themes.map((t) => (
                    <button
                      key={t.id}
                      onClick={() => {
                        dispatch({
                          type: "UPDATE_BRANDING",
                          payload: {
                            theme: t.id as any,
                            primaryColor:
                              t.id === "corporate" ? "#0f172a" : t.color,
                          },
                        });
                      }}
                      className={cn(
                        "flex flex-col items-center justify-center p-3 rounded-lg border text-sm transition-all",
                        state.branding.theme === t.id
                          ? "border-blue-500 bg-blue-50 text-blue-700 font-medium ring-2 ring-blue-100"
                          : "border-slate-200 hover:border-slate-300 text-slate-600",
                      )}
                    >
                      <div
                        className="w-6 h-6 rounded-full mb-2"
                        style={{ backgroundColor: t.color }}
                      />
                      {t.name}
                    </button>
                  ))}
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Primary Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                      value={state.branding.primaryColor}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_BRANDING",
                          payload: { primaryColor: e.target.value },
                        })
                      }
                    />
                    <span className="text-sm font-mono text-slate-500">
                      {state.branding.primaryColor}
                    </span>
                  </div>
                </div>
                <div>
                  <label className="text-sm font-medium text-slate-700 mb-1 block">
                    Button Color
                  </label>
                  <div className="flex items-center gap-2">
                    <input
                      type="color"
                      className="w-10 h-10 rounded cursor-pointer border-0 p-0"
                      value={state.branding.buttonColor}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_BRANDING",
                          payload: { buttonColor: e.target.value },
                        })
                      }
                    />
                    <span className="text-sm font-mono text-slate-500">
                      {state.branding.buttonColor}
                    </span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Footer Details */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">Company Footer</h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={state.footer.enabled}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FOOTER",
                        payload: { enabled: e.target.checked },
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {state.footer.enabled && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Input
                    label="Company Name"
                    placeholder="Legal Entity Name"
                    value={state.footer.companyName}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FOOTER",
                        payload: { companyName: e.target.value },
                      })
                    }
                  />
                  <Input
                    label="Physical Address"
                    placeholder="123 Business St, City, Country"
                    value={state.footer.address}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_FOOTER",
                        payload: { address: e.target.value },
                      })
                    }
                  />
                  <div className="grid grid-cols-2 gap-3">
                    <Input
                      label="Support Email"
                      placeholder="help@example.com"
                      value={state.footer.supportEmail}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_FOOTER",
                          payload: { supportEmail: e.target.value },
                        })
                      }
                    />
                    <Input
                      label="Website"
                      placeholder="www.example.com"
                      value={state.footer.website}
                      onChange={(e) =>
                        dispatch({
                          type: "UPDATE_FOOTER",
                          payload: { website: e.target.value },
                        })
                      }
                    />
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Call to Action configuration */}
          <Card>
            <CardContent className="p-6 space-y-4">
              <div className="flex items-center justify-between mb-2">
                <h3 className="font-semibold text-slate-800">
                  Call to Action (CTA)
                </h3>
                <label className="relative inline-flex items-center cursor-pointer">
                  <input
                    type="checkbox"
                    className="sr-only peer"
                    checked={state.branding.ctaEnabled}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_BRANDING",
                        payload: { ctaEnabled: e.target.checked },
                      })
                    }
                  />
                  <div className="w-11 h-6 bg-slate-200 peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-blue-300 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-slate-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-blue-600"></div>
                </label>
              </div>

              {state.branding.ctaEnabled && (
                <div className="space-y-3 animate-in fade-in slide-in-from-top-2 duration-200">
                  <Input
                    label="Button Text"
                    placeholder="e.g. Learn More"
                    value={state.branding.ctaText}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_BRANDING",
                        payload: { ctaText: e.target.value },
                      })
                    }
                  />
                  <Input
                    label="Button URL"
                    placeholder="https://example.com"
                    value={state.branding.ctaUrl}
                    onChange={(e) =>
                      dispatch({
                        type: "UPDATE_BRANDING",
                        payload: { ctaUrl: e.target.value },
                      })
                    }
                  />
                </div>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Preview Side */}
        <div className="hidden lg:block bg-slate-200 rounded-xl overflow-hidden border-4 border-slate-300 shadow-inner relative">
          <div className="absolute top-0 w-full bg-white border-b px-4 py-2 text-xs text-slate-400 flex justify-center">
            Simple Preview
          </div>
          <div className="p-8 mt-8 h-full bg-white overflow-y-auto">
            {/* Simulated Email */}
            <div
              style={{
                fontFamily: "sans-serif",
                maxWidth: "600px",
                margin: "0 auto",
              }}
            >
              {/* Header/Logo Placeholder */}
              <div
                className="mb-6 pb-6 border-b"
                style={{ borderColor: state.branding.primaryColor }}
              >
                <div className="h-8 w-32 bg-slate-100 rounded animate-pulse" />
              </div>

              {/* Content Placeholder */}
              <div className="space-y-3 mb-8">
                <div className="h-4 bg-slate-100 rounded w-3/4" />
                <div className="h-4 bg-slate-100 rounded w-full" />
                <div className="h-4 bg-slate-100 rounded w-5/6" />
              </div>

              {/* Button Placeholder */}
              {state.branding.ctaEnabled && (
                <div className="mb-8 text-center">
                  <a
                    href={state.branding.ctaUrl || "#"}
                    target="_blank"
                    rel="noreferrer"
                    style={{ backgroundColor: state.branding.buttonColor }}
                    className="inline-block px-6 py-3 rounded text-white font-medium text-sm no-underline"
                  >
                    {state.branding.ctaText}
                  </a>
                </div>
              )}

              {/* Footer Preview */}
              {state.footer.enabled && (
                <div
                  className="mt-8 pt-8 border-t text-center text-xs text-slate-500"
                  style={{ borderTopColor: state.branding.primaryColor }}
                >
                  <p
                    className="font-bold"
                    style={{ color: state.branding.primaryColor }}
                  >
                    {state.footer.companyName || "Company Name"}
                  </p>
                  <p className="mt-1">
                    {state.footer.address || "Address Line"}
                  </p>
                  <div className="mt-2 flex justify-center gap-3 text-slate-400">
                    <span>{state.footer.website || "Website"}</span>
                    <span>•</span>
                    <span>{state.footer.supportEmail || "Email"}</span>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-between pt-4 mt-auto">
        <Button
          variant="outline"
          onClick={() => dispatch({ type: "PREV_STEP" })}
        >
          <ChevronLeft className="w-4 h-4 mr-2" /> Back
        </Button>
        <Button onClick={() => dispatch({ type: "NEXT_STEP" })}>
          Next: Final Preview <ChevronRight className="w-4 h-4 ml-2" />
        </Button>
      </div>
    </div>
  );
}

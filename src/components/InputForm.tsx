import React from "react";
import { CopyFormData } from "../types";
import { Loader2, RotateCcw } from "lucide-react";

interface InputFormProps {
  formData: CopyFormData;
  setFormData: React.Dispatch<React.SetStateAction<CopyFormData>>;
  onGenerate: () => void;
  isLoading: boolean;
  error: string | null;
}

const SAMPLE_PRESETS: { label: string; number: string; data: CopyFormData }[] = [
  {
    number: "01",
    label: "ARTISAN BAKERY",
    data: {
      businessName: "Hearth & Crumb Bakery",
      location: "Portland, OR",
      mainProductService: "Fresh naturally-fermented sourdough, European pastries, and catering boxes",
      targetAudience: "Local food lovers, neighborhood families, and office morning catering",
    },
  },
  {
    number: "02",
    label: "HVAC/PLUMBING",
    data: {
      businessName: "Summit Comfort Air & Plumbing",
      location: "Denver, CO",
      mainProductService: "Emergency AC/furnace repair, heat pump installs, and residential plumbing",
      targetAudience: "Homeowners, landlords, and property managers needing fast reliable service",
    },
  },
  {
    number: "03",
    label: "FITNESS STUDIO",
    data: {
      businessName: "Pulse Reformer Pilates",
      location: "Austin, TX",
      mainProductService: "Small group reformer pilates classes and 1-on-1 private athletic coaching",
      targetAudience: "Busy professionals, runners cross-training, and postnatal recovery clients",
    },
  },
];

export const InputForm: React.FC<InputFormProps> = ({
  formData,
  setFormData,
  onGenerate,
  isLoading,
  error,
}) => {
  const handleChange = (
    e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleApplyPreset = (presetData: CopyFormData) => {
    setFormData(presetData);
  };

  const handleReset = () => {
    setFormData({
      businessName: "",
      location: "",
      mainProductService: "",
      targetAudience: "",
    });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onGenerate();
  };

  const isFormValid =
    formData.businessName.trim().length > 0 &&
    formData.mainProductService.trim().length > 0;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between">
        <div className="font-mono-code text-[11px] text-zinc-400 tracking-wider">
          [ INPUT_PARAMS ]
        </div>
        {(formData.businessName || formData.mainProductService) && (
          <button
            type="button"
            id="reset-form-btn"
            onClick={handleReset}
            disabled={isLoading}
            title="Reset form fields"
            className="flex items-center gap-1 text-[10px] font-mono-code text-zinc-400 hover:text-zinc-200 transition-colors cursor-pointer"
          >
            <RotateCcw className="w-3 h-3" />
            <span>CLEAR</span>
          </button>
        )}
      </div>

      <form
        id="copy-generator-form"
        onSubmit={handleSubmit}
        className="flex flex-col gap-4"
      >
        {/* Business Name */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="businessName"
            className="font-mono-code text-[10px] text-blue-400 uppercase tracking-wider font-semibold"
          >
            Name <span className="text-zinc-500">*</span>
          </label>
          <input
            type="text"
            id="businessName"
            name="businessName"
            value={formData.businessName}
            onChange={handleChange}
            placeholder="Business Name"
            required
            disabled={isLoading}
            className="bg-[#27272a] border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 font-mono-code text-xs rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        {/* Location / Locale */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="location"
            className="font-mono-code text-[10px] text-blue-400 uppercase tracking-wider font-semibold"
          >
            Locale
          </label>
          <input
            type="text"
            id="location"
            name="location"
            value={formData.location}
            onChange={handleChange}
            placeholder="City / Region"
            disabled={isLoading}
            className="bg-[#27272a] border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 font-mono-code text-xs rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        {/* Product / Service */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="mainProductService"
            className="font-mono-code text-[10px] text-blue-400 uppercase tracking-wider font-semibold"
          >
            Product_Service <span className="text-zinc-500">*</span>
          </label>
          <textarea
            id="mainProductService"
            name="mainProductService"
            rows={3}
            value={formData.mainProductService}
            onChange={handleChange}
            placeholder="Key offerings..."
            required
            disabled={isLoading}
            className="bg-[#27272a] border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 font-mono-code text-xs rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors resize-y disabled:opacity-50"
          />
        </div>

        {/* Target Audience */}
        <div className="flex flex-col gap-1.5">
          <label
            htmlFor="targetAudience"
            className="font-mono-code text-[10px] text-blue-400 uppercase tracking-wider font-semibold"
          >
            Target_Audience
          </label>
          <input
            type="text"
            id="targetAudience"
            name="targetAudience"
            value={formData.targetAudience}
            onChange={handleChange}
            placeholder="User segment"
            disabled={isLoading}
            className="bg-[#27272a] border border-zinc-800 text-zinc-100 placeholder:text-zinc-600 font-mono-code text-xs rounded px-3 py-2 focus:border-blue-500 focus:ring-1 focus:ring-blue-500 focus:outline-none transition-colors disabled:opacity-50"
          />
        </div>

        {/* Data Presets */}
        <div className="flex flex-col gap-1.5 pt-1">
          <label className="font-mono-code text-[10px] text-blue-400 uppercase tracking-wider font-semibold">
            Data_Presets
          </label>
          <div className="grid grid-cols-1 gap-1.5">
            {SAMPLE_PRESETS.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                id={`preset-btn-${idx}`}
                onClick={() => handleApplyPreset(preset.data)}
                disabled={isLoading}
                className="bg-transparent border border-zinc-800/80 hover:border-zinc-700 hover:bg-zinc-800/40 text-zinc-300 text-left px-2.5 py-1.5 text-xs font-mono-code rounded transition-colors cursor-pointer disabled:opacity-40"
              >
                {preset.number}. {preset.label}
              </button>
            ))}
          </div>
        </div>

        {/* Error Alert */}
        {error && (
          <div
            id="form-error-alert"
            role="alert"
            className="p-3 rounded bg-rose-950/40 border border-rose-800/80 text-rose-300 font-mono-code text-xs leading-relaxed"
          >
            <span className="font-bold text-rose-400">[ERROR]: </span>
            {error}
          </div>
        )}

        {/* Submit Button */}
        <div className="pt-2">
          <button
            type="submit"
            id="generate-copy-button"
            disabled={!isFormValid || isLoading}
            className="w-full bg-[#3b82f6] hover:bg-blue-600 active:bg-blue-700 text-white font-syne font-bold uppercase tracking-wider py-3 px-4 rounded text-xs transition-colors disabled:opacity-30 disabled:cursor-not-allowed cursor-pointer flex items-center justify-center gap-2"
          >
            {isLoading ? (
              <>
                <Loader2 className="w-4 h-4 animate-spin text-white" />
                <span>GENERATING ASSETS...</span>
              </>
            ) : (
              <span>GENERATE ASSETS</span>
            )}
          </button>
        </div>
      </form>
    </div>
  );
};

import { useMemo, useState } from "react";
import { renderTemplate } from "../lib/utils";

interface InlineVariablesProps {
  body: string;
  variables: string[];
  onInject: (text: string) => void;
  onCancel: () => void;
}

export default function InlineVariables({ body, variables, onInject, onCancel }: InlineVariablesProps) {
  const initialValues = useMemo(() => Object.fromEntries(variables.map((v) => [v, ""])), [variables]);
  const [values, setValues] = useState<Record<string, string>>(initialValues);
  const complete = variables.every((v) => values[v]?.trim());

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        if (complete) onInject(renderTemplate(body, values));
      }}
      className="flex flex-col gap-2"
    >
      {variables.map((variable) => (
        <div key={variable} className="flex flex-col gap-1">
          <label className="text-[10px] font-medium text-zinc-500 uppercase tracking-wide">
            {variable}
          </label>
          <input
            type="text"
            autoFocus={variables[0] === variable}
            placeholder={`Enter ${variable}...`}
            value={values[variable]}
            onChange={(e) => setValues((cur) => ({ ...cur, [variable]: e.target.value }))}
            className="h-7 w-full rounded-md border border-zinc-700/60 bg-zinc-800/80 px-2.5 text-xs text-zinc-200 outline-none transition-colors duration-150 placeholder:text-zinc-600 focus:border-zinc-600"
          />
        </div>
      ))}
      <div className="flex items-center justify-end gap-2 mt-1">
        <button
          type="button"
          onClick={onCancel}
          className="text-[11px] px-2.5 py-1 rounded-md text-zinc-500 hover:text-zinc-300 transition-colors duration-100 focus-visible:outline-none"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={!complete}
          className="text-[11px] font-medium px-3 py-1 rounded-md bg-violet-600 hover:bg-violet-500 text-white transition-colors duration-150 disabled:opacity-40 disabled:cursor-not-allowed focus-visible:outline-none"
        >
          Inject →
        </button>
      </div>
    </form>
  );
}

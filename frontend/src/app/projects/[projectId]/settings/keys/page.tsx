"use client";

import { useEffect, useState } from "react";
import { fetchApiKeys, createApiKey, APIKey, APIKeyCreated, ApiError } from "@/lib/api";
import { useProject } from "../../layout";

export default function ApiKeysPage() {
  const { project, loading: projectLoading } = useProject();
  const [keys, setKeys] = useState<APIKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  
  const [newKeyName, setNewKeyName] = useState("");
  const [isCreating, setIsCreating] = useState(false);
  const [createdKey, setCreatedKey] = useState<APIKeyCreated | null>(null);

  useEffect(() => {
    async function loadKeys() {
      if (!project) return;
      try {
        const data = await fetchApiKeys(project.id);
        setKeys(data);
      } catch (err) {
        if (err instanceof ApiError) {
          setError(err.message || "Failed to load API keys.");
        } else {
          setError("An unexpected error occurred.");
        }
      } finally {
        setLoading(false);
      }
    }
    
    if (!projectLoading) {
      loadKeys();
    }
  }, [project, projectLoading]);

  const handleCreate = async () => {
    if (!project || !newKeyName.trim()) return;
    
    setIsCreating(true);
    setError("");
    setCreatedKey(null);
    
    try {
      const newKey = await createApiKey(project.id, newKeyName.trim());
      setCreatedKey(newKey);
      setKeys(prev => [...prev, newKey]);
      setNewKeyName("");
    } catch (err) {
      if (err instanceof ApiError) {
        setError(err.message || "Failed to create API key. You must be an OWNER.");
      } else {
        setError("An unexpected error occurred.");
      }
    } finally {
      setIsCreating(false);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  if (projectLoading || loading) {
    return (
      <div className="flex-1 p-8">
        <div className="text-metadata font-mono uppercase tracking-widest text-tertiary">
          Loading Keys...
        </div>
      </div>
    );
  }

  return (
    <div className="flex-1 p-8 flex flex-col gap-12 max-w-4xl mx-auto w-full">
      <div className="flex flex-col gap-4">
        <h1 className="text-section-title font-medium tracking-tight">API Keys</h1>
        <p className="text-body font-mono text-secondary">
          Generate API keys to authenticate your application&apos;s SDK telemetry.
        </p>
      </div>

      {error && (
        <div className="text-metadata font-mono text-red-500 bg-red-500/5 p-3 rounded-sm border border-red-500/20">
          {error}
        </div>
      )}

      {createdKey && (
        <div className="flex flex-col gap-4 p-6 border border-primary bg-primary/5">
          <div className="flex items-center justify-between">
            <h3 className="text-metadata font-mono uppercase tracking-widest text-primary">
              Key Generated Successfully
            </h3>
          </div>
          <p className="text-body font-mono text-secondary">
            Store this key securely. It will not be shown again.
          </p>
          <div className="flex items-center gap-4 mt-2">
            <code className="flex-1 bg-background border border-surface-2 p-3 text-metadata font-mono text-primary break-all">
              {createdKey.key}
            </code>
            <button 
              onClick={() => copyToClipboard(createdKey.key)}
              className="text-metadata font-mono uppercase tracking-widest text-tertiary hover:text-primary transition-colors shrink-0"
            >
              [COPY]
            </button>
          </div>
        </div>
      )}

      <div className="flex flex-col gap-6">
        <div className="flex items-center justify-between border-b border-surface-2 pb-2">
          <h2 className="text-metadata font-mono uppercase tracking-widest text-secondary">
            Generate New Key
          </h2>
        </div>
        <div className="flex items-center gap-4">
          <input 
            type="text" 
            placeholder="Key Name (e.g., Production API)"
            value={newKeyName}
            onChange={(e) => setNewKeyName(e.target.value)}
            disabled={isCreating}
            onKeyDown={(e) => e.key === 'Enter' && handleCreate()}
            className="flex-1 bg-background border border-surface-2 text-metadata font-mono p-3 outline-none focus:border-primary transition-colors text-primary"
          />
          <button 
            onClick={handleCreate}
            disabled={isCreating || !newKeyName.trim()}
            className="text-metadata font-mono uppercase tracking-widest text-tertiary hover:text-primary transition-colors disabled:opacity-50"
          >
            {isCreating ? "GENERATING..." : "[GENERATE KEY]"}
          </button>
        </div>
      </div>

      <div className="flex flex-col gap-6 mt-8">
        <div className="flex items-center justify-between border-b border-surface-2 pb-2">
          <h2 className="text-metadata font-mono uppercase tracking-widest text-secondary">
            Existing Keys
          </h2>
        </div>
        
        {keys.length === 0 ? (
          <div className="text-metadata font-mono text-tertiary">
            NO API KEYS FOUND
          </div>
        ) : (
          <div className="flex flex-col gap-4">
            {keys.map(key => (
              <div key={key.id} className="flex items-center justify-between p-4 border border-surface-2 bg-surface-1/30 hover:border-primary transition-colors">
                <div className="flex flex-col gap-1">
                  <span className="text-body font-mono tracking-wide text-primary">
                    {key.name}
                  </span>
                  <span className="text-metadata font-mono text-tertiary">
                    {key.prefix}...
                  </span>
                </div>
                <div className="text-metadata font-mono text-tertiary tracking-widest">
                  ID: {key.id.split('-')[0]}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

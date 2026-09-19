"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { fetchOrganizations, fetchProjects, fetchMe, createProject, Organization, Project, ApiError } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  const router = useRouter();
  const [organizations, setOrganizations] = useState<Organization[]>([]);
  const [projectsMap, setProjectsMap] = useState<Record<string, Project[]>>({});
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [user, setUser] = useState<{ name: string; email: string } | null>(null);

  const [creatingOrgId, setCreatingOrgId] = useState<string | null>(null);
  const [newProjectName, setNewProjectName] = useState("");
  const [createError, setCreateError] = useState("");
  const [isCreating, setIsCreating] = useState(false);

  useEffect(() => {
    async function loadData() {
      try {
        const me = await fetchMe();
        setUser(me);

        const orgs = await fetchOrganizations();
        setOrganizations(orgs);

        const pMap: Record<string, Project[]> = {};
        for (const org of orgs) {
          const projs = await fetchProjects(org.id);
          pMap[org.id] = projs;
        }
        setProjectsMap(pMap);
      } catch (err) {
        if (err instanceof ApiError && err.status === 401) {
          router.push("/login");
        } else {
          setError("Failed to load projects. Please try again.");
        }
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, [router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  const handleCreateProject = async (orgId: string) => {
    if (!newProjectName.trim()) return;
    
    setIsCreating(true);
    setCreateError("");
    
    try {
      const newProject = await createProject(orgId, newProjectName.trim());
      router.push(`/projects/${newProject.id}/observe`);
    } catch (err) {
      if (err instanceof ApiError) {
        setCreateError(err.message || "Failed to create project. You may lack permission.");
      } else {
        setCreateError("An unexpected error occurred.");
      }
      setIsCreating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary font-mono text-metadata tracking-widest uppercase">
        Loading Workspaces...
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-primary flex flex-col items-center justify-center p-4">
      <motion.div 
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="w-full max-w-2xl flex flex-col gap-12"
      >
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <Link href="/" className="text-metadata font-mono tracking-widest uppercase hover:opacity-70 transition-opacity">
              AETHER
            </Link>
            <button 
              onClick={handleLogout}
              className="text-metadata font-mono tracking-widest uppercase text-tertiary hover:text-primary transition-colors"
            >
              Logout
            </button>
          </div>
          <h1 className="text-section-title font-medium tracking-tight mt-8">Select Workspace</h1>
        </div>

        {error && (
          <div className="text-metadata font-mono text-red-500 border border-red-500/20 bg-red-500/5 p-3 rounded-sm">
            {error}
          </div>
        )}

        <div className="flex flex-col gap-12">
          {organizations.length === 0 ? (
            <div className="text-metadata font-mono text-tertiary">
              NO ORGANIZATIONS FOUND
            </div>
          ) : (
            organizations.map(org => (
              <div key={org.id} className="flex flex-col gap-6">
                <div className="flex items-center justify-between border-b border-surface-2 pb-2">
                  <h2 className="text-metadata font-mono uppercase tracking-widest text-secondary">
                    {org.name}
                  </h2>
                  {creatingOrgId === org.id ? (
                    <div className="flex items-center gap-2">
                      <input 
                        type="text" 
                        autoFocus
                        placeholder="Project Name"
                        value={newProjectName}
                        onChange={(e) => setNewProjectName(e.target.value)}
                        disabled={isCreating}
                        onKeyDown={(e) => {
                          if (e.key === 'Enter') handleCreateProject(org.id);
                          if (e.key === 'Escape') {
                            setCreatingOrgId(null);
                            setNewProjectName("");
                            setCreateError("");
                          }
                        }}
                        className="bg-background border border-surface-2 text-metadata font-mono p-1 outline-none focus:border-primary transition-colors text-primary"
                      />
                      <button 
                        onClick={() => handleCreateProject(org.id)}
                        disabled={isCreating || !newProjectName.trim()}
                        className="text-metadata font-mono text-tertiary hover:text-primary transition-colors disabled:opacity-50"
                      >
                        {isCreating ? "CREATING..." : "[SUBMIT]"}
                      </button>
                      <button 
                        onClick={() => {
                          setCreatingOrgId(null);
                          setNewProjectName("");
                          setCreateError("");
                        }}
                        disabled={isCreating}
                        className="text-metadata font-mono text-tertiary hover:text-red-500 transition-colors"
                      >
                        [CANCEL]
                      </button>
                    </div>
                  ) : (
                    <button 
                      onClick={() => {
                        setCreatingOrgId(org.id);
                        setNewProjectName("");
                        setCreateError("");
                      }}
                      className="text-metadata font-mono tracking-widest uppercase text-tertiary hover:text-primary transition-colors"
                    >
                      CREATE PROJECT &rarr;
                    </button>
                  )}
                </div>
                {creatingOrgId === org.id && createError && (
                  <div className="text-metadata font-mono text-red-500 bg-red-500/5 p-2 rounded-sm border border-red-500/20">
                    {createError}
                  </div>
                )}
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {!projectsMap[org.id] || projectsMap[org.id].length === 0 ? (
                    <div className="text-metadata font-mono text-tertiary">
                      NO PROJECTS FOUND
                    </div>
                  ) : (
                    projectsMap[org.id].map(project => (
                      <Link 
                        key={project.id} 
                        href={`/projects/${project.id}/observe`}
                        className="group flex flex-col gap-2 p-6 border border-surface-2 hover:border-primary transition-colors bg-surface-1/30"
                      >
                        <span className="text-body font-mono uppercase tracking-wide group-hover:text-primary transition-colors">
                          {project.name}
                        </span>
                        <span className="text-metadata font-mono text-tertiary tracking-widest">
                          ID: {project.id.split('-')[0]}
                        </span>
                      </Link>
                    ))
                  )}
                </div>
              </div>
            ))
          )}
        </div>
      </motion.div>
    </div>
  );
}

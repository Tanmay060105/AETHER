"use client";

import { createContext, useContext, useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { fetchProject, Project, ApiError } from "@/lib/api";
import Link from "next/link";
import { motion } from "framer-motion";

interface ProjectContextType {
  project: Project | null;
  loading: boolean;
}

const ProjectContext = createContext<ProjectContextType>({ project: null, loading: true });

export const useProject = () => useContext(ProjectContext);

export default function ProjectLayout({ children }: { children: React.ReactNode }) {
  const params = useParams();
  const router = useRouter();
  const projectId = params.projectId as string;
  
  const [project, setProject] = useState<Project | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadProject() {
      try {
        const data = await fetchProject(projectId);
        setProject(data);
      } catch (err) {
        if (err instanceof ApiError && (err.status === 401 || err.status === 403)) {
          router.push("/projects");
        } else {
          // Handle other errors (e.g. 404)
          router.push("/projects");
        }
      } finally {
        setLoading(false);
      }
    }
    
    if (projectId) {
      loadProject();
    }
  }, [projectId, router]);

  const handleLogout = async () => {
    try {
      await fetch("/api/v1/auth/logout", { method: "POST" });
      router.push("/login");
    } catch {
      router.push("/login");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center text-primary font-mono text-metadata tracking-widest uppercase">
        Initializing Workspace...
      </div>
    );
  }

  if (!project) return null; // Redirecting

  return (
    <ProjectContext.Provider value={{ project, loading }}>
      <div className="min-h-screen bg-background text-primary flex flex-col selection:bg-primary selection:text-background">
        {/* Minimal Navigation Header */}
        <header className="flex items-center justify-between px-8 py-6 border-b border-surface-2/50 backdrop-blur-md sticky top-0 z-50">
          <div className="flex items-center gap-12">
            <Link href="/" className="text-metadata font-mono tracking-widest uppercase hover:opacity-70 transition-opacity">
              AETHER
            </Link>
            
            <nav className="hidden md:flex items-center gap-8">
              <span className="text-metadata font-mono uppercase tracking-widest text-secondary">
                {project.name}
              </span>
              <div className="w-px h-4 bg-surface-2" />
              <Link href={`/projects/${project.id}/observe`} className="text-metadata font-mono tracking-widest text-primary hover:text-secondary transition-colors">
                OBSERVE
              </Link>
              <Link href={`/projects/${project.id}/settings/keys`} className="text-metadata font-mono tracking-widest text-primary hover:text-secondary transition-colors">
                API KEYS
              </Link>
            </nav>
          </div>

          <div className="flex items-center gap-6">
            <Link 
              href="/projects"
              className="text-metadata font-mono tracking-widest uppercase text-tertiary hover:text-secondary transition-colors"
            >
              Switch
            </Link>
            <button 
              onClick={handleLogout}
              className="text-metadata font-mono tracking-widest uppercase text-tertiary hover:text-primary transition-colors"
            >
              Logout
            </button>
          </div>
        </header>

        {/* Workspace Content */}
        <motion.main 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="flex-1 flex flex-col relative"
        >
          {children}
        </motion.main>
      </div>
    </ProjectContext.Provider>
  );
}

"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { trpc } from "@/lib/trpc-client";
import { PARACard } from "@/components/para/para-card";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";

export default function ProjectsPage() {
  type SortOption = "updatedAt_desc" | "updatedAt_asc" | "name_asc" | "name_desc";
  type FilterOption = "all" | "withTasks" | "noTasks" | "active" | "completed";

  const [sortBy, setSortBy] = useState<SortOption>("updatedAt_desc");
  const [filter, setFilter] = useState<FilterOption>("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [page, setPage] = useState<number>(0);
  const [isCreating, setIsCreating] = useState(false);
  const [newProjectName, setNewProjectName] = useState("");
  const [newProjectDesc, setNewProjectDesc] = useState("");

  const [projectList, setProjectList] = useState<
    Array<{
      id: string;
      name: string;
      description?: string | null;
      type: "PROJECT" | "AREA" | "RESOURCE" | "ARCHIVE";
      updatedAt: string | Date;
      _count?: { tasks: number; notes: number };
      completedTasks?: number;
      isComplete?: boolean;
    }>
  >([]);

  const projectPageSize = 9;
  const utils = trpc.useContext();

  const createProjectMutation = trpc.para.create.useMutation({
    onSuccess() {
      setPage(0);
      setProjectList([]);
      utils.para.getAll.invalidate();
    },
  });

  const { data: pageData, isLoading, isError, error, isFetching } = trpc.para.getAll.useQuery(
    {
      type: "PROJECT",
      skip: page * projectPageSize,
      take: projectPageSize,
      orderBy: sortBy,
      filter,
    },
    {
      keepPreviousData: true,
    }
  );

  useEffect(() => {
    if (!pageData) return;
    setProjectList((prev) => {
      const next = page === 0 ? pageData : [...prev, ...pageData];
      const unique = new Map<string, typeof next[number]>();
      next.forEach((item) => unique.set(item.id, item));
      return Array.from(unique.values());
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pageData]);

  useEffect(() => {
    setPage(0);
    setProjectList([]);
  }, [sortBy, filter]);

  const activeProjects = useMemo(() => projectList.filter((p) => !p.isComplete).length, [projectList]);
  const completedProjects = useMemo(() => projectList.filter((p) => p.isComplete).length, [projectList]);
  const efficiency = useMemo(() => {
    if (!projectList.length) return "0%";
    return `${Math.round((completedProjects / projectList.length) * 100)}%`;
  }, [projectList.length, completedProjects]);

  const visibleProjects = useMemo(() => {
    const query = searchTerm.toLowerCase().trim();
    if (!query) return projectList;
    return projectList.filter((project) => {
      const name = project.name.toLowerCase();
      const description = project.description?.toLowerCase() ?? "";
      return name.includes(query) || description.includes(query);
    });
  }, [projectList, searchTerm]);

  function handleResetCreateForm() {
    setNewProjectName("");
    setNewProjectDesc("");
    setIsCreating(false);
  }

  async function handleCreateNewProject() {
    const name = newProjectName.trim();
    if (!name) return;

    createProjectMutation.mutate({
      name,
      type: "PROJECT",
      description: newProjectDesc.trim() || "",
    });

    handleResetCreateForm();
  }

  return (
    <div className="space-y-6">
      <SectionHeader
        label="Projects"
        action={
          <Button
            onClick={() => setIsCreating((prev) => !prev)}
            className="gap-2"
            size="sm"
          >
            <PhosphorIcons.Plus size={16} weight="bold" />
            {isCreating ? "Cancel" : "New Project"}
          </Button>
        }
      />

      {isCreating && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -10 }}
          transition={{ duration: 0.2 }}
          className="relative overflow-hidden rounded-md bg-card border border-primary/20 p-6 shadow-lg"
        >
          <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent pointer-events-none" />
          
          <div className="relative z-10">
            <div className="flex items-center justify-between gap-4 mb-5">
              <div>
                <h3 className="text-lg font-semibold text-foreground mb-1">Create new project</h3>
                <p className="text-sm text-muted-foreground">Start something new and organize your work</p>
              </div>
              <button
                onClick={handleResetCreateForm}
                className="p-1.5 rounded-md text-muted-foreground hover:bg-muted/50 transition-colors"
              >
                <PhosphorIcons.X size={20} />
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Project Name</label>
                <Input
                  value={newProjectName}
                  onChange={(event) => setNewProjectName(event.target.value)}
                  placeholder="e.g., Website Redesign"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
                <Input
                  value={newProjectDesc}
                  onChange={(event) => setNewProjectDesc(event.target.value)}
                  placeholder="Brief description..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCreateNewProject}
                disabled={createProjectMutation.isLoading || !newProjectName.trim()}
                className="gap-2"
              >
                {createProjectMutation.isLoading ? (
                  <>
                    <PhosphorIcons.Spinner size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PhosphorIcons.CheckCircle size={16} />
                    Create Project
                  </>
                )}
              </Button>
              <Button
                variant="outline"
                onClick={handleResetCreateForm}
              >
                Cancel
              </Button>
            </div>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active" value={activeProjects} trend="neutral" />
        <StatCard label="Completed" value={completedProjects} />
        <StatCard label="Efficiency" value={efficiency} trend={Number(efficiency.replace("%", "")) >= 75 ? "up" : "neutral"} />
      </div>

      {/* Search and controls */}
      <div className="space-y-4">
        <div className="flex flex-col md:flex-row md:items-center gap-4">
          <div className="flex-1 relative group">
            <div className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-primary transition-colors">
              <PhosphorIcons.MagnifyingGlass size={18} />
            </div>
            <Input
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="Search projects by name or description..."
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {visibleProjects.length} of {projectList.length}
          </p>
        </div>

        {/* Filter and sort controls */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-card/50 border border-border/60 rounded-md px-3 py-2">
            <PhosphorIcons.FunnelSimple size={16} className="text-muted-foreground" />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as FilterOption)}
              className="bg-transparent text-xs font-medium text-foreground cursor-pointer outline-none"
            >
              <option value="all">All projects</option>
              <option value="withTasks">With tasks</option>
              <option value="noTasks">No tasks</option>
              <option value="active">Active only</option>
              <option value="completed">Completed only</option>
            </select>
          </div>

          <div className="flex items-center gap-2 bg-card/50 border border-border/60 rounded-md px-3 py-2">
            <PhosphorIcons.SortAscending size={16} className="text-muted-foreground" />
            <select
              value={sortBy}
              onChange={(event) => setSortBy(event.target.value as SortOption)}
              className="bg-transparent text-xs font-medium text-foreground cursor-pointer outline-none"
            >
              <option value="updatedAt_desc">Recently updated</option>
              <option value="updatedAt_asc">Oldest updated</option>
              <option value="name_asc">Name (A-Z)</option>
              <option value="name_desc">Name (Z-A)</option>
            </select>
          </div>
        </div>
      </div>

      {isError && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-start gap-4 p-4 rounded-md bg-destructive/10 border border-destructive/20"
        >
          <PhosphorIcons.WarningCircle size={20} className="text-destructive flex-shrink-0 mt-0.5" />
          <div>
            <h3 className="font-semibold text-destructive mb-1">Error loading projects</h3>
            <p className="text-sm text-destructive/80">{error?.message || "Unknown error"}</p>
          </div>
        </motion.div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(isLoading || (isFetching && page === 0)) &&
          Array.from({ length: 6 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="h-40 rounded-md bg-card border border-border/60 animate-pulse"
            />
          ))}

        {!isLoading && !projectList.length && !isError && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-2 lg:col-span-3 rounded-md bg-card/50 border border-border/40 p-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <PhosphorIcons.Kanban size={32} weight="duotone" className="text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">No projects yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Create your first project to start organizing your work and tracking progress.
              </p>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              className="gap-2 mt-2"
            >
              <PhosphorIcons.Plus size={16} />
              Create First Project
            </Button>
          </motion.div>
        )}

        {!isLoading && projectList.length > 0 && visibleProjects.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-2 lg:col-span-3 rounded-md bg-card/50 border border-border/40 p-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-lg bg-muted/20 flex items-center justify-center">
              <PhosphorIcons.MagnifyingGlass size={32} weight="duotone" className="text-muted-foreground" />
            </div>
            <h3 className="text-lg font-semibold text-foreground">No matches found</h3>
            <p className="text-sm text-muted-foreground max-w-sm">
              Try adjusting your search or filters to find what you're looking for.
            </p>
          </motion.div>
        )}

        {visibleProjects.map((project, index) => (
          <motion.div
            key={project.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <PARACard
              id={project.id}
              name={project.name}
              description={project.description}
              type="PROJECT"
              updatedAt={project.updatedAt}
              stats={{
                tasks: project._count?.tasks ?? 0,
                notes: project._count?.notes ?? 0,
              }}
            />
          </motion.div>
        ))}
      </div>

      {pageData && pageData.length === projectPageSize && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="flex justify-center py-6"
        >
          <Button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isFetching}
            variant="outline"
            className="gap-2"
          >
            {isFetching ? (
              <>
                <PhosphorIcons.Spinner size={16} className="animate-spin" />
                Loading...
              </>
            ) : (
              <>
                Load more projects
                <PhosphorIcons.CaretDown size={16} />
              </>
            )}
          </Button>
        </motion.div>
      )}
    </div>
  );
}

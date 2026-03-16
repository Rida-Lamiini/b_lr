"use client";

import { useEffect, useMemo, useState } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { StatCard } from "@/components/ui/stat-card";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc-client";
import { PARACard } from "@/components/para/para-card";
import * as PhosphorIcons from "@phosphor-icons/react";

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
          <button
            onClick={() => setIsCreating((prev) => !prev)}
            className="flex items-center gap-1.5 bg-[#238636] hover:bg-[#2ea043] text-white px-3 py-1 rounded-md text-[12px] font-semibold transition-colors"
            aria-label="Create a new project"
          >
            <PhosphorIcons.Plus size={14} weight="bold" />
            {isCreating ? "Cancel" : "New Project"}
          </button>
        }
      />

      {isCreating && (
        <div className="gh-box p-4 rounded-md border border-border bg-background shadow-sm">
          <div className="flex items-center justify-between gap-2 mb-3">
            <h4 className="text-sm font-semibold">New project details</h4>
            <button
              onClick={handleResetCreateForm}
              className="rounded-md px-2 py-1 text-xs hover:bg-muted"
            >
              Close
            </button>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
            <Input
              value={newProjectName}
              onChange={(event) => setNewProjectName(event.target.value)}
              placeholder="Project name"
            />
            <Input
              value={newProjectDesc}
              onChange={(event) => setNewProjectDesc(event.target.value)}
              placeholder="Project description"
            />
          </div>
          <button
            onClick={handleCreateNewProject}
            disabled={createProjectMutation.isLoading || !newProjectName.trim()}
            className="mt-3 rounded-md bg-primary px-3 py-1.5 text-xs font-semibold text-white hover:bg-primary/90 disabled:opacity-50"
          >
            {createProjectMutation.isLoading ? "Creating..." : "Create Project"}
          </button>
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <StatCard label="Active" value={activeProjects} trend="neutral" />
        <StatCard label="Completed" value={completedProjects} />
        <StatCard label="Efficiency" value={efficiency} trend={Number(efficiency.replace("%", "")) >= 75 ? "up" : "neutral"} />
      </div>

      <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <p className="text-xs text-muted-foreground">
          Showing {visibleProjects.length} of {projectList.length} projects.
        </p>
        <Input
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="Search projects..."
          className="max-w-sm"
        />
      </div>

      <div className="flex flex-wrap gap-3 items-center">
        <label className="text-sm font-medium">
          Filter:
          <select
            value={filter}
            onChange={(event) => setFilter(event.target.value as FilterOption)}
            className="ml-2 rounded-md border border-border px-2 py-1"
          >
            <option value="all">All</option>
            <option value="withTasks">With tasks</option>
            <option value="noTasks">No tasks</option>
            <option value="active">Active</option>
            <option value="completed">Completed</option>
          </select>
        </label>

        <label className="text-sm font-medium">
          Sort:
          <select
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="ml-2 rounded-md border border-border px-2 py-1"
          >
            <option value="updatedAt_desc">Updated (newest)</option>
            <option value="updatedAt_asc">Updated (oldest)</option>
            <option value="name_asc">Name (A-Z)</option>
            <option value="name_desc">Name (Z-A)</option>
          </select>
        </label>
      </div>

      {isError && (
        <div className="gh-box p-4 rounded-md border border-red-200 bg-red-50 text-red-700">
          Error loading projects: {error?.message || "Unknown error"}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {(isLoading || (isFetching && page === 0)) &&
          Array.from({ length: 6 }).map((_, i) => (
            <div key={i} className="gh-box p-4 h-32 animate-pulse bg-muted/20" />
          ))}

        {!isLoading && !projectList.length && !isError && (
          <div className="md:col-span-2 lg:col-span-3 gh-box p-12 flex flex-col items-center justify-center text-center space-y-4">
            <div className="w-12 h-12 bg-muted rounded-full flex items-center justify-center text-muted-foreground">
              <PhosphorIcons.Kanban size={24} weight="duotone" />
            </div>
            <div className="space-y-1">
              <h3 className="text-[16px] font-semibold">No active projects</h3>
              <p className="text-[14px] text-muted-foreground max-w-xs">
                Time to start something new? Create a project to organize your focused efforts.
              </p>
            </div>
          </div>
        )}

        {!isLoading && projectList.length > 0 && visibleProjects.length === 0 && (
          <div className="md:col-span-2 lg:col-span-3 gh-box p-12 flex flex-col items-center justify-center text-center space-y-4">
            <PhosphorIcons.MagnifyingGlass size={28} weight="duotone" className="text-muted-foreground" />
            <h3 className="text-[16px] font-semibold">No projects match your search</h3>
            <p className="text-[14px] text-muted-foreground max-w-xs">
              Try another keyword or clear the search bar.
            </p>
          </div>
        )}

        {visibleProjects.map((project) => (
          <PARACard
            key={project.id}
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
        ))}
      </div>

      {pageData && pageData.length === projectPageSize && (
        <div className="text-center">
          <button
            onClick={() => setPage((prev) => prev + 1)}
            disabled={isFetching}
            className="rounded-md border border-border px-4 py-2 text-sm hover:bg-muted"
          >
            {isFetching ? "Loading more..." : "Load more"}
          </button>
        </div>
      )}
    </div>
  );
}

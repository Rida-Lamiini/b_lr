"use client";

import { useState, useMemo } from "react";
import { useRouter, useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc-client";
import * as PhosphorIcons from "@phosphor-icons/react";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import Link from "next/link";
import { AreaHealth } from "@/components/areas/AreaHealth";
import { AreaInsights } from "@/components/areas/AreaInsights";
import { AreaTimeline } from "@/components/areas/AreaTimeline";
import { AreaCollaborationHub } from "@/components/areas/AreaCollaborationHub";
import { AreaAdvancedViews } from "@/components/areas/AreaAdvancedViews";

export default function AreaDetailPage() {
  const params = useParams();
  const router = useRouter();
  const areaId = params.id as string;
  
  const { data: area, isLoading: isLoadingArea } = trpc.para.getById.useQuery(
    { id: areaId },
    { enabled: !!areaId }
  );

  const { data: projects } = trpc.para.getAll.useQuery(
    { type: "PROJECT", parentId: areaId },
    { enabled: !!areaId && !!area }
  );

  const { data: tasks } = trpc.task.getAll.useQuery(
    { areaId },
    { enabled: !!areaId }
  );

  const { data: notes } = trpc.note.getAll.useQuery(
    { areaId },
    { enabled: !!areaId }
  );

  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  const updateAreaMutation = trpc.para.update.useMutation({
    onSuccess: () => {
      setIsEditing(false);
    },
  });

  const deleteAreaMutation = trpc.para.delete.useMutation({
    onSuccess: () => {
      router.push("/areas");
    },
  });

  const handleEditStart = () => {
    if (area) {
      setEditName(area.name);
      setEditDesc(area.description || "");
      setIsEditing(true);
    }
  };

  const handleSaveEdit = async () => {
    if (area && editName.trim()) {
      await updateAreaMutation.mutateAsync({
        id: areaId,
        name: editName,
        description: editDesc,
      });
    }
  };

  const handleDelete = async () => {
    if (area && confirm(`Delete "${area.name}" and all its associated data?`)) {
      await deleteAreaMutation.mutateAsync({ id: areaId });
    }
  };

  if (isLoadingArea) {
    return (
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="space-y-6"
      >
        <div className="h-32 bg-gradient-to-r from-muted to-muted/50 rounded-lg animate-pulse" />
        <div className="grid grid-cols-3 gap-4">
          {[...Array(3)].map((_, i) => (
            <div key={i} className="h-24 bg-muted rounded-lg animate-pulse" />
          ))}
        </div>
      </motion.div>
    );
  }

  if (!area) {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="rounded-md bg-card border border-border/40 p-12 text-center space-y-4"
      >
        <h2 className="text-xl font-semibold text-foreground">Area not found</h2>
        <p className="text-muted-foreground">The area you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/areas">Back to Areas</Link>
        </Button>
      </motion.div>
    );
  }

  const totalTasks = tasks?.length || 0;
  const completedTasks = tasks?.filter((t: any) => t.completed).length || 0;
  const projectCount = projects?.length || 0;

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.3 }}
      className="space-y-8 max-w-7xl mx-auto"
    >
      {/* Hero Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/15 via-primary/5 to-transparent border border-primary/20 p-8"
      >
        <div className="absolute inset-0 opacity-20 pointer-events-none">
          <div className="absolute -top-40 -right-40 w-80 h-80 bg-primary/20 rounded-full blur-3xl" />
        </div>

        <div className="relative z-10 flex items-start justify-between gap-6">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-3">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-2xl font-bold h-10"
                />
                <Input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  placeholder="Area description..."
                  className="text-sm"
                />
                <div className="flex gap-2">
                  <Button
                    size="sm"
                    onClick={handleSaveEdit}
                    disabled={updateAreaMutation.isLoading || !editName.trim()}
                  >
                    Save
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => setIsEditing(false)}
                  >
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-foreground mb-2">{area.name}</h1>
                <p className="text-muted-foreground max-w-2xl">{area.description}</p>
              </>
            )}
          </div>

          <div className="flex items-center gap-2 flex-shrink-0">
            {!isEditing && (
              <>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleEditStart}
                >
                  <PhosphorIcons.PencilSimple size={18} />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={handleDelete}
                  className="text-destructive hover:text-destructive"
                >
                  <PhosphorIcons.Trash size={18} />
                </Button>
              </>
            )}
          </div>
        </div>
      </motion.div>

      {/* Project & Health & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaHealth
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          projectCount={projectCount}
          lastActivityDate={area.updatedAt}
        />
        <AreaInsights
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          projectCount={projectCount}
          notes={notes || []}
          createdAt={area.createdAt}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="rounded-md bg-card border border-border/60 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Projects</span>
            <PhosphorIcons.FolderOpen size={18} className="text-primary" />
          </div>
          <p className="text-2xl font-bold text-foreground">{projectCount}</p>
          <p className="text-xs text-muted-foreground mt-1">Active projects</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25 }}
          className="rounded-md bg-card border border-border/60 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Tasks</span>
            <PhosphorIcons.CheckCircle size={18} className="text-success" />
          </div>
          <p className="text-2xl font-bold text-foreground">{completedTasks}/{totalTasks}</p>
          <p className="text-xs text-muted-foreground mt-1">{Math.round((completedTasks / totalTasks) * 100) || 0}% complete</p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="rounded-md bg-card border border-border/60 p-4"
        >
          <div className="flex items-center justify-between mb-2">
            <span className="text-xs font-semibold text-muted-foreground uppercase">Notes</span>
            <PhosphorIcons.Note size={18} className="text-info" />
          </div>
          <p className="text-2xl font-bold text-foreground">{notes?.length || 0}</p>
          <p className="text-xs text-muted-foreground mt-1">Documentation</p>
        </motion.div>
      </div>

      {/* Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.35 }}
      >
        <AreaTimeline
          projects={projects || []}
          tasks={tasks || []}
          notes={notes || []}
          createdAt={area.createdAt}
        />
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Projects List */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.38 }}
          className="lg:col-span-2"
        >
          <div className="rounded-md bg-card border border-border/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <PhosphorIcons.FolderOpen size={20} className="text-primary" />
                Projects in this Area
              </h2>
              <span className="text-xs font-medium text-muted-foreground bg-muted/40 px-2 py-1 rounded">
                {projectCount}
              </span>
            </div>

            {projects && projects.length > 0 ? (
              <div className="space-y-2">
                {projects.map((project, index) => (
                  <motion.div
                    key={project.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 + index * 0.05 }}
                  >
                    <Link
                      href={`/projects/${project.id}`}
                      className="flex items-center gap-3 p-3 rounded-md bg-muted/20 hover:bg-muted/40 transition-colors group"
                    >
                      <div className="w-10 h-10 rounded-lg bg-primary/15 flex items-center justify-center flex-shrink-0 group-hover:bg-primary/25 transition-colors">
                        <PhosphorIcons.FolderOpen size={16} className="text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {project.name}
                        </p>
                        <p className="text-xs text-muted-foreground truncate">
                          {project.description || "No description"}
                        </p>
                      </div>
                      <PhosphorIcons.CaretRight size={16} className="text-muted-foreground" />
                    </Link>
                  </motion.div>
                ))}
              </div>
            ) : (
              <p className="text-sm text-muted-foreground py-4 text-center">
                No projects in this area yet
              </p>
            )}
          </div>
        </motion.div>

        {/* Quick Access Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
          className="space-y-4"
        >
          <div className="rounded-md bg-card border border-border/60 p-6 space-y-4">
            <h3 className="font-semibold text-foreground text-sm">Quick Actions</h3>
            <Button className="w-full gap-2" variant="outline">
              <PhosphorIcons.Plus size={16} />
              New Project
            </Button>
            <Button className="w-full gap-2" variant="outline">
              <PhosphorIcons.Plus size={16} />
              New Task
            </Button>
            <Button className="w-full gap-2" variant="outline">
              <PhosphorIcons.NotebookPencil size={16} />
              Add Note
            </Button>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: Collaboration & Advanced Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <AreaCollaborationHub
          areaName={area.name}
          areaId={areaId}
          projectCount={projectCount}
          taskCount={totalTasks}
          noteCount={notes?.length || 0}
        />
        <AreaAdvancedViews
          areaId={areaId}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          projectCount={projectCount}
        />
      </div>
    </motion.div>
  );
}

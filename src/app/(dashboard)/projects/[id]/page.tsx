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
import { ProjectHealth } from "@/components/projects/ProjectHealth";
import { ProjectInsights } from "@/components/projects/ProjectInsights";
import { ProjectTimeline } from "@/components/projects/ProjectTimeline";
import { CollaborationHub } from "@/components/projects/CollaborationHub";
import { AdvancedViews } from "@/components/projects/AdvancedViews";

export default function ProjectDetailPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;
  
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState("");
  const [editDesc, setEditDesc] = useState("");

  // Fetch project details
  const { data: project, isLoading, error } = trpc.para.getById.useQuery(
    { id: projectId },
    { enabled: !!projectId }
  );

  // Fetch project tasks
  const { data: tasks } = trpc.task.getByParaId.useQuery(
    { paraId: projectId },
    { enabled: !!projectId }
  );

  // Fetch project notes
  const { data: notes } = trpc.note.getByParaId.useQuery(
    { paraId: projectId },
    { enabled: !!projectId }
  );

  const updateProjectMutation = trpc.para.update.useMutation({
    onSuccess() {
      setIsEditing(false);
    },
  });

  const deleteProjectMutation = trpc.para.delete.useMutation({
    onSuccess() {
      router.push("/projects");
    },
  });

  const handleSaveEdit = async () => {
    if (!editName.trim()) return;
    updateProjectMutation.mutate({
      id: projectId,
      name: editName,
      description: editDesc,
    });
  };

  const handleDelete = async () => {
    if (confirm("Are you sure you want to delete this project? This action cannot be undone.")) {
      deleteProjectMutation.mutate({ id: projectId });
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-6">
        {/* Header skeleton */}
        <div className="h-48 bg-card border border-border rounded-lg animate-pulse" />
        {/* Content skeleton */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-32 bg-card border border-border rounded-lg animate-pulse" />
            ))}
          </div>
          <div className="space-y-4">
            {[...Array(3)].map((_, i) => (
              <div key={i} className="h-24 bg-card border border-border rounded-lg animate-pulse" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  if (error || !project) {
    return (
      <div className="flex flex-col items-center justify-center py-12 space-y-4">
        <div className="w-16 h-16 rounded-lg bg-destructive/10 flex items-center justify-center">
          <PhosphorIcons.Warning size={32} className="text-destructive" />
        </div>
        <h2 className="text-xl font-semibold text-foreground">Project not found</h2>
        <p className="text-sm text-muted-foreground">The project you're looking for doesn't exist.</p>
        <Button asChild>
          <Link href="/projects">Back to projects</Link>
        </Button>
      </div>
    );
  }

  const completedTasks = tasks?.filter(t => t.completed).length || 0;
  const totalTasks = tasks?.length || 0;
  const taskProgress = totalTasks > 0 ? (completedTasks / totalTasks) * 100 : 0;

  const projectStats = [
    { label: "Tasks", value: totalTasks, icon: PhosphorIcons.CheckCircle, color: "text-blue-500" },
    { label: "Completed", value: completedTasks, icon: PhosphorIcons.CheckCircle, color: "text-success" },
    { label: "Notes", value: notes?.length || 0, icon: PhosphorIcons.Note, color: "text-primary" },
  ];

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      className="space-y-6"
    >
      {/* Header Hero Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="relative overflow-hidden rounded-lg bg-gradient-to-br from-primary/20 via-primary/5 to-transparent border border-primary/20 p-8"
      >
        <div className="absolute inset-0 bg-grid-small-white/10 pointer-events-none" />
        
        <div className="relative z-10 flex items-start justify-between gap-6">
          <div className="flex-1">
            {isEditing ? (
              <div className="space-y-4">
                <Input
                  value={editName}
                  onChange={(e) => setEditName(e.target.value)}
                  className="text-2xl font-bold h-auto py-2"
                  placeholder="Project name"
                  autoFocus
                />
                <Input
                  value={editDesc}
                  onChange={(e) => setEditDesc(e.target.value)}
                  className="text-sm"
                  placeholder="Project description"
                />
                <div className="flex gap-2">
                  <Button onClick={handleSaveEdit} disabled={updateProjectMutation.isLoading}>
                    Save
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <>
                <h1 className="text-3xl font-bold text-foreground mb-2">{project.name}</h1>
                <p className="text-base text-muted-foreground mb-4">
                  {project.description || "No description provided"}
                </p>
                <div className="flex flex-wrap gap-2">
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-primary/15 text-primary text-sm font-medium">
                    <PhosphorIcons.Kanban size={14} />
                    Project
                  </span>
                  <span className="inline-flex items-center gap-2 px-3 py-1 rounded-md bg-muted/50 text-muted-foreground text-sm">
                    Created {new Date(project.createdAt).toLocaleDateString()}
                  </span>
                </div>
              </>
            )}
          </div>

          {!isEditing && (
            <div className="flex gap-2 flex-shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setEditName(project.name);
                  setEditDesc(project.description || "");
                  setIsEditing(true);
                }}
              >
                <PhosphorIcons.PencilSimple size={16} />
                Edit
              </Button>
              <Button
                variant="outline"
                size="sm"
                onClick={handleDelete}
                disabled={deleteProjectMutation.isLoading}
                className="text-destructive hover:text-destructive hover:bg-destructive/10"
              >
                <PhosphorIcons.Trash size={16} />
              </Button>
            </div>
          )}
        </div>
      </motion.div>

      {/* Progress Section */}
      {totalTasks > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="rounded-lg bg-card border border-border p-6"
        >
          <h2 className="text-lg font-semibold text-foreground mb-4">Project Progress</h2>
          <div className="space-y-4">
            <div>
              <div className="flex items-center justify-between mb-2">
                <span className="text-sm text-muted-foreground">Tasks completed</span>
                <span className="text-sm font-semibold text-foreground">{completedTasks} / {totalTasks}</span>
              </div>
              <div className="w-full h-2 rounded-full bg-muted/30 overflow-hidden">
                <motion.div
                  initial={{ width: 0 }}
                  animate={{ width: `${taskProgress}%` }}
                  transition={{ duration: 0.8, ease: "easeOut" }}
                  className="h-full bg-gradient-to-r from-primary to-success rounded-full"
                />
              </div>
            </div>
            <div className="text-xs text-muted-foreground">
              {taskProgress === 0 ? "No tasks started yet" : 
               taskProgress === 100 ? "All tasks completed! 🎉" :
               `${Math.round(taskProgress)}% complete`}
            </div>
          </div>
        </motion.div>
      )}

      {/* Project Health & Insights Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <ProjectHealth
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          overdueTasks={0}
          lastActivityDate={project.updatedAt}
        />
        <ProjectInsights
          totalTasks={totalTasks}
          completedTasks={completedTasks}
          notes={notes || []}
          createdAt={project.createdAt}
        />
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {projectStats.map((stat, index) => {
          const IconComponent = stat.icon;
          return (
            <motion.div
              key={stat.label}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.15 + index * 0.05 }}
              className="rounded-lg bg-card border border-border/60 p-5 hover:border-border hover:shadow-sm transition-all"
            >
              <div className="flex items-center gap-4">
                <div className={cn(
                  "w-10 h-10 rounded-lg flex items-center justify-center bg-primary/10",
                  stat.color
                )}>
                  <IconComponent size={20} />
                </div>
                <div>
                  <p className="text-xs text-muted-foreground font-medium uppercase">{stat.label}</p>
                  <p className="text-2xl font-bold text-foreground">{stat.value}</p>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* Timeline Section */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.4 }}
      >
        <ProjectTimeline
          tasks={tasks || []}
          notes={notes || []}
          createdAt={project.createdAt}
        />
      </motion.div>

      {/* Content Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tasks Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          className="lg:col-span-2"
        >
          <div className="rounded-lg bg-card border border-border/60 p-6">
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
                <PhosphorIcons.CheckCircle size={20} className="text-primary" />
                Tasks
              </h2>
              <Button size="sm" className="gap-2">
                <PhosphorIcons.Plus size={16} />
                Add Task
              </Button>
            </div>

            {!tasks || tasks.length === 0 ? (
              <div className="py-12 text-center">
                <PhosphorIcons.ClipboardText size={32} className="mx-auto text-muted-foreground/40 mb-3" />
                <p className="text-sm text-muted-foreground">No tasks yet</p>
                <p className="text-xs text-muted-foreground/60">Create a task to get started</p>
              </div>
            ) : (
              <div className="space-y-2">
                {tasks.map((task) => (
                  <div
                    key={task.id}
                    className="flex items-center gap-3 p-3 rounded-md hover:bg-muted/30 transition-colors"
                  >
                    <div className={cn(
                      "flex-shrink-0 w-5 h-5 rounded-md border-2 flex items-center justify-center transition-all",
                      task.completed
                        ? "bg-success/20 border-success"
                        : "border-border hover:border-primary"
                    )}>
                      {task.completed && (
                        <PhosphorIcons.Check size={14} className="text-success" weight="bold" />
                      )}
                    </div>
                    <span className={cn(
                      "flex-1 text-sm transition-all",
                      task.completed && "line-through text-muted-foreground"
                    )}>
                      {task.title}
                    </span>
                    {task.dueDate && (
                      <span className="text-xs text-muted-foreground">
                        {new Date(task.dueDate).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </motion.div>

        {/* Sidebar */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.35 }}
          className="space-y-6 lg:order-2"
        >
          {/* Notes Section */}
          <div className="rounded-lg bg-card border border-border/60 p-6">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-foreground flex items-center gap-2">
                <PhosphorIcons.Note size={18} className="text-primary" />
                Notes
              </h3>
              <Button size="sm" variant="ghost">
                <PhosphorIcons.Plus size={16} />
              </Button>
            </div>
            {!notes || notes.length === 0 ? (
              <p className="text-xs text-muted-foreground text-center py-4">No notes yet</p>
            ) : (
              <div className="space-y-2 max-h-96 overflow-y-auto">
                {notes.map((note) => (
                  <div key={note.id} className="p-2 rounded-md bg-muted/30 hover:bg-muted/50 transition-colors cursor-pointer">
                    <p className="text-xs font-medium text-foreground line-clamp-2">{note.title}</p>
                    <p className="text-[10px] text-muted-foreground mt-1">
                      {new Date(note.createdAt).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Quick Actions */}
          <div className="rounded-lg bg-gradient-to-br from-primary/10 to-transparent border border-primary/20 p-6">
            <h3 className="font-semibold text-foreground mb-4">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <PhosphorIcons.SquaresFour size={16} />
                View Kanban Board
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <PhosphorIcons.CalendarBlank size={16} />
                View Timeline
              </Button>
              <Button variant="ghost" className="w-full justify-start gap-2 text-sm">
                <PhosphorIcons.FileText size={16} />
                Generate Report
              </Button>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Bottom Grid: Collaboration & Advanced Views */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <CollaborationHub
          projectName={project.name}
          projectId={projectId}
          taskCount={totalTasks}
          noteCount={notes?.length || 0}
        />
        <AdvancedViews
          projectId={projectId}
          totalTasks={totalTasks}
          completedTasks={completedTasks}
        />
      </div>
    </motion.div>
  );
}

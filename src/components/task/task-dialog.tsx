"use client";

import React, { useEffect, useState } from "react";
import { Dialog } from "@base-ui/react/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import * as PhosphorIcons from "@phosphor-icons/react";
import { trpc } from "@/lib/trpc-client";
import { cn } from "@/lib/utils";

interface TaskDialogProps {
  task?: {
    id: string;
    title: string;
    description: string | null;
    priority: number | null;
    dueDate: Date | string | null;
    containerId: string | null;
  };
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSuccess?: () => void;
}

export function TaskDialog({ task, open, onOpenChange, onSuccess }: TaskDialogProps) {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [priority, setPriority] = useState(1);
  const [dueDate, setDueDate] = useState("");
  
  const utils = trpc.useUtils();

  useEffect(() => {
    if (task) {
      setTitle(task.title);
      setDescription(task.description || "");
      setPriority(task.priority || 1);
      setDueDate(task.dueDate ? new Date(task.dueDate).toISOString().split("T")[0] : "");
    } else {
      setTitle("");
      setDescription("");
      setPriority(1);
      setDueDate("");
    }
  }, [task, open]);

  const createMutation = trpc.task.create.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const updateMutation = trpc.task.update.useMutation({
    onSuccess: () => {
      utils.task.getAll.invalidate();
      onOpenChange(false);
      onSuccess?.();
    },
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const data = {
      title,
      description: description || undefined,
      priority,
      dueDate: dueDate ? new Date(dueDate) : undefined,
    };

    if (task) {
      updateMutation.mutate({ id: task.id, ...data });
    } else {
      createMutation.mutate(data);
    }
  };

  return (
    <Dialog.Root open={open} onOpenChange={onOpenChange}>
      <Dialog.Portal>
        <Dialog.Backdrop className="fixed inset-0 z-50 bg-black/50 backdrop-blur-sm" />
        <Dialog.Popup className="fixed left-1/2 top-1/2 z-50 w-full max-w-md -translate-x-1/2 -translate-y-1/2 border border-border bg-background p-6 shadow-lg sm:rounded-lg">
          <div className="flex items-center justify-between mb-4">
            <Dialog.Title className="text-lg font-semibold">
              {task ? "Edit Task" : "New Task"}
            </Dialog.Title>
            <Dialog.Close className="text-muted-foreground hover:text-foreground">
              <PhosphorIcons.X size={20} />
            </Dialog.Close>
          </div>

          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="title">Title</Label>
              <Input
                id="title"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="What needs to be done?"
                required
                autoFocus
              />
            </div>

            <div className="space-y-2">
              <Label htmlFor="description">Description</Label>
              <textarea
                id="description"
                className="flex min-h-[80px] w-full border border-border bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Add more details..."
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-2">
                <Label htmlFor="priority">Priority</Label>
                <select
                  id="priority"
                  className="w-full border border-border bg-background px-3 h-8 text-sm focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                  value={priority}
                  onChange={(e) => setPriority(Number(e.target.value))}
                >
                  <option value={1}>Low</option>
                  <option value={2}>Medium</option>
                  <option value={3}>High</option>
                  <option value={4}>Urgent</option>
                  <option value={5}>Critical</option>
                </select>
              </div>

              <div className="space-y-2">
                <Label htmlFor="dueDate">Due Date</Label>
                <Input
                  id="dueDate"
                  type="date"
                  value={dueDate}
                  onChange={(e) => setDueDate(e.target.value)}
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-4">
              <Button type="button" variant="ghost" onClick={() => onOpenChange(false)}>
                Cancel
              </Button>
              <Button type="submit" disabled={createMutation.isPending || updateMutation.isPending}>
                {createMutation.isPending || updateMutation.isPending ? (
                  <PhosphorIcons.CircleNotch className="animate-spin mr-2" size={16} />
                ) : null}
                {task ? "Save Changes" : "Create Task"}
              </Button>
            </div>
          </form>
        </Dialog.Popup>
      </Dialog.Portal>
    </Dialog.Root>
  );
}

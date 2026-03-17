"use client";

import { useState, useMemo } from "react";
import { SectionHeader } from "@/components/ui/section-header";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { trpc } from "@/lib/trpc-client";
import { PARACard } from "@/components/para/para-card";
import * as PhosphorIcons from "@phosphor-icons/react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AreasPage() {
  const { data: areas, isLoading } = trpc.para.getAll.useQuery({ type: "AREA" });
  const [isCreating, setIsCreating] = useState(false);
  const [newAreaName, setNewAreaName] = useState("");
  const [newAreaDesc, setNewAreaDesc] = useState("");
  const [searchTerm, setSearchTerm] = useState("");
  const [filter, setFilter] = useState<"all" | "active" | "empty">("all");

  const createAreaMutation = trpc.para.create.useMutation({
    onSuccess: () => {
      setNewAreaName("");
      setNewAreaDesc("");
      setIsCreating(false);
    },
  });

  const handleCreateNewArea = async () => {
    if (!newAreaName.trim()) return;
    await createAreaMutation.mutateAsync({
      type: "AREA",
      name: newAreaName,
      description: newAreaDesc,
    });
  };

  const handleResetCreateForm = () => {
    setNewAreaName("");
    setNewAreaDesc("");
    setIsCreating(false);
  };

  const filteredAreas = useMemo(() => {
    if (!areas) return [];
    
    let result = areas.filter(area =>
      area.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      area.description?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (filter === "active") {
      result = result.filter(a => (a as any)._count?.tasks > 0);
    } else if (filter === "empty") {
      result = result.filter(a => (a as any)._count?.tasks === 0);
    }

    return result;
  }, [areas, searchTerm, filter]);

  return (
    <div className="space-y-8 max-w-7xl mx-auto">
      <SectionHeader 
        label="Areas of Responsibility" 
        action={
          <Button
            onClick={() => setIsCreating((prev) => !prev)}
            className="gap-2"
            size="sm"
          >
            <PhosphorIcons.Plus size={16} weight="bold" />
            {isCreating ? "Cancel" : "New Area"}
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
                <h3 className="text-lg font-semibold text-foreground mb-1">Define new area</h3>
                <p className="text-sm text-muted-foreground">Add an area of responsibility to organize your work</p>
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
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Area Name</label>
                <Input
                  value={newAreaName}
                  onChange={(event) => setNewAreaName(event.target.value)}
                  placeholder="e.g., Product Development"
                  autoFocus
                />
              </div>
              <div className="space-y-2">
                <label className="text-xs font-semibold uppercase tracking-wide text-muted-foreground">Description</label>
                <Input
                  value={newAreaDesc}
                  onChange={(event) => setNewAreaDesc(event.target.value)}
                  placeholder="What is this area about..."
                />
              </div>
            </div>

            <div className="flex gap-3 mt-6">
              <Button
                onClick={handleCreateNewArea}
                disabled={createAreaMutation.isLoading || !newAreaName.trim()}
                className="gap-2"
              >
                {createAreaMutation.isLoading ? (
                  <>
                    <PhosphorIcons.Spinner size={16} className="animate-spin" />
                    Creating...
                  </>
                ) : (
                  <>
                    <PhosphorIcons.CheckCircle size={16} />
                    Create Area
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
              placeholder="Search areas by name or description..."
              className="pl-10"
            />
          </div>
          <p className="text-xs text-muted-foreground whitespace-nowrap">
            {filteredAreas.length} of {areas?.length || 0}
          </p>
        </div>

        {/* Filter controls */}
        <div className="flex flex-wrap gap-3">
          <div className="flex items-center gap-2 bg-card/50 border border-border/60 rounded-md px-3 py-2">
            <PhosphorIcons.FunnelSimple size={16} className="text-muted-foreground" />
            <select
              value={filter}
              onChange={(event) => setFilter(event.target.value as any)}
              className="bg-transparent text-xs font-medium text-foreground cursor-pointer outline-none"
            >
              <option value="all">All areas</option>
              <option value="active">With projects</option>
              <option value="empty">No projects</option>
            </select>
          </div>
        </div>
      </div>

      {/* Areas Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {isLoading &&
          Array.from({ length: 3 }).map((_, i) => (
            <motion.div
              key={i}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: i * 0.05 }}
              className="h-40 rounded-md bg-card border border-border/60 animate-pulse"
            />
          ))}

        {!isLoading && areas?.length === 0 && (
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="md:col-span-2 lg:col-span-3 rounded-md bg-card/50 border border-border/40 p-12 flex flex-col items-center justify-center text-center space-y-4"
          >
            <div className="w-16 h-16 rounded-lg bg-primary/10 flex items-center justify-center">
              <PhosphorIcons.ShieldCheck size={32} weight="duotone" className="text-primary" />
            </div>
            <div className="space-y-2">
              <h3 className="text-lg font-semibold text-foreground">No areas yet</h3>
              <p className="text-sm text-muted-foreground max-w-sm">
                Create an area of responsibility to organize your projects and ongoing work.
              </p>
            </div>
            <Button 
              onClick={() => setIsCreating(true)}
              className="gap-2 mt-2"
            >
              <PhosphorIcons.Plus size={16} />
              Create First Area
            </Button>
          </motion.div>
        )}

        {!isLoading && areas?.length > 0 && filteredAreas.length === 0 && (
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

        {filteredAreas.map((area, index) => (
          <motion.div
            key={area.id}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
          >
            <PARACard
              id={area.id}
              name={area.name}
              description={area.description}
              type="AREA"
              updatedAt={area.updatedAt}
              stats={{
                tasks: (area as any)._count?.tasks ?? 0,
                notes: (area as any)._count?.notes ?? 0
              }}
            />
          </motion.div>
        ))}
      </div>
    </div>
  );
}

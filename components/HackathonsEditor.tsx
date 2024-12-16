"use client";

import useHackathons from "@/hooks/useHackathons";

import { getApproved, getUnapproved } from "@/utils/hackathons";

import type { Hackathon } from "@/types";

import { Skeleton } from "@/components/ui/skeleton";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogTrigger,
  DialogContent as _DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogClose,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";

import { Pencil, Trash2 } from "lucide-react";

import DialogContent from "@/components/DialogContent";

import { useToast } from "@/hooks/use-toast";

interface HackathonActionsProps {
  hackathon: Hackathon;
  handleDelete: (
    e: React.FormEvent,
    id: number,
    name: string,
    mode: string,
    country: string,
    city: string,
    start_date: string,
    end_date: string,
    featured: boolean,
    link: string,
  ) => Promise<void>;
}

function HackathonActions({ hackathon, handleDelete }: HackathonActionsProps) {
  return (
    <li key={hackathon.id} className="flex items-center justify-between gap-4">
      <div>
        <h3 className="flex items-center gap-2 text-xl font-semibold">
          {hackathon.name}
          {hackathon.featured && <Badge variant="secondary">Featured</Badge>}
        </h3>
        <p className="text-muted-foreground">
          {hackathon.city}, {hackathon.country}
        </p>
      </div>
      <div className="space-x-2">
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-sm/6 font-semibold">
              Edit
              <Pencil size={16} />
            </Button>
          </DialogTrigger>
          <DialogContent formData={hackathon} isEditing />
        </Dialog>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="text-sm/6 font-semibold" variant="destructive">
              Delete
              <Trash2 size={16} />
            </Button>
          </DialogTrigger>
          <_DialogContent>
            <DialogHeader>
              <DialogTitle>
                Are you sure you want to delete this hackathon?
              </DialogTitle>
              <DialogDescription>
                This action cannot be undone.
              </DialogDescription>
            </DialogHeader>
            <DialogClose asChild>
              <Button
                className="text-sm/6 font-semibold"
                variant="destructive"
                onClick={(e) =>
                  hackathon.id !== undefined &&
                  handleDelete(
                    e,
                    hackathon.id,
                    hackathon.name,
                    hackathon.mode,
                    hackathon.country,
                    hackathon.city,
                    hackathon.start_date,
                    hackathon.end_date,
                    hackathon.featured,
                    hackathon.link,
                  )
                }
              >
                Delete
                <Trash2 size={16} />
              </Button>
            </DialogClose>
          </_DialogContent>
        </Dialog>
      </div>
    </li>
  );
}

function Editor({
  title,
  data,
  isLoading,
  className,
  setHackathons,
}: {
  title: string;
  data: Hackathon[];
  isLoading: boolean;
  className?: string;
  setHackathons: React.Dispatch<React.SetStateAction<Hackathon[]>>;
}) {
  const { toast } = useToast();

  const handleDelete = async (
    e: React.FormEvent,
    id: number,
    name: string,
    mode: string,
    country: string,
    city: string,
    start_date: string,
    end_date: string,
    featured: boolean,
    link: string,
  ) => {
    const dataToSubmit = {
      id,
      name,
      mode,
      country,
      city,
      start_date,
      end_date,
      featured,
      link,
    };

    const endpoint = "/api/delete";
    const response = await fetch(endpoint, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify(dataToSubmit),
    });

    if (response.ok) {
      setHackathons((prevHackathons) =>
        prevHackathons.filter((hackathon) => hackathon.id !== id),
      );

      toast({
        title: "Deleted Hackathon",
        description: `${name} has been deleted successfully.`,
      });
    } else {
      toast({
        variant: "destructive",
        title: "Failed to delete Hackathon",
        description: `Failed to delete ${name}.`,
      });
    }
  };

  return (
    <>
      <h2 className={`text-2xl font-bold ${className}`}>{title}</h2>
      <ul className="mt-4">
        {isLoading ? (
          <div className="space-y-4">
            {Array.from({ length: 3 }).map((_, index) => (
              <Skeleton key={index} className="h-12" />
            ))}
          </div>
        ) : (
          <>
            {data.map((hackathon: Hackathon) => (
              <HackathonActions
                hackathon={hackathon}
                handleDelete={handleDelete}
                key={hackathon.id}
              />
            ))}
          </>
        )}
      </ul>
    </>
  );
}

export default function HackathonsEditor() {
  const { hackathons, isLoading, setHackathons } = useHackathons();
  const approved = getApproved(hackathons);
  const unapproved = getUnapproved(hackathons);

  return (
    <section>
      <Editor
        title="Hackathons to approve"
        data={unapproved}
        isLoading={isLoading}
        setHackathons={setHackathons}
      />
      <Editor
        title="Approved Hackathons"
        data={approved}
        isLoading={isLoading}
        className="mt-16"
        setHackathons={setHackathons}
      />
    </section>
  );
}

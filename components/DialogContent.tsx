"use client";

import {
  DialogContent as _DialogContent,
  DialogClose,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useEffect } from "react";
import { useToast } from "@/hooks/use-toast";
import { Pencil, Plus } from "lucide-react";
import { countriesTo2Digit, countriesFrom2Digit } from "@/utils/countries";

const hackathonSchema = z
  .object({
    // Campi obbligatori
    name: z.string().min(1, "Name is required"),
    mode: z.enum(["onsite", "online", "hybrid"], {
      required_error: "Mode is required",
    }),
    country: z.string().min(1, "Country is required"),
    city: z.string().min(1, "City is required"),
    start_date: z.string().min(1, "Start date is required"),
    end_date: z.string().min(1, "End date is required"),
    link: z.string().url("Invalid URL format"),
    approved: z.boolean(),
    featured: z.boolean(),

    // Campi opzionali
    prize: z.preprocess(
      (value) => (isNaN(value as number) ? undefined : value),
      z.number().positive().optional(),
    ),
    participants: z.preprocess(
      (value) => (isNaN(value as number) ? undefined : value),
      z.number().positive().optional(),
    ),
    topic: z.string().optional(),
    sponsor: z.string().optional(),
  })
  .refine(
    (data) => {
      const start = new Date(data.start_date);
      const end = new Date(data.end_date);
      return end >= start;
    },
    {
      message: "End date must be after start date",
      path: ["end_date"],
    },
  );

type HackathonFormData = z.infer<typeof hackathonSchema>;

interface DialogContentProps {
  formData?: HackathonFormData;
  isEditing?: boolean;
}

// TODO: hackathons state management on edit and add
export default function DialogContent({
  formData: initialFormData,
  isEditing = false,
}: DialogContentProps) {
  const { toast } = useToast();

  // ! Edit function returns:
  /*
    {
      code: '22P02',
      details: null,
      hint: null,
      message: 'invalid input syntax for type bigint: "undefined"'
    }
  */
  const form = useForm<HackathonFormData>({
    resolver: zodResolver(hackathonSchema),
    mode: "onChange",
    defaultValues: {
      name: "",
      mode: "onsite",
      country: "",
      city: "",
      start_date: "",
      end_date: "",
      link: "",
      prize: initialFormData?.prize ?? undefined,
      participants: initialFormData?.participants ?? undefined,
      topic: initialFormData?.topic ?? undefined,
      sponsor: initialFormData?.sponsor ?? "",
      approved: false,
      featured: false,
      ...initialFormData,
    },
  });

  useEffect(() => {
    if (initialFormData) {
      form.reset({
        ...initialFormData,
        start_date: initialFormData.start_date.split("T")[0],
        end_date: initialFormData.end_date.split("T")[0],
        country:
          countriesFrom2Digit[initialFormData.country] ||
          initialFormData.country,
      });
    }
  }, [initialFormData, form]);

  const onSubmit = async (data: HackathonFormData) => {
    const endpoint = isEditing ? "/api/edit" : "/api/add";
    try {
      const response = await fetch(endpoint, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          ...data,
          country: countriesTo2Digit[data.country] || data.country,
        }),
      });

      if (!response.ok) throw new Error();

      toast({
        title: `${isEditing ? "Updated" : "Added"} Hackathon`,
        description: `${data.name} has been ${
          isEditing ? "updated" : "added"
        } successfully.`,
      });
    } catch {
      toast({
        variant: "destructive",
        title: `Failed to ${isEditing ? "update" : "add"} Hackathon`,
        description: `An error occurred while trying to ${
          isEditing ? "update" : "add"
        } ${data.name}.`,
      });
    }
  };

  return (
    <_DialogContent>
      <DialogHeader>
        <DialogTitle>
          {isEditing ? "Edit Hackathon" : "Submit a Hackathon"}
        </DialogTitle>
        <DialogDescription>
          {isEditing
            ? "Modify the form below to update the hackathon."
            : "Fill out the form below to submit a new hackathon."}
        </DialogDescription>
      </DialogHeader>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
        <div className="text-lg font-semibold">Basic Information</div>
        <div>
          <Label htmlFor="name">Name</Label>
          <Input
            id="name"
            {...form.register("name")}
            aria-invalid={!!form.formState.errors.name}
          />
          {form.formState.errors.name && (
            <p className="text-sm text-red-500">
              {form.formState.errors.name.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="mode">Mode</Label>
          <Select
            onValueChange={(value) =>
              form.setValue("mode", value as "onsite" | "online" | "hybrid")
            }
            value={form.watch("mode")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select mode" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="onsite">Onsite</SelectItem>
              <SelectItem value="online">Online</SelectItem>
              <SelectItem value="hybrid">Hybrid</SelectItem>
            </SelectContent>
          </Select>
          {form.formState.errors.mode && (
            <p className="text-sm text-red-500">
              {form.formState.errors.mode.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="start_date">Start Date</Label>
          <Input id="start_date" type="date" {...form.register("start_date")} />
          {form.formState.errors.start_date && (
            <p className="text-sm text-red-500">
              {form.formState.errors.start_date.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="end_date">End Date</Label>
          <Input id="end_date" type="date" {...form.register("end_date")} />
          {form.formState.errors.end_date && (
            <p className="text-sm text-red-500">
              {form.formState.errors.end_date.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="country">Country</Label>
          <Select
            onValueChange={(value) => form.setValue("country", value)}
            value={form.watch("country")}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select country" />
            </SelectTrigger>
            <SelectContent>
              {Object.entries(countriesFrom2Digit).map(([code, name]) => (
                <SelectItem key={code} value={name}>
                  {name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          {form.formState.errors.country && (
            <p className="text-sm text-red-500">
              {form.formState.errors.country.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="city">City</Label>
          <Input id="city" {...form.register("city")} />
          {form.formState.errors.city && (
            <p className="text-sm text-red-500">
              {form.formState.errors.city.message}
            </p>
          )}
        </div>
        <div>
          <Label htmlFor="link">Link</Label>
          <Input id="link" type="url" {...form.register("link")} />
          {form.formState.errors.link && (
            <p className="text-sm text-red-500">
              {form.formState.errors.link.message}
            </p>
          )}
        </div>
        <Accordion type="single" collapsible>
          <AccordionItem value="item-1">
            <AccordionTrigger>
              <div className="text-lg font-semibold">
                Additional Information
              </div>
            </AccordionTrigger>
            <AccordionContent className="space-y-4">
              <div>
                <Label htmlFor="prize">Prize</Label>
                <Input
                  id="prize"
                  type="number"
                  {...form.register("prize", {
                    valueAsNumber: true,
                    setValueAs: (value) => (isNaN(value) ? undefined : value),
                  })}
                />
                {form.formState.errors.prize && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.prize.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="participants">Participants</Label>
                <Input
                  id="participants"
                  type="number"
                  {...form.register("participants", {
                    valueAsNumber: true,
                    setValueAs: (value) => (isNaN(value) ? undefined : value),
                  })}
                />
                {form.formState.errors.participants && (
                  <p className="text-sm text-red-500">
                    {form.formState.errors.participants.message}
                  </p>
                )}
              </div>
              <div>
                <Label htmlFor="sponsor">Sponsor</Label>
                <Input
                  id="sponsor"
                  {...form.register("sponsor", {
                    setValueAs: (value) => (value === "" ? undefined : value),
                  })}
                />
              </div>
              <div>
                <Label htmlFor="topic">Topic</Label>
                <Select
                  onValueChange={(value) =>
                    form.setValue("topic", value as HackathonFormData["topic"])
                  }
                  value={form.watch("topic")}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select topic" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="web">Web</SelectItem>
                    <SelectItem value="mobile">Mobile</SelectItem>
                    <SelectItem value="design">Design</SelectItem>
                    <SelectItem value="hardware">Hardware</SelectItem>
                    <SelectItem value="ai">AI</SelectItem>
                    <SelectItem value="blockchain">Blockchain</SelectItem>
                    <SelectItem value="iot">IoT</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </AccordionContent>
          </AccordionItem>
        </Accordion>
        {isEditing && (
          <>
            <div className="text-lg font-semibold">Status</div>
            <div className="flex items-center gap-2">
              <Label htmlFor="featured">Featured</Label>
              <Checkbox
                id="featured"
                checked={form.watch("featured")}
                onCheckedChange={(checked) =>
                  form.setValue("featured", !!checked)
                }
                className="size-6"
              />
            </div>
            <div className="flex items-center gap-2">
              <Label htmlFor="approved">Approved</Label>
              <Checkbox
                id="approved"
                checked={form.watch("approved")}
                onCheckedChange={(checked) =>
                  form.setValue("approved", !!checked)
                }
                className="size-6"
              />
            </div>
          </>
        )}
        <DialogClose asChild>
          <Button
            type="submit"
            className="w-full text-sm/6 font-semibold"
            disabled={!form.formState.isValid}
          >
            {isEditing ? (
              <>
                Update
                <Pencil size={16} />
              </>
            ) : (
              <>
                Add
                <Plus size={16} />
              </>
            )}
          </Button>
        </DialogClose>
      </form>
    </_DialogContent>
  );
}

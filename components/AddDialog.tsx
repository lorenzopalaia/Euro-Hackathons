import ShinyButton from "@/components/ui/shiny-button";
import { Dialog, DialogTrigger } from "@/components/ui/dialog";

import DialogContent from "@/components/DialogContent";

import { Plus } from "lucide-react";

export default function AddDialog() {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <ShinyButton>
          <div className="flex items-center gap-2">
            <p className="font-bold">Submit a Hackathon</p>
            <Plus size={16} />
          </div>
        </ShinyButton>
      </DialogTrigger>
      <DialogContent />
    </Dialog>
  );
}

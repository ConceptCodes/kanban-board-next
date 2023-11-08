import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { useForm } from "react-hook-form";
import { PlusCircleIcon, icons } from "lucide-react";
import { useState } from "react";

import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "./ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "./ui/form";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { ToastAction } from "./ui/toast";
import { Textarea } from "./ui/textarea";

import { useToast } from "@/hooks/useToast";
import { api } from "@/utils/api";
import { insertTaskSchema } from "@/server/db/schema";
import useStore from "@/hooks/useStore";

const AddTaskModal = () => {
  const [open, setOpen] = useState(false);
  const { toast } = useToast();
  const utils = api.useUtils();

  const { currentBoard } = useStore();

  const form = useForm<z.infer<typeof insertTaskSchema>>({
    resolver: zodResolver(
      insertTaskSchema.pick({ title: true, description: true }),
    ),
    defaultValues: {
      title: "",
      description: "",
    },
  });

  async function onSubmit(values: z.infer<typeof insertTaskSchema>) {
    try {
      await addTaskMutation.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  }

  const addTaskMutation = api.main.createTask.useMutation({
    onSuccess: () => {
      form.reset();
      setOpen(false);
    },
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
    onSettled: async () => await utils.main.getAllTasks.invalidate(),
  });

  return (
    <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
      <DialogTrigger asChild>
        <Button
          className="btn btn-primary disabled:bg-muted-foreground"
          disabled={!currentBoard}
        >
          <PlusCircleIcon className="mr-2 inline-block h-6 w-6" />
          Add New Task
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>New Kanban Board</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Side Project #236" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="description"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Description</FormLabel>
                  <FormControl>
                    <Textarea
                      placeholder="Lorem ipsum sit alor dit amet"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <DialogFooter>
              <Button type="submit" className="w-full">
                Create Task
              </Button>
            </DialogFooter>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
};

export default AddTaskModal;

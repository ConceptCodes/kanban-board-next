import { PlusCircleIcon, TrashIcon } from "lucide-react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useState } from "react";
import { z } from "zod";

import { Label } from "@/components/ui/label";
import { Board, insertBoardSchema } from "@/server/db/schema";
import {
  Dialog,
  DialogContent,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import Icon from "./icon";
import { ToastAction } from "./ui/toast";
import { Button } from "./ui/button";

import { api } from "@/utils/api";
import { useToast } from "@/hooks/useToast";
import { useLocalStorage } from "@/hooks/useLocalStorage";
import { cn } from "@/utils";

const icons = ["📚", "💻", "🎨", "🎵", "🎥", "📷", "🏋️‍♂️", "🍔", "🌍", "🎓"];

export const Sidebar = () => {
  const { data, isLoading, isError, error } = api.main.getAllBoards.useQuery();
  const [open, setOpen] = useState(false);

  const { toast } = useToast();

  const utils = api.useUtils();

  const [selectedBoard, setSelectedBoard] = useLocalStorage<Board | null>(
    "selectedBoard",
    null,
  );

  const addBoardMutation = api.main.createBoard.useMutation({
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
    onSettled: async () => await utils.main.getAllBoards.invalidate(),
  });

  const removeBoardMutation = api.main.removeBoard.useMutation({
    onSuccess: () => {
      toast({
        title: "Board deleted",
        description: "Your board has been deleted.",
      });
    },
    onSettled: async () => await utils.main.getAllBoards.invalidate(),
    onError: (error) => {
      toast({
        variant: "destructive",
        title: "Uh oh! Something went wrong.",
        description: error.message,
        action: <ToastAction altText="Try again">Try again</ToastAction>,
      });
    },
  });

  const form = useForm<z.infer<typeof insertBoardSchema>>({
    resolver: zodResolver(insertBoardSchema.pick({ title: true, icon: true })),
    defaultValues: {
      title: "",
      icon: icons[0],
    },
  });

  async function onSubmit(values: z.infer<typeof insertBoardSchema>) {
    try {
      await addBoardMutation.mutateAsync(values);
    } catch (error) {
      console.error(error);
    }
  }

  const Board = (board: Board) => {
    return (
      <div
        className={cn(
          "block flex rounded px-4 py-2.5 capitalize transition duration-200 hover:bg-gray-700",
          {
            "bg-gray-700": selectedBoard?.id === board.id,
          },
        )}
        onClick={() => setSelectedBoard(board)}
      >
        <span className="mr-2">{board.icon}</span>
        {board.title}
        <TrashIcon
          className="ml-auto h-4 w-4 cursor-pointer hover:text-red-500"
          onClick={() => {
            removeBoardMutation.mutate({ id: board.id });
          }}
        />
      </div>
    );
  };

  return (
    <aside className="w-64 space-y-4 bg-gray-800 p-6 text-white">
      <h1 className="mb-4 text-2xl">Kanban</h1>
      <Label className="mb-4 text-muted-foreground">
        All Boards ({data?.length || 0})
      </Label>
      <nav>
        {isLoading && <div>Loading...</div>}
        {isError && <div>{error.message}</div>}
        {data?.map((board) => <Board key={board.id} {...board} />)}
      </nav>
      <Dialog open={open} onOpenChange={(open) => setOpen(open)}>
        <DialogTrigger>
          <PlusCircleIcon className="mr-2 inline-block h-6 w-6" />
          Create New Board
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
                name="icon"
                render={({ field }) => (
                  <FormItem className="">
                    <FormLabel>Icon</FormLabel>
                    <div className="grid grid-cols-5 gap-2">
                      {icons.map((icon) => (
                        <FormControl key="index">
                          <Icon
                            key={icon}
                            icon={icon}
                            selected={field.value === icon}
                            onClick={() => {
                              form.setValue("icon", icon);
                            }}
                          />
                        </FormControl>
                      ))}
                    </div>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <DialogFooter>
                <Button type="submit">Continue</Button>
              </DialogFooter>
            </form>
          </Form>
        </DialogContent>
      </Dialog>
    </aside>
  );
};

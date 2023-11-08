import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@/components/ui/dialog";
import { Card, CardHeader, CardTitle } from "./ui/card";
import { Task } from "@/server/db/schema";
import { Badge } from "./ui/badge";

const ViewTaskModal = (task: Task) => {
  const TaskCard = () => {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{task.title}</CardTitle>
        </CardHeader>
      </Card>
    );
  };

  return (
    <Dialog>
      <DialogTrigger asChild>
        <TaskCard />
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{task.title}</DialogTitle>
          <DialogDescription>{task.description}</DialogDescription>
          <DialogFooter>
            <Badge>{task.status}</Badge>
          </DialogFooter>
        </DialogHeader>
      </DialogContent>
    </Dialog>
  );
};

export default ViewTaskModal;

import Head from "next/head";

import { Sidebar } from "@/components/sidebar";
import AddTaskModal from "@/components/add-task-modal";

import useStore from "@/hooks/useStore";
import { api } from "@/utils/api";

export default function Home() {
  const { currentBoard } = useStore();

  const { data, isLoading, isError, error } = api.main.getAllTasks.useQuery(
    {
      id: currentBoard?.id!,
    },
    {
      enabled: !!currentBoard,
    },
  );

  return (
    <>
      <Head>
        <title>Kanban Board</title>
        <meta name="description" content="a basic kanban board" />
        <link rel="icon" href="/favicon.ico" />
      </Head>
      <main className="flex h-screen overflow-hidden">
        <Sidebar />
        <section className="flex-1 bg-gray-100 p-6">
          <header className="mb-6 flex items-center justify-between border-b-2 pb-5">
            <h1 className="text-3xl font-bold capitalize">
              {currentBoard?.title ?? "Select a board"}
            </h1>
            <AddTaskModal />
          </header>
        </section>
      </main>
    </>
  );
}

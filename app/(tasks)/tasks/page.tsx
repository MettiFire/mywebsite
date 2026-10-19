import TasksApp from "@/components/tasks/TasksApp";

export const metadata = {
  title: "Tasks",
  robots: { index: false, follow: false },
};

export default function TasksPage() {
  return <TasksApp />;
}

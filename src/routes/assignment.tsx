import { createFileRoute, redirect } from "@tanstack/react-router";

export const Route = createFileRoute("/assignment")({
  beforeLoad: () => {
    throw redirect({ to: "/" });
  },
});

import { SectionTitle, Body } from "./Typography";
import { PageTransition } from "./PageTransition";

interface ErrorStateProps {
  title: string;
  message: string;
}

export function ErrorState({ title, message }: ErrorStateProps) {
  return (
    <PageTransition className="flex flex-col items-start justify-center min-h-[50vh] px-8 lg:px-16">
      <SectionTitle className="mb-4 text-error">{title}</SectionTitle>
      <Body className="text-secondary">{message}</Body>
    </PageTransition>
  );
}

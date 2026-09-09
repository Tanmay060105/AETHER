import { SectionTitle, Body } from "./Typography";
import { PageTransition } from "./PageTransition";

interface EmptyStateProps {
  title: string;
  description: string;
}

export function EmptyState({ title, description }: EmptyStateProps) {
  return (
    <PageTransition className="flex flex-col items-start justify-center min-h-[50vh] px-8 lg:px-16">
      <SectionTitle className="mb-4 text-secondary">{title}</SectionTitle>
      <Body className="text-tertiary">{description}</Body>
    </PageTransition>
  );
}

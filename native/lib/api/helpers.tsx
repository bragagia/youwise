import { useAPI } from "@/lib/api/apiProvider";

export function SignedInOnly({ children }: { children?: React.ReactNode }) {
  const api = useAPI();

  if (!api.userStored) {
    return null;
  }

  return <>{children}</>;
}

export function SignedOutOnly({ children }: { children?: React.ReactNode }) {
  const api = useAPI();

  if (api.userStored) {
    return null;
  }

  return <>{children}</>;
}

import AuthGuard from "@/components/AuthGuardian";

export const metadata = {
  title: "Protected | michal3",
};

export default function PrivateLayout({ children }: { children: React.ReactNode }) {
  return (
    <>
      <AuthGuard>
        {children}
      </AuthGuard>
    </>
  );
}

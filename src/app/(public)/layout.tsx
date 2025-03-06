export const metadata = {
    title: "Public | michal3",
  };
  
  export default function PublicLayout({ children }: { children: React.ReactNode }) {
    return (
      <>
        {children} {/* Render public pages */}
      </>
    );
  }
  
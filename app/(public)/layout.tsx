import { Navbar } from "@/components/layout/Navbar";
import { Footer } from "@/components/layout/Footer";
import { LoadingScreen } from "@/components/layout/LoadingScreen";
import { Concierge } from "@/components/chat/Concierge";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <>
      <LoadingScreen />
      <Navbar />
      <main className="flex flex-col min-h-screen">
        {children}
      </main>
      <Footer />
      <Concierge />
    </>
  );
}

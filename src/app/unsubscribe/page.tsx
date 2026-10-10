import { prisma } from "@/lib/db";
import { XCircle, MailX, CheckCircle2 } from "lucide-react";
import Link from "next/link";

export const dynamic = 'force-dynamic';

type Props = {
  searchParams: { [key: string]: string | string[] | undefined };
};

export default async function UnsubscribePage({ searchParams }: Props) {
  // Await searchParams for Next.js 15 compatibility, but fallback safely
  const params = await Promise.resolve(searchParams);
  const emailParam = params?.email;
  const email = Array.isArray(emailParam) ? emailParam[0] : emailParam;

  if (!email) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Invalid Link</h1>
        <p className="text-white/60 mb-8">No email address was provided to unsubscribe.</p>
        <Link href="/" className="px-6 py-3 bg-white text-black font-bold rounded-full">
          Return Home
        </Link>
      </div>
    );
  }

  try {
    const subscriber = await prisma.subscriber.findUnique({
      where: { email },
    });

    if (subscriber) {
      await prisma.subscriber.update({
        where: { email },
        data: { status: "unsubscribed" },
      });
    }

    return (
      <div className="min-h-screen bg-[#0a0a0a] text-white flex flex-col items-center justify-center p-4">
        <MailX className="w-16 h-16 text-green-400 mb-6" />
        <h1 className="text-3xl font-bold mb-3">Successfully Unsubscribed</h1>
        <p className="text-white/60 mb-8 text-center max-w-md">
          <strong className="text-white">{email}</strong> has been removed from the mailing list. You will no longer receive mass emails from this portfolio.
        </p>
        <Link href="/" className="px-6 py-3 bg-white hover:bg-gray-200 transition-colors text-black font-bold rounded-xl flex items-center gap-2">
          Return to Portfolio
        </Link>
      </div>
    );
  } catch (error) {
    return (
      <div className="min-h-screen bg-black text-white flex flex-col items-center justify-center p-4">
        <XCircle className="w-16 h-16 text-red-500 mb-6" />
        <h1 className="text-2xl font-bold mb-2">Something went wrong</h1>
        <p className="text-white/60 mb-8">We couldn't process your request right now. Please try again later.</p>
        <Link href="/" className="px-6 py-3 bg-white text-black font-bold rounded-full">
          Return Home
        </Link>
      </div>
    );
  }
}

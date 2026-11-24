import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Terms & Conditions | Real Success",
  description: "Official Terms and Conditions of Service for the Real Success app and platform.",
};

async function getTermsConditions() {
  const apiUrl = process.env.NEXT_PUBLIC_API_URL || "https://api.ourrealsuccess.com/api";
  try {
    const res = await fetch(`${apiUrl}/content/terms/`, { next: { revalidate: 60 } });
    if (!res.ok) throw new Error("Failed to fetch terms");
    const json = await res.json();
    return json?.data?.content || "<p>By accessing or using the RealSuccess platform, you agree to be bound by these terms.</p>";
  } catch {
    return "<p>By accessing or using the RealSuccess platform, you agree to be bound by these terms.</p>";
  }
}

export default async function TermsConditionsPage() {
  const content = await getTermsConditions();

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col font-sans text-gray-900">
      <header className="bg-gradient-to-r from-blue-900 to-blue-600 text-white py-12 px-6 text-center shadow-sm">
        <div className="max-w-4xl mx-auto">
          <h1 className="text-3xl md:text-4xl font-extrabold tracking-tight">Real Success</h1>
          <p className="mt-2 text-blue-100 text-lg">Terms &amp; Conditions of Service</p>
          <span className="inline-block mt-3 px-3 py-1 bg-white/20 rounded-full text-xs text-blue-50">
            Apple App Store &amp; Google Play Store Compliant
          </span>
        </div>
      </header>

      <main className="max-w-4xl w-full mx-auto -mt-6 px-4 pb-16 flex-1">
        <article
          className="bg-white rounded-2xl p-6 md:p-10 shadow-sm border border-gray-200/80 prose prose-blue max-w-none text-left"
          dangerouslySetInnerHTML={{ __html: content }}
        />
      </main>

      <footer className="text-center py-6 text-xs text-gray-500 border-t border-gray-200 bg-white">
        <p>&copy; {new Date().getFullYear()} Real Success. All rights reserved.</p>
        <p className="mt-2 space-x-3">
          <a href="/terms-conditions" className="text-blue-600 hover:underline">Terms &amp; Conditions</a>
          <span>&bull;</span>
          <a href="/privacy-policy" className="text-blue-600 hover:underline">Privacy Policy</a>
        </p>
      </footer>
    </div>
  );
}

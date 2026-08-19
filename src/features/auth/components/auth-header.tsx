import Image from "next/image";

interface AuthHeaderProps {
  title?: string;
  subtitle?: string;
}

export function AuthHeader({
  title = "Welcome Real Success",
  subtitle,
}: AuthHeaderProps) {
  return (
    <div className="flex flex-col items-center text-center space-y-3 mb-6">
      <div className="p-2.5 bg-white rounded-xl border border-gray-200/80 shadow-xs inline-flex items-center justify-center min-w-[130px] min-h-[50px]">
        <Image
          src="/logo.png"
          alt="Real Success Logo"
          width={130}
          height={45}
          priority
          className="h-11 w-auto object-contain"
        />
      </div>
      <h1 className="text-2xl font-bold tracking-tight text-gray-900 md:text-3xl">
        {title}
      </h1>
      {subtitle && (
        <p className="text-sm text-gray-500 max-w-sm font-normal">
          {subtitle}
        </p>
      )}
    </div>
  );
}

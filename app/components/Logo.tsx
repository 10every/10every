import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-16 w-auto" }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="10every"
      width={64}
      height={64}
      className={className}
    />
  );
}

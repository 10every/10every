import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-10 w-auto" }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="10every"
      width={40}
      height={40}
      className={className}
    />
  );
}

import Image from 'next/image';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-12 w-auto" }: LogoProps) {
  return (
    <Image
      src="/logo.png"
      alt="10every"
      width={46}
      height={46}
      className={className}
    />
  );
}

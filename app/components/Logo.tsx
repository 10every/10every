import Image from 'next/image';
import { useRouter } from 'next/navigation';

interface LogoProps {
  className?: string;
}

export function Logo({ className = "h-72 w-auto" }: LogoProps) {
  const router = useRouter();

  const handleClick = () => {
    router.push('/');
  };

  return (
    <button
      onClick={handleClick}
      className="cursor-pointer hover:opacity-80 transition-opacity"
    >
      <Image
        src="/new logo.png"
        alt="10every"
        width={280}
        height={280}
        className={className}
      />
    </button>
  );
}

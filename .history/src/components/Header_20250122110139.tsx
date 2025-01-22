
import {
    SignInButton,
    SignedIn,
    SignedOut,
    UserButton
  } from '@clerk/nextjs';
  import Container from '@/components/Container';
  import Link from 'next/link';
  import Image from 'next/image';

const Header = () => {
    return (
      <header className="mt-8 mb-0 border-b pb-12">
          <Container>
          <div className="flex items-center justify-between gap-20 logo">
          <Link href="/dashboard">
            <Image src="/hclogo.png" alt="Happiness Computer Logo" width={90} height={52} className="h-6 w-11" /><h1 className="text-3xl font-bold head-title">Happiness Computers</h1>
            </Link>
              
        <div>
        <SignedOut>
          <SignInButton />
        </SignedOut>
        <SignedIn>
          <UserButton />
        </SignedIn>
      </div>
    </div>
    </Container>
  </header>


    );
  };
  
  export default Header;
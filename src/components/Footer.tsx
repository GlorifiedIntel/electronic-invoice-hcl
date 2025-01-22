  import Container from '@/components/Container';


const Footer = () => {
    return (
    <footer className="mt-12 mb-8">
    <Container className="flex justify-between gap-4">
      <p className="text-sm">
        Happiness Computers &copy; {new Date().getFullYear()}. All Rights Reserved.</p>
        <p className="text-sm">Designed & Devekoped by: Kevin Cross Minchakpu</p>
        <p className="text-sm">Created with NextJS, Xata and Clerk</p>
    </Container>
    </footer>
    );
  };
  
  export default Footer;
import { cn } from "@/lib/utils";

const Container = ({children, className, ...props}: React.ComponentProps<"div">) => {
    return (
      <div {...props} className={cn('max-w-5xl mx-auto', className)}>
        {children}
      </div>
    );
  };
  
  export default Container;
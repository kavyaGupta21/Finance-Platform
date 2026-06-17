import { Layout } from "lucide-react";
import type { PropsWithChildren } from "react";

const MainLayout = ({ children }: PropsWithChildren<{}>) => {
  return <div className="container mx-auto my-32 p-4  ">{children}</div>;
};

export default MainLayout;

import type { PropsWithChildren } from "react";
import { Inter } from "next/font/google";

const inter = Inter({ subsets: ['latin'] });

export function Layout(props: PropsWithChildren) {
  return (
    <main className={`${inter.className} flex justify-center h-screen`}>
      <div className="w-full md:max-w-2xl border-x border-slate-400 min-h-screen h-full overflow-y-auto">
        {props.children}
      </div>
    </main>
  );
}

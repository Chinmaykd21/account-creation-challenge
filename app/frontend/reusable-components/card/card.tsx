import React, { ReactNode } from 'react';

interface Props {
  children: ReactNode;
  title: string;
  description?: string;
  showWealthFrontLogo?: boolean;
}

export function Card({ children, title, description }: Props) {
  return (
    <section className="p-10 shadow-card min-h-[400px] w-full rounded-2xl border border-solid border-slate-200">
      {/* TODO: Create a general image component */}
      <h1 className="text-2xl text-center font-bold m-0 mb-1">{title}</h1>
      <p className="text-[hsla(243,30%,13%,.63)] text-base m-0 mb-1">{description}</p>
      {children}
    </section>
  );
}

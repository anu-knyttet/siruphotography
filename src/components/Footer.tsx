import React from "react";
import Image from "next/image";

const Footer: React.FC = () => (
  <footer className="bg-card py-6 text-primary">
    <div className="mx-auto px-4 container">
      <div className="flex md:flex-row flex-col justify-between items-center">
        <div className="mb-4 md:mb-0">
          <Image src={"/mainlogo2.png"} alt="Siru Bhurtel Photography Logo" width={128} height={90} />
        </div>
        <div className="flex flex-col items-center md:items-end">
          <p className="mt-4 text-primary text-xs">&copy; 2025 anuvette. All rights reserved.</p>
          <p className="mt-1 text-muted-foreground text-xs">
            Contact:{" "}
            <a href="mailto:anuvette.dev@gmail.com" className="hover:text-primary underline">
              anuvette.dev@gmail.com
            </a>
          </p>
        </div>
      </div>
    </div>
  </footer>
);

export default Footer;

'use client';
import Image from "next/image";
import { FormEvent, useState } from "react";
import * as WebpageService from '@/services/webpage.service'
import { URL_REGEX } from "@/constants/regex";

export default function Home() {
  const [isGenerating, setIsGenerating] = useState<boolean>(false);

  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const url = (e.target as unknown as Array<{value:string}>)[0].value
    await generatePDF(url)
  }

  const generatePDF = async (url: string) => {
    setIsGenerating(true)
    const res = await WebpageService.getContent({url});
    if (res) {
      const link = document.createElement('a');
      link.href = URL.createObjectURL(res);
      link.download = `${url}.pdf`;
      link.click();
    }
    setIsGenerating(false)
  }

  return (
    <div className="grid grid-rows-[20px_1fr_20px] items-center justify-items-center min-h-screen p-8 pb-20 gap-16 sm:p-20 font-[family-name:var(--font-geist-sans)]">
      <main className="flex flex-col gap-[32px] row-start-2 items-center">
        <Image
          src="/pdf.svg"
          alt="PDF Generator logo"
          width={75}
          height={75}
          priority
        />
        <span className="text-white text-center">Drop in a valid URL — I will turn the webpage into a PDF for you</span>
        <form onSubmit={handleSubmit} className="flex items-center rounded-full border border-white border-4">
          <input 
            required 
            type="url" 
            pattern={`${URL_REGEX}`.slice(1, -1)}
            placeholder="http://example.com"
            className="w-full md:min-w-[500px] outline-none px-8 py-4" 
            disabled={isGenerating}
            />
          <button className="p-4" type="submit">
            {
              isGenerating? 
              <Image
                src="/loading.svg"
                alt="Loading Icon"
                width={36}
                height={36}
                priority
                className="animate-spin"
              /> : 
              <Image
                src="/generate.svg"
                alt="Generate Icon"
                width={32}
                height={32}
                priority
              />
            }
            
          </button>
        </form>
      </main>
      <footer className="row-start-3 flex gap-[24px] flex-wrap items-center justify-center">
        by 👩‍💻 Mldyh
      </footer>
    </div>
  );
}

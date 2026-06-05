"use client";

import React from "react";
import {
  Dialog,
  DialogContent,
  DialogTrigger,
  DialogTitle,
} from "@/components/ui/dialog";
import { X } from "lucide-react";
import * as DialogPrimitive from "@radix-ui/react-dialog";

export function ImagePreview({ children, src, alt }: { children: React.ReactNode; src: string; alt?: string }) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <div className="cursor-zoom-in active:scale-95 transition-transform">
          {children}
        </div>
      </DialogTrigger>
      
      {/* We use !max-w-none to ensure we kill the default 512px width.
         We set the height to 100dvh (dynamic viewport height) for mobile browser compatibility.
      */}
      <DialogContent className="!max-w-[100vw] w-screen h-[100dvh] rounded-none md:rounded-2xl p-0 border-none bg-black/90 md:bg-transparent shadow-none flex items-center justify-center z-[100]">
        <DialogTitle className="sr-only">Image Preview</DialogTitle>
        
        <div className="relative w-full h-full flex items-center justify-center p-4 md:p-10">
          <img
            src={src}
            alt={alt || "Preview"}
            className="w-full h-full object-contain animate-in zoom-in-95 duration-300"
          />
          
          <DialogPrimitive.Close className="absolute top-6 right-6 text-white/70 hover:text-white transition-colors p-2 rounded-full bg-white/10 backdrop-blur-md">
            <X size={28} />
            <span className="sr-only">Close</span>
          </DialogPrimitive.Close>
        </div>
      </DialogContent>
    </Dialog>
  );
}
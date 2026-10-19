"use client";
import { workExperience } from "../constants/workExperience";
import clsx from "clsx";
import { AnimatePresence, motion } from "framer-motion";
import React, { useState } from "react";
import { BsCheck2 } from "react-icons/bs";
import {
  Briefcase,
  Code2,
  Megaphone,
  Palette,
  Users,
} from "lucide-react";
import { sentenceCase } from "@/util/sentenceCase";
import Beam from "./Beam/Beam";

const roleIcons: Record<string, typeof Briefcase> = {
  "Product Marketing": Megaphone,
  "Product Design": Palette,
  "Community Builder": Users,
  "Frontend Developer": Code2,
};

export const Experience = () => {
  const [activeWorkExperience, setActiveWorkExperience] = useState<
    (typeof workExperience)[number] | null
  >(workExperience[0]);
  return (
    <div className="max-w-5xl px-8">
      <h1 className="text-white tracking-tight text-2xl md:text-3xl font-bold max-w-5xl mx-auto mt-20 md:mt-20">
        Work experience
      </h1>
      <p className="text-zinc-400 text-sm md:text-base max-w-2xl mt-4 leading-loose tracking-tight">
        My previous work experiences.
      </p>
      <div className="relative mt-6 flex flex-col">
        <div className="absolute -left-6 top-0 bottom-0 w-px overflow-hidden bg-zinc-800">
          <Beam showBeam={true} className="-left-0" />
        </div>
        {workExperience.map((exp, idx) => {
          const isActive = activeWorkExperience?.company === exp.company;
          const RoleIcon = roleIcons[exp.role] ?? Briefcase;

          return (
            <div key={`exp-${idx}`} className="relative my-2">
              <button
                onClick={() =>
                  setActiveWorkExperience((active) =>
                    active?.company === exp.company ? null : exp,
                  )
                }
                aria-expanded={isActive}
                className={clsx(
                  "relative z-20 flex w-full min-w-28 flex-row items-center space-x-2 rounded-md px-4 py-2 text-left text-zinc-400 transition-colors hover:bg-zinc-800 group",
                  isActive ? "bg-zinc-800" : null,
                )}
              >
                <div className="flex h-6 w-6 items-center justify-center rounded-full bg-gradient-to-br from-zinc-700 to-zinc-800 p-1">
                  <RoleIcon className="h-3 w-3 text-zinc-300" aria-hidden="true" />
                </div>
                <span>{exp.company}</span>
              </button>
              <AnimatePresence initial={false}>
                {isActive && (
                  <motion.div
                    key={`details-${exp.company}`}
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                    className="overflow-hidden"
                  >
                    <div className="ml-10 mt-3 border-l border-zinc-800 pb-2 pl-4">
                      <h2 className="text-2xl font-bold text-zinc-100">
                        {sentenceCase(exp.role)}
                      </h2>
                      <p className="text-sm text-zinc-400">{exp.location}</p>
                      <div>
                        {exp.description.map((bullet, bulletIndex) => (
                          <div
                            key={`bullet-${bulletIndex}`}
                            className="my-2 flex flex-row items-start space-x-2"
                          >
                            <BsCheck2 className="mt-[3px] flex-shrink-0 text-cyan-500" />
                            <span className="text-sm text-zinc-400">
                              {sentenceCase(bullet)}
                            </span>
                          </div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </div>
  );
};

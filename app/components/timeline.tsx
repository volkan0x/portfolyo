import { timeline } from "@/app/constants/timeline";
import React from "react";
import { HiOutlineCheckCircle } from "react-icons/hi2";
import Beam from "./Beam/Beam";

export const Timeline = () => {
  return (
    <div className="max-w-3xl mx-auto divide-zinc-600 ">
      <div>
        {/* <div>
          <div className="absolute h-full w-[4px] bg-gradient-to-b from-transparent via-cyan-500 to:transparent  -left-4 md:-left-10">
            <Beam showBeam={true} className={`left-1`} />
          </div>
          <iframe
            style={{ border: "6px solid rgba(55, 55, 55, 1)" }}
            width="800"
            height="450"
            src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2Fxf78qajJVUM6wFB9eFs05I%2FGrowtechie-Web-App%3Fnode-id%3D6595-788%26t%3DCAqVvHtlXM0YOyv1-1"
            allowFullScreen
            title="Figma Embed"
          ></iframe>
        </div> */}
        <div className="py-8">
          <iframe
            className="block w-full max-w-full"
            style={{
              border: "6px solid rgba(55, 55, 55, 1)",
              width: "100%",
              height: "auto",
              aspectRatio: "16 / 9",
            }}
            width="800"
            height="450"
            src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2Fl1XXJcmWTxDBWcofrqZUeN%2Fflora-garden-hotel%3Fnode-id%3D0-394%26t%3DzTkFcST4RbDElvsg-1"
            allowFullScreen
            title="Figma Embed"
          ></iframe>
        </div>
        {/* <div>
          <iframe
            style={{ border: "6px solid rgba(55, 55, 55, 1)" }}
            width="800"
            height="450"
            src="https://www.figma.com/embed?embed_host=share&url=https%3A%2F%2Fwww.figma.com%2Fdesign%2F7aWeBm0DFKHlPPgQkqNQ9l%2FLayka-DAO%3Fnode-id%3D0-1%26t%3DGYLe07o6ljLBMiS9-1"
            allowFullScreen
            title="Figma Embed"
          ></iframe>
        </div> */}
      </div>
    </div>
  );
};

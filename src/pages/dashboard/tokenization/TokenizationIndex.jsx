import Tokenization from "./Tokenization";
import React from "react";

function TokenizationIndex() {
  return (
    <>
      <h1 className="font-bold md:hidden text-[#B0B0B0] text-xl mb-[5.91vh] pl-4 ">
        Welcome!
      </h1>
      <p className="text-[#D9D9D9] text-[0.625rem] py-[1.85vh] px-[1.41vw] bg-[#191B1D] border-[1.5px] border-dashed border-[#585858] rounded-[0.9375rem] mb-[2.31vh] hidden md:block ">
        Lorem ipsum, dolor sit amet consectetur adipisicing elit. Corrupti, modi
        nostrum excepturi, veniam molestiae sed alias rem, ut sint doloremque
        vero unde saepe adipisci iure quam dolore fuga facere aspernatur!
      </p>
      <Tokenization />
    </>
  );
}

export default TokenizationIndex;

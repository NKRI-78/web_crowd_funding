"use client";

import { useState } from "react";
import PublisherForm from "./FormPenerbit";
import FormPenerbit from "@/app/components/inputFormPenerbit/FormPenerbit";

export default function MultiStepFormWrapper() {
  const [selectedIndex, setSelectedIndex] = useState(0);

  const next = () => setSelectedIndex((prev) => prev + 1);
  const prev = () => setSelectedIndex((prev) => prev - 1);

  return (
    <div>
      {selectedIndex === 0 && <PublisherForm onNext={next} />}
      {selectedIndex === 1 && <FormPenerbit onBack={prev} />}
    </div>
  );
}

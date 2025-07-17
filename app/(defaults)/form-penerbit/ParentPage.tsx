"use client";

import FormPenerbit2 from "@/app/components/inputFormPenerbit/FormPenerbit";
import { useState } from "react";

const FormPenerbitPage: React.FC = () => {
  const [pageIndex, setPageIndex] = useState(1);

  return (
    <div>
      {/* {pageIndex === 0 && <FormPenerbitPunyaUdin handlePageIndex={() => {setPageIndex(1)}} />} */}
      {pageIndex === 1 && (
        <FormPenerbit2
          handlePageChanged={() => {
            setPageIndex(0);
          }}
        />
      )}
    </div>
  );
};

export default FormPenerbitPage;

"use client";

import { useEffect, useState } from "react";
import PublisherForm from "./FormPenerbit";
import FormPenerbit from "@/app/components/inputFormPenerbit/FormPenerbit";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";

export default function MultiStepFormWrapper() {
  const searchParams = useSearchParams();
  const [userProfile, setUserProfile] = useState();
  const [selectedIndex, setSelectedIndex] = useState(0);

  const next = () => setSelectedIndex((prev) => prev + 1);
  const prev = () => setSelectedIndex((prev) => prev - 1);

  useEffect(() => {
    const isUpdate = searchParams.get("update") ?? false;
    if (isUpdate) getUser();
  }, []);

  const getUser = async () => {
    try {
      const userString = localStorage.getItem("user");
      if (!userString) return;
      const userJSON = JSON.parse(userString);

      const res = await axios(`${API_BACKEND}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${userJSON.token}`,
        },
      });

      setUserProfile(res.data);
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {selectedIndex === 0 && <PublisherForm onNext={next} />}
      {selectedIndex === 1 && <FormPenerbit onBack={prev} />}
    </div>
  );
}

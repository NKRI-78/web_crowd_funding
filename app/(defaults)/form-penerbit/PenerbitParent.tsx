"use client";

import { useEffect, useState } from "react";
import PublisherForm from "./FormPenerbit";
import FormPenerbit from "@/app/components/inputFormPenerbit/FormPenerbit";
import { useSearchParams } from "next/navigation";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";
import { ProfileUpdate, publisherUpdateKeys } from "./UpdateProfileInterface";
import Cookies from "js-cookie";

function getFormIndex(form: string | null): number {
  console.log("get form index, form= " + form);
  if (!form) return 0;
  if (publisherUpdateKeys.includes(form)) {
    return 0;
  } else {
    return 1;
  }
}

export default function MultiStepFormWrapper() {
  const searchParams = useSearchParams();
  const isUpdate = searchParams.get("update");
  const form = searchParams.get("form");
  const [userProfile, setUserProfile] = useState<ProfileUpdate | null>(null);

  const [selectedIndex, setSelectedIndex] = useState(
    isUpdate ? getFormIndex(form) : 0
  );

  const next = () => setSelectedIndex((prev) => prev + 1);
  const prev = () => setSelectedIndex((prev) => prev - 1);

  useEffect(() => {
    if (isUpdate) getUser();
  }, [isUpdate]);

  const getUser = async () => {
    try {
      const userCookie = Cookies.get("user");
      if (!userCookie) return null; // ✅ tambahkan return

      const userJson = JSON.parse(userCookie);

      const res = await axios(`${API_BACKEND}/api/v1/profile`, {
        headers: {
          Authorization: `Bearer ${userJson.token}`,
        },
      });

      console.log("update profile? " + isUpdate);
      console.log("profile = ");
      console.log(res.data["data"]);

      setUserProfile({ ...res.data["data"], form: form });
    } catch (error) {
      console.log(error);
    }
  };

  return (
    <div>
      {selectedIndex === 0 && (
        <PublisherForm
          onNext={next}
          profile={userProfile}
          isUpdate={isUpdate !== null}
        />
      )}
      {selectedIndex === 1 && (
        <FormPenerbit
          onBack={prev}
          profile={userProfile}
          isUpdate={isUpdate !== null}
        />
      )}
    </div>
  );
}

"use client";

import {
  InvestorData,
  InvestorDataPortfolio,
} from "@/app/interfaces/investor/IInvestorData";
import React, { useEffect, useState } from "react";
import { PanelContainer } from "../PanelContainer";
import GridView from "../../GridView";
import PortfolioCard from "../../portfolio/PortfolioCard";
import { getUser } from "@/app/lib/auth";
import axios from "axios";
import { API_BACKEND } from "@/app/utils/constant";

const PortfolioView: React.FC = () => {
  const [loading, setLoading] = useState(true);
  const [investorData, setInvestorData] = useState<InvestorData | null>(null);
  const [portfolios, setPortofolios] = useState<InvestorDataPortfolio[]>([]);

  //* fetch data
  useEffect(() => {
    setLoading(true);

    const user = getUser();

    if (user) {
      const fetchInvestorData = async () => {
        try {
          const res = await axios.get(
            `${API_BACKEND}/api/v1/dashboard/investor`,
            {
              headers: {
                Authorization: `Bearer ${user.token}`,
              },
            }
          );

          const data = res.data.data;
          setInvestorData(data);
          setPortofolios(data.portfolio ?? []);
        } catch (error) {
          setInvestorData(null);
        } finally {
          setLoading(false);
        }
      };
      fetchInvestorData();
    }
  }, []);

  return (
    <>
      {portfolios.length > 0 ? (
        <PanelContainer>
          <GridView
            items={portfolios}
            gapClass="gap-4"
            breakpointCols={{ sm: 2, md: 2, lg: 4 }}
            itemKey={(p) => p.project_uid}
            renderItem={(p) => {
              return (
                <PortfolioCard
                  data={p}
                  hasRekeningEfek={investorData?.rek_efek}
                />
              );
            }}
          />
        </PanelContainer>
      ) : (
        <div className="h-full flex justify-center">
          <p className="mt-52 text-gray-800">Belum ada portfolio</p>
        </div>
      )}
    </>
  );
};

export default PortfolioView;

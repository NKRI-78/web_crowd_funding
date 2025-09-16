import { InvestorData } from "@/app/interfaces/investor/IInvestorData";
import React from "react";
import { PanelContainer } from "./PanelContainer";
import GridView from "../GridView";
import PortfolioCard from "../portfolio/PortfolioCard";

interface Props {
  investorData: InvestorData | null;
}

const DashboardPortfolio: React.FC<Props> = ({ investorData }) => {
  const portfolio = investorData?.portfolio ?? [];

  return (
    <PanelContainer>
      <h2 className="font-bold text-lg text-black mb-5">Portfolio</h2>

      <GridView
        items={portfolio}
        gapClass="gap-4"
        breakpointCols={{ sm: 2, md: 2, lg: 4 }}
        itemKey={(p) => p.project_uid}
        renderItem={(p) => {
          return (
            <PortfolioCard data={p} hasRekeningEfek={investorData?.rek_efek} />
          );
        }}
      />
    </PanelContainer>
  );
};

export default DashboardPortfolio;

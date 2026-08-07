import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import SiteList from "./SiteList";

const SiteSection = () => {
  return (
    <Card className="rounded-3xl border-slate-200 shadow-sm">
      <CardHeader>
        <CardTitle className="text-lg">Sites</CardTitle>
        <p className="text-sm text-slate-500">
          {" "}
          Manage patrol sites and their associated sub-sites.{" "}
        </p>
      </CardHeader>
      <CardContent>
        <SiteList />
      </CardContent>
    </Card>
  );
};

export default SiteSection;

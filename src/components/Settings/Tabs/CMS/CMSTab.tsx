"use client";

import { useState } from "react";
import { Save } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import RichTextEditor from "@/components/common/Editor/RichTextEditor";

const CMSTab = () => {
  const [privacyPolicy, setPrivacyPolicy] = useState("");
  const [terms, setTerms] = useState("");

  const handleSavePrivacyPolicy = () => {
    console.log("Privacy Policy:", privacyPolicy);

    // API call
  };

  const handleSaveTerms = () => {
    console.log("Terms:", terms);

    // API call
  };

  return (
    <div className="space-y-6">
      {/* Privacy Policy */}
      <Card>
        <CardHeader>
          <CardTitle>Privacy Policy</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <RichTextEditor value={privacyPolicy} onChange={setPrivacyPolicy} />

          <div className="flex justify-end">
            <Button onClick={handleSavePrivacyPolicy}>
              <Save className="mr-2 h-4 w-4" />
              Save Privacy Policy
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Terms */}
      <Card>
        <CardHeader>
          <CardTitle>Terms & Conditions</CardTitle>
        </CardHeader>

        <CardContent className="space-y-4">
          <RichTextEditor value={terms} onChange={setTerms} />

          <div className="flex justify-end">
            <Button onClick={handleSaveTerms}>
              <Save className="mr-2 h-4 w-4" />
              Save Terms & Conditions
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default CMSTab;

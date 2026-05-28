import { useState } from "react";
import { Eye, EyeOff, Key } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { SettingToggle } from "../../SettingToggle";


const passwordPolicies = [
    {
        title: "Minimum 8 characters",
        description: "Require at least 8 characters",
        defaultChecked: true,
    },
    {
        title: "Require uppercase letters",
        description: "At least one uppercase letter",
        defaultChecked: true,
    },
    {
        title: "Require numbers",
        description: "At least one numeric character",
        defaultChecked: true,
    },
    {
        title: "Require special characters",
        description: "At least one special character",
    },
];

const SecurityTab = () => {
    const [showApiKey, setShowApiKey] = useState(false);

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-2xl font-semibold">
                    Security Settings
                </h2>

                <p className="text-muted-foreground">
                    Configure security policies and access controls
                </p>
            </div>

            <div className="grid grid-cols-1 gap-6 xl:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>
                            API Security
                        </CardTitle>

                        <CardDescription>
                            Manage API keys and access
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium">
                                API Key
                            </label>

                            <div className="flex gap-2">
                                <Input
                                    type={
                                        showApiKey
                                            ? "text"
                                            : "password"
                                    }
                                    value="vgl_sk_live_a1b2c3d4e5f6g7h8i9j0k1l2m3n4o5p6"
                                    readOnly
                                />

                                <Button
                                    variant="outline"
                                    size="icon"
                                    onClick={() =>
                                        setShowApiKey(
                                            (prev) => !prev
                                        )
                                    }
                                >
                                    {showApiKey ? (
                                        <EyeOff className="h-4 w-4" />
                                    ) : (
                                        <Eye className="h-4 w-4" />
                                    )}
                                </Button>
                            </div>
                        </div>

                        <div className="flex flex-wrap gap-2">
                            <Button
                                variant="outline"
                                size="sm"
                            >
                                <Key className="mr-2 h-4 w-4" />
                                Regenerate Key
                            </Button>

                            <Button
                                variant="outline"
                                size="sm"
                            >
                                Copy Key
                            </Button>
                        </div>

                        <SettingToggle
                            title="Rate Limiting"
                            description="1000 requests per hour"
                            defaultChecked
                        />
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>
                            Password Policy
                        </CardTitle>

                        <CardDescription>
                            Configure password requirements
                        </CardDescription>
                    </CardHeader>

                    <CardContent className="space-y-4">
                        {passwordPolicies.map(
                            (policy) => (
                                <SettingToggle
                                    key={policy.title}
                                    {...policy}
                                />
                            )
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default SecurityTab;
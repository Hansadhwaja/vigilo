import { Guard } from "@/apis/guardsApi";
import CustomHeader from "@/components/common/Header/CustomHeader";
import { Button } from "@/components/ui/button";
import { Mail, Phone } from "lucide-react";
import { Link } from "react-router-dom";

const GuardDetailsHeader = ({ guard }: { guard: Guard }) => {
    return (
        <CustomHeader
            previousLink="/hr"
            title={guard.name}
            description="Complete guard profile with contact information and shift history"
            others={
                <div className="flex gap-3">

                    <Button variant="outline" asChild>
                        <Link to={`tel:${guard.mobile}`}>
                            <Phone className="h-5 w-5 mr-2" />
                            Call
                        </Link>
                    </Button>

                    <Button variant="outline" asChild>
                        <Link to={`mailto:${guard.email}`}>
                            <Mail className="h-5 w-5 mr-2" />
                            Email
                        </Link>
                    </Button>

                </div>
            }
        />
    );
};

export default GuardDetailsHeader;
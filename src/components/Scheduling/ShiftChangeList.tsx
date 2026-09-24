import React from "react";
import ShiftChangeCard from "./ShiftChangeCard";
import { ShiftChangeRequest } from "@/store/apis/schedulingAPI";

interface Props {
  shiftChangeRequests: ShiftChangeRequest[];
}

const ShiftChangeList = ({ shiftChangeRequests }: Props) => {
  return (
    <div>
      {shiftChangeRequests.map((request) => (
        <ShiftChangeCard key={request.id} request={request} />
      ))}
    </div>
  );
};

export default ShiftChangeList;

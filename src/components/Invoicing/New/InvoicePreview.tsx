"use client";

import { Alarm } from "@/apis/alarmsAPI";
import { Order } from "@/apis/ordersApi";
import { RootState } from "@/apis/store";
import { Client } from "@/apis/usersApi";

import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

import { useFormContext, useWatch } from "react-hook-form";
import { useSelector } from "react-redux";

interface InvoicePreviewProps {
  clients: Client[];
}

const formatCurrency = (val: number) =>
  new Intl.NumberFormat("en-IN", {
    style: "currency",
    currency: "INR",
  }).format(val);

const formatDate = (date?: string) => {
  if (!date) return "-";
  return new Intl.DateTimeFormat("en-IN", {
    day: "2-digit",
    month: "short",
    year: "numeric",
  }).format(new Date(date));
};

const InvoicePreview = ({
  clients
}: InvoicePreviewProps) => {
  const { control } = useFormContext();

  const serviceData = useSelector((s: RootState) => s.servicePricing.data);

  const [
    invoiceDate,
    clientId,
    billingFrom,
    billingTo,
    orders,
    alarms,
    services,
  ] = useWatch({
    control,
    name: [
      "invoiceDate",
      "clientId",
      "billingFrom",
      "billingTo",
      "orders",
      "alarms",
      "services",
    ],
  }) as any;

  const client = clients.find((c) => c.id === clientId);
  let grandTotal = 0;

  return (
    <Card className="p-0 shadow-md">
      <CardContent className="p-0">
        <div className="bg-black p-4 text-white">
          <CardHeader className="px-0 heading">
            VIGILO
          </CardHeader>
          <CardDescription className="text-gray-200">
            Security Management Services
          </CardDescription>
        </div>

        <div className="p-4 space-y-4">
          <div>
            <h3 className="text-sm text-gray-500">Invoice Date</h3>
            <p className="font-medium">{formatDate(invoiceDate)}</p>
          </div>

          <Separator />

          <div>
            <p className="text-sm text-gray-500">Billed To</p>
            <h3 className="font-semibold text-lg">
              {client?.name || "Client"}
            </h3>
            <p className="text-sm text-gray-600">
              Period: {formatDate(billingFrom)} - {formatDate(billingTo)}
            </p>
          </div>

          <Separator />


          <div className="space-y-3">
            <h3 className="font-semibold">Line Items</h3>

            {orders.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600">
                  Orders
                </h4>

                {orders.map((o) => {

                  const service = serviceData[o.title];
                  const price = service.priceType == "daily" ? service.dailyPrice : service.hourlyPrice;
                  const duration = service.priceType == "daily" ? `${o.days} days` : `${o.hours} hrs`;
                  const durationValue = service.priceType == "daily" ? o.days : o.hours;
                  const total = (durationValue || 0) * Number(price);
                  grandTotal += total
                  return (
                    <div
                      key={o.id}
                      className="flex justify-between py-2"
                    >
                      <div>
                        <p className="font-medium">{o.title}</p>
                        <p className="text-sm text-gray-500">
                          {duration} × ₹{price}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(total)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {alarms.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600">
                  Alarms
                </h4>

                {alarms.map((a) => {
                  const total = (a.hours || 0) * (a.price || 0);

                  return (
                    <div
                      key={a.id}
                      className="flex justify-between py-2"
                    >
                      <div>
                        <p>{a.alarmType}</p>
                        <p className="text-sm text-gray-500">
                          {a.hours} hrs × ₹{a.price}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(total)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}

            {services?.length > 0 && (
              <div>
                <h4 className="text-sm font-semibold text-gray-600">
                  Services
                </h4>

                {services.map((s: any, i: number) => {
                  const total = (s.days || 0) * (s.price || 0);
                  grandTotal += total;
                  return (
                    <div
                      key={i}
                      className="flex justify-between py-2"
                    >
                      <div>
                        <p>{s.title}</p>
                        <p className="text-sm text-gray-500">
                          {Number(s.days)} days × ₹{Number(s.price)}
                        </p>
                      </div>
                      <p className="font-semibold">
                        {formatCurrency(total)}
                      </p>
                    </div>
                  );
                })}
              </div>
            )}
          </div>

          <Separator />

          {/* Total */}
          <div className="flex justify-between text-lg font-bold">
            <p>Total</p>
            <p>{formatCurrency(grandTotal)}</p>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default InvoicePreview;
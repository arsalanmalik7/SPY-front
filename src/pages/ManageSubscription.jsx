import React, { useState, useEffect } from "react";
import Card from "../components/common/card";
import Button from "../components/common/button";
import Badge from "../components/common/badge";
import Input from "../components/common/input";
import Dropdown from "../components/common/dropdown";
import SubscriptionTable from "../components/common/subscriptions-table";
import moment from "moment";
import authService from "../services/authService";
import { SubscriptionService } from "../services/subscriptionService";
import Modal from "../components/common/modal";
import { useStripe } from "@stripe/react-stripe-js";
import { Snackbar, Alert } from "@mui/material";

const subscriptionStatusOptions = [
  { value: "", label: "All Status" },
  { value: "active", label: "Active" },
  { value: "expired", label: "Expired" },
];

const locationSubscriptions = [
  {
    name: "Restaurant A",
    location: "123 Main St, NY",
    status: "Active",
    start: "Jan 15, 2025",
    nextBilling: "Mar 15, 2025",
  },
];

const StripeLogo = () => (
  <span
    className="inline-block align-middle mr-2 font-bold text-xs tracking-wide text-white"
    style={{
      fontFamily: "Inter, Arial, sans-serif",
      minWidth: "38px",
      textAlign: "center",
    }}
  >
    stripe
  </span>
);

export default function ManageSubscription() {
  const [subscription, setSubscription] = useState();
  const [statusFilter, setStatusFilter] = useState(
    subscriptionStatusOptions[0]
  );
  const [search, setSearch] = useState("");
  const [multiLocationModalOpen, setMultiLocationModalOpen] = useState(false);
  const [multiLocationCount, setMultiLocationCount] = useState(2);
  const [plans, setPlans] = useState([]);
  const stripe = useStripe();
  const [snackbarOpen, setSnackbarOpen] = useState(false);
  const [snackbarMessage, setSnackbarMessage] = useState("");
  const [snackbarSeverity, setSnackbarSeverity] = useState("error");
  const [transactions, setTransactions] = useState([]);

  const userRole = localStorage.getItem("userRole");

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const resp = await authService.getProfile();
        setSubscription(resp);
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchUser();

    // Fetch plan details
    const fetchPlans = async () => {
      try {
        const planResp = await SubscriptionService.getPlans();
        setPlans(planResp);
      } catch (error) {
        console.log(error, "error");
      }
    };
    fetchPlans();

    const fetchAllTransactions = async () => {
      try {
        const transactions = await SubscriptionService.getAllTransactions();
        setTransactions(transactions);
      } catch (error) {
        console.log(error, "error");
      }
    };
    userRole === "super_admin" && fetchAllTransactions();
  }, [userRole]);

  // On Stripe checkout success, update subscription info
  useEffect(() => {
    (async () => {
      try {
        // Fetch latest subscription info from backend
        const sub = await authService.getProfile();
        setSubscription(sub);
      } catch (e) {
        setSnackbarMessage("Failed to update subscription after payment.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    })();
  }, []);

  // Find Stripe plan IDs
  const freePlan = plans.find(
    (p) => p.unit_amount === 0 && p?.product?.name === "Free trial"
  );
  const singleLocationPlan = plans.find((p) => p.unit_amount === 7999); // $79.99/month
  const multiLocationPlan = plans.find(
    (p) => p.unit_amount === 0 && p?.product?.name === "Multi Location"
  );

  // Placeholder checkout handler
  const handleCheckout = async (planId, quantity = 1, amountDollars, type) => {
    if (!stripe) {
      setSnackbarMessage("Stripe is not loaded yet.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
      return;
    }
    try {
      const isFreeTrial = type === "free";
      const res = await SubscriptionService.createCheckoutSession(
        planId,
        quantity,
        amountDollars,
        isFreeTrial
      );
      const data = res;
      if (data.id) {
        const { error } = await stripe.redirectToCheckout({
          sessionId: data.id,
        });
        if (error) {
          setSnackbarMessage(error.message || "Stripe checkout failed.");
          setSnackbarSeverity("error");
          setSnackbarOpen(true);
        } else {
          try {
            // Fetch latest subscription info from backend
            const sub = await authService.getProfile();
            setSubscription(sub);
            setSnackbarMessage("Subscription updated successfully.");
            setSnackbarSeverity("success");
            setSnackbarOpen(true);
          } catch (e) {
            setSnackbarMessage("Failed to update subscription after payment.");
            setSnackbarSeverity("error");
            setSnackbarOpen(true);
          }
        }
      } else {
        setSnackbarMessage("Failed to create Stripe session.");
        setSnackbarSeverity("error");
        setSnackbarOpen(true);
      }
    } catch (err) {
      setSnackbarMessage("Error creating Stripe session.");
      setSnackbarSeverity("error");
      setSnackbarOpen(true);
    }
  };

  const pricePerLocation = singleLocationPlan
    ? singleLocationPlan.unit_amount / 100
    : 79.99; // Stripe amount is in cents
  const endDate = moment.utc(subscription?.current_subscription?.end_date);
  const startDate = moment.utc(subscription?.current_subscription?.start_date);
  const currentPlan = subscription?.current_subscription?.plan;
  const billingAmount = subscription?.current_subscription?.amount;
  const locationQuantity = subscription?.current_subscription?.locations;

  let billingHistory = [];

  if (endDate) {
    billingHistory = [
      {
        invoice: moment.utc(endDate).format("MMM D, YYYY"),
        amount: billingAmount,
        plan: currentPlan,
        status: "Paid",
      },
    ];
  }
  const nowUTC = moment.utc();
  const remainingDaysInExpiry = endDate.diff(nowUTC, "days");

  const nextBillingDate = endDate
    ? moment.utc(endDate).format("MMM D, YYYY")
    : null;

  return (
    <div className="max-w-7xl mx-auto p-2 md:p-6 w-full">
      {/* Show subscription options if not subscribed via Stripe */}
      {(!subscription?.current_subscription?.status &&
        subscription?.current_subscription?.status !== undefined) ||
      (subscription?.current_subscription?.plan === "Free trial" &&
        userRole !== "super_admin") ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          {/* Free Plan */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-card p-6 flex flex-col justify-between">
            <div>
              <div className="text-lg font-semibold mb-2">Free</div>
              <div className="text-2xl font-bold mb-2">$0</div>
              <ul className="text-sm text-gray-700 mb-4 list-disc pl-5 space-y-1">
                <li>1 location</li>
                <li>Basic menu management</li>
                <li>Limited staff training</li>
                <li>Only Unit 1 is unlocked</li>
              </ul>
            </div>
            {subscription?.current_subscription?.plan === "Free trial" ? (
              <div>
                <Button className="bg-gray-300 w-full mt-2">
                  You're on a free trial
                </Button>
              </div>
            ) : (
              <Button
                className="bg-primary text-white w-full mt-2"
                onClick={() => handleCheckout(freePlan?.id, 1, 0, "free")}
              >
                Choose Free
              </Button>
            )}
          </div>
          {/* Single Location Plan */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-card p-6 flex flex-col justify-between">
            <div>
              <div className="text-lg font-semibold mb-2">Single Location</div>
              <div className="text-2xl font-bold mb-2">
                $79.99<span className="text-base font-normal">/month</span>
              </div>
              <ul className="text-sm text-gray-700 mb-4 list-disc pl-5 space-y-1">
                <li>1 location</li>
                <li>Full menu management</li>
                <li>Staff training access</li>
                <li>Email support</li>
              </ul>
            </div>
            <Button
              className="bg-primary text-white w-full mt-2"
              onClick={() =>
                singleLocationPlan &&
                handleCheckout(
                  singleLocationPlan.id,
                  1,
                  singleLocationPlan?.amount_decimal,
                  "single"
                )
              }
            >
              Subscribe
            </Button>
          </div>
          {/* Multi-Location Plan */}
          <div className="bg-white border border-gray-200 rounded-lg shadow-card p-6 flex flex-col justify-between">
            <div>
              <div className="text-lg font-semibold mb-2">Multi-Location</div>
              <div className="text-2xl font-bold mb-2">
                ${Number(multiLocationCount * 79.99).toFixed(2)}
                <span className="text-base font-normal">/month</span>
              </div>
              <ul className="text-sm text-gray-700 mb-4 list-disc pl-5 space-y-1">
                <li>Custom number of locations</li>
                <li>Full menu management</li>
                <li>Staff training access</li>
                <li>24/7 support</li>
              </ul>
            </div>
            <Button
              className="bg-primary text-white w-full mt-2"
              onClick={() => setMultiLocationModalOpen(true)}
            >
              Subscribe
            </Button>
          </div>
        </div>
      ) : null}
      {subscription?.current_subscription?.status &&
      subscription?.current_subscription?.plan !== "Free trial" &&
      userRole !== "super_admin" ? (
        <>
          <div className="flex items-stretch mb-4">
            <div className="w-1.5 rounded-l-md bg-[#C1121F]" />
            <div className="flex-1 bg-[#FDECEC] border border-[#F9CFCF] rounded-r-md px-4 py-3 flex items-center">
              <svg
                className="w-4 h-4 text-[#C1121F] mr-2"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M12 9v2m0 4h.01M21 12c0 4.97-4.03 9-9 9s-9-4.03-9-9 4.03-9 9-9 9 4.03 9 9z"
                />
              </svg>
              <span className="text-sm text-[#C1121F]">
                Your subscription will expire in {remainingDaysInExpiry} days
              </span>
            </div>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-4">
            <div className="bg-white border text-left border-gray-200 rounded-lg shadow-card p-4 flex flex-col justify-between min-h-[100px]">
              <div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">Current Plan</div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                  <div className="font-medium text-lg">{currentPlan}</div>
                  <span className="inline-block">
                    <Badge
                      variant="warning"
                      className="!bg-[#FFE066] !text-gray-900 ml-2"
                    >
                      Active
                    </Badge>
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white text-left border border-gray-200 rounded-lg shadow-card p-4 flex flex-col justify-between min-h-[100px]">
              <div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Billing Cycle{" "}
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                  <div className="font-medium text-lg">Monthly</div>
                  <span className="text-base font-normal">
                    ${billingAmount}/month
                  </span>
                </div>
              </div>
            </div>
            <div className="bg-white text-left border border-gray-200 rounded-lg shadow-card p-4 flex flex-col justify-between min-h-[100px]">
              <div>
                <div>
                  <div className="text-xs text-gray-500 mb-1">
                    Next Billing Date
                  </div>
                </div>
                <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
                  <div className="font-medium text-lg">{nextBillingDate}</div>
                  <span className="text-base font-normal">
                    {remainingDaysInExpiry} days left
                  </span>
                </div>
              </div>
            </div>
          </div>

          <Card className="mb-4">
            <div className="font-semibold flex flex-col text-left text-lg mb-2">
              Plan Management
              <span className="text-base font-normal">
                Current Plan Features
              </span>
            </div>

            <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-2 gap-2">
              <ul className="text-sm text-left text-gray-700 mb-4 list-disc pl-5 space-y-1">
                <li>Up to {locationQuantity} locations included</li>
                <li>Full menu management</li>
                <li>Staff training access</li>
                <li>24/7 support</li>
              </ul>

              {/* <div className="">
                <Button
                  className="bg-[#C1121F] hover:bg-[#C1121F]/80 w-full md:w-80 flex items-center justify-center text-white"
                  variant="primary"
                >
                  <StripeLogo />
                  Manage Plan in Stripe
                </Button>
              </div> */}
            </div>
          </Card>

          {/* <Card className="mb-4">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-2 mb-3">
              <div className="font-semibold text-lg">
                Location Subscriptions
              </div>
              <div className="flex gap-2 w-full md:w-auto">
                <Input
                  id="search-locations"
                  value={search}
                  onChange={(e) => setSearch(e.target.value)}
                  placeholder="Search locations..."
                  className="w-full md:w-64"
                />
                <Dropdown
                  label="All Status"
                  options={subscriptionStatusOptions}
                  selectedOption={statusFilter.label}
                  onSelect={setStatusFilter}
                  className="w-32 bg-background"
                />
              </div>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-md">
                <thead>
                  <tr className="bg-[#FFA944]">
                    <th className="px-4 py-2 text-left font-semibold">
                      Restaurant Name
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Location
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Status
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Start Date
                    </th>
                    <th className="px-4 py-2 text-left font-semibold">
                      Next Billing
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {locationSubscriptions.map((loc, i) => (
                    <tr key={i} className="border-t">
                      <td className="px-4 py-2">{loc.name}</td>
                      <td className="px-4 py-2">{loc.location}</td>
                      <td className="px-4 py-2">
                        <Badge variant="warning">{loc.status}</Badge>
                      </td>
                      <td className="px-4 py-2">{loc.start}</td>
                      <td className="px-4 py-2">{loc.nextBilling}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card> */}

          <Card>
            <div className="font-semibold text-left text-lg mb-3">
              Billing History
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full text-sm border rounded-md">
                <thead>
                  <tr className="bg-[#FFA944] text-left">
                    {" "}
                    {/* apply alignment to whole row */}
                    <th className="px-4 py-2 font-semibold">Invoice Date</th>
                    <th className="px-4 py-2 font-semibold">Amount</th>
                    <th className="px-4 py-2 font-semibold">Plan Type</th>
                    <th className="px-4 py-2 font-semibold">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {billingHistory.map((bill, i) => (
                    <tr key={i} className="border-t text-left">
                      {" "}
                      {/* align row cells */}
                      <td className="px-4 py-2">{bill.invoice}</td>
                      <td className="px-4 py-2">{bill.amount}</td>
                      <td className="px-4 py-2">{bill.plan}</td>
                      <td className="px-4 py-2">
                        <Badge variant="warning">{bill.status}</Badge>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </Card>
        </>
      ) : null}

      {userRole === "super_admin" &&
        (transactions ? (
          <SubscriptionTable transactions={transactions} />
        ) : (
          <div>No record found.</div>
        ))}

      {/* Multi-Location Modal */}
      <Modal
        isOpen={multiLocationModalOpen}
        onClose={() => setMultiLocationModalOpen(false)}
      >
        <div className="p-6">
          <h2 className="text-lg font-semibold mb-4">
            Select Number of Locations
          </h2>
          <input
            type="number"
            min={2}
            max={20}
            value={multiLocationCount}
            onChange={(e) => setMultiLocationCount(Number(e.target.value))}
            className="border rounded px-2 py-1 w-24 text-lg font-bold mb-4"
            style={{ appearance: "textfield" }}
          />
          <div className="mb-4">
            Total:{" "}
            <span className="font-bold">
              ${Number(multiLocationCount * pricePerLocation).toFixed(2)}/month
            </span>
          </div>
          <div className="flex gap-2">
            <Button
              className="bg-primary text-white flex-1"
              onClick={async () => {
                setMultiLocationModalOpen(false);
                if (multiLocationPlan) {
                  const amountDollars = (
                    multiLocationCount * pricePerLocation
                  ).toFixed(2);
                  await handleCheckout(
                    multiLocationPlan?.product?.id,
                    multiLocationCount,
                    amountDollars,
                    "multi"
                  );
                }
              }}
            >
              Confirm
            </Button>
            <Button
              className="bg-gray-300 flex-1"
              onClick={() => setMultiLocationModalOpen(false)}
            >
              Cancel
            </Button>
          </div>
        </div>
      </Modal>
      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={() => setSnackbarOpen(false)}
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
      >
        <Alert
          onClose={() => setSnackbarOpen(false)}
          severity={snackbarSeverity}
          sx={{ width: "100%" }}
        >
          {snackbarMessage}
        </Alert>
      </Snackbar>
    </div>
  );
}

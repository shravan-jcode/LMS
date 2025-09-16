import React, { useEffect } from "react";
import { Button } from "./ui/button";
import { useCreateCheckoutSessionMutation } from "../features/api/purchaseApi";
import { Loader2 } from "lucide-react";
import { toast } from "sonner";

const BuyCourseButton = ({ courseId }) => {
  const [
    createCheckoutSession,
    { data, isLoading, isSuccess, isError, error },
  ] = useCreateCheckoutSessionMutation();

  const purchaseCourseHandler = async () => {
    try {
      await createCheckoutSession(courseId).unwrap();
    } catch (err) {
      toast.error(err?.data?.message || "Failed to initiate checkout");
    }
  };

  useEffect(() => {
    if (isSuccess && data?.orderId) {
      const options = {
        key: import.meta.env.VITE_RAZORPAY_API_KEY,
        amount: data.amount,
        currency: data.currency,
        name: "LMS",
        description: "Course Purchase",
        order_id: data.orderId,
        prefill: {
          name: "shravan",
          email: "shravan@example.com",
          contact: "9999999999",
        },
        theme: { color: "#2563eb" }, // Tailwind blue-600
        handler: async function (response) {
          try {
            const res = await fetch(
              `${import.meta.env.VITE_BACKEND_URL}/checkout/verify-payment`,
              {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                credentials: "include",
                body: JSON.stringify(response),
              }
            );
            const result = await res.json();
            if (result.success)
              toast.success("✅ Payment successful & course unlocked!");
            else toast.error(result.message || "Payment verification failed");
          } catch {
            toast.error("Payment verification error");
          }
        },
      };
      const rzp = new window.Razorpay(options);
      rzp.open();
    }

    if (isError) {
      toast.error(error?.data?.message || "Failed to checkout");
    }
  }, [data, isSuccess, isError, error]);

  return (
    <Button
      disabled={isLoading}
      onClick={purchaseCourseHandler}
      className="
        w-full rounded-2xl px-8 py-3 
        bg-gradient-to-r from-teal-600 to-cyan-600
        hover:from-teal-700 hover:to-cyan-700
        text-white font-semibold text-lg shadow-lg
        transform transition-all duration-300 ease-in-out hover:scale-105
        disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none
        dark:from-teal-500 dark:to-cyan-500 
        dark:hover:from-teal-600 dark:hover:to-cyan-600
        focus-visible:ring-2 focus-visible:ring-teal-400
      "
    >
      {isLoading ? (
        <>
          <Loader2 className="mr-2 h-5 w-5 animate-spin" /> Please Wait...
        </>
      ) : (
        "💳 Purchase Course"
      )}
    </Button>
  );
};

export default BuyCourseButton;
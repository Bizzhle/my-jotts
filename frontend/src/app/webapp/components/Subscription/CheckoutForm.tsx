import { Button, Container, Toolbar, Typography } from "@mui/material";
import {
  Elements,
  PaymentElement,
  useElements,
  useStripe,
} from "@stripe/react-stripe-js";
import { Appearance, loadStripe } from "@stripe/stripe-js";
import React, { useContext, useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { LayoutContext } from "../../layout/LayoutContext";

const stripeKey = import.meta.env.VITE_API_STRIPE_PUBLISHABLE_KEY;
const domain = import.meta.env.VITE_API_DOMAIN;
const stripePromise = loadStripe(stripeKey);

const CheckoutForm: React.FC = () => {
  const stripe = useStripe();
  const elements = useElements();
  const navigate = useNavigate();
  const [name] = useState("");
  const [messages, setMessages] = useState<string>("");

  const setMessage = (message?: string) => {
    setMessages((prevMessages) => `${prevMessages}\n\n${message}`);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLElement>) => {
    e.preventDefault();

    if (!stripe || !elements) {
      // Stripe.js has not loaded yet. Make sure to disable
      // form submission until Stripe.js has loaded.
      return;
    }

    const { error } = await stripe.confirmPayment({
      elements,
      confirmParams: {
        return_url: `${domain}/account`,
        payment_method_data: {
          billing_details: {
            name: name,
          },
        },
      },
    });

    if (error) {
      setMessage(error.message);
      return;
    } else {
      alert("Success! Check your email for the invoice.");
    }
    navigate("/account", { replace: false });
  };

  return (
    <Container maxWidth="md">
      <Toolbar />
      {messages && (
        <Typography color="error" sx={{ ml: 3 }}>
          {messages}
        </Typography>
      )}{" "}
      <form onSubmit={handleSubmit}>
        <PaymentElement
          options={{
            layout: "tabs",
            defaultValues: {
              billingDetails: {
                name: "auto",
                email: "auto",
              },
            },
          }}
        />
        <Button variant="contained" type="submit" disabled={!stripe}>
          Subscribe
        </Button>
      </form>
    </Container>
  );
};

const WrappedCheckoutForm: React.FC = () => {
  const location = useLocation();
  const { clientSecret } = location.state || {};
  const { hideSearchBar } = useContext(LayoutContext);

  useEffect(() => {
    hideSearchBar();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const appearance: Appearance = {
    theme: "stripe",
    variables: {
      colorPrimary: "#0570de",
      colorBackground: "#ffffff",
      colorText: "#30313d",
      colorDanger: "#df1b41",
      fontFamily: "Ideal Sans, system-ui, sans-serif",
      spacingUnit: "2px",
      borderRadius: "4px",
    },
    rules: {
      ".Label": {
        color: "#30313d",
      },
    },
  };

  const options = {
    clientSecret: clientSecret,
    appearance: appearance,
  };

  return (
    <Elements stripe={stripePromise} options={options}>
      <CheckoutForm />
    </Elements>
  );
};

export default WrappedCheckoutForm;

import {
  Body,
  Container,
  Head,
  Heading,
  Html,
  Preview,
  Section,
  Text,
} from "@react-email/components";
import * as React from "react";

interface ContactEmailProps {
  name: string;
  email: string;
  message: string;
}

export function ContactEmailTemplate({
  name,
  email,
  message,
}: ContactEmailProps) {
  return (
    <Html>
      <Head />
      <Preview>New contact message from {name}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Section style={header}>
            <Text style={headerText}>
              👻 New Contact Request — QuickOnboardDoc
            </Text>
          </Section>

          <Section style={content}>
            <Heading style={heading}>Message from {name}</Heading>

            <Section style={infoSection}>
              <Text style={infoText}>
                <strong>Name:</strong> {name}
              </Text>
              <Text style={infoText}>
                <strong>Email:</strong> {email}
              </Text>
            </Section>

            <Section style={messageBox}>
              <Text style={messageText}>{message}</Text>
            </Section>

            <Text style={footerNote}>
              This message was submitted via the QuickOnboardDoc Contact page.
            </Text>
          </Section>

          <Section style={footer}>
            <Text style={footerText}>
              © {new Date().getFullYear()} QuickOnboardDoc. All rights reserved.
            </Text>
          </Section>
        </Container>
      </Body>
    </Html>
  );
}

const main = {
  backgroundColor: "#f9fafb",
  fontFamily: "Arial, sans-serif",
};

const container = {
  margin: "0 auto",
  padding: "20px 0",
  maxWidth: "600px",
  backgroundColor: "#ffffff",
  borderRadius: "8px",
  overflow: "hidden",
  boxShadow: "0 4px 10px rgba(0,0,0,0.05)",
};

const header = {
  background: "linear-gradient(90deg, #8b5cf6, #a78bfa)",
  padding: "20px 32px",
  textAlign: "center" as const,
};

const headerText = {
  color: "#ffffff",
  fontSize: "20px",
  fontWeight: "bold",
  margin: "0",
};

const content = {
  padding: "32px",
};

const heading = {
  fontSize: "22px",
  marginBottom: "16px",
  color: "#1f2937",
};

const infoSection = {
  marginBottom: "24px",
};

const infoText = {
  fontSize: "15px",
  lineHeight: "1.6",
  margin: "8px 0",
  color: "#1f2937",
};

const messageBox = {
  backgroundColor: "#f9fafb",
  border: "1px solid #e5e7eb",
  borderRadius: "6px",
  padding: "16px",
  marginBottom: "24px",
};

const messageText = {
  fontSize: "15px",
  color: "#374151",
  lineHeight: "1.6",
  margin: "0",
  whiteSpace: "pre-wrap" as const,
};

const footerNote = {
  fontSize: "13px",
  color: "#6b7280",
  textAlign: "center" as const,
  margin: "24px 0 0 0",
};

const footer = {
  backgroundColor: "#f3f4f6",
  padding: "16px",
  textAlign: "center" as const,
};

const footerText = {
  fontSize: "13px",
  color: "#6b7280",
  margin: "0",
};

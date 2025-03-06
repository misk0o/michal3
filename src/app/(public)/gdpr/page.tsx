// app/gdpr/page.tsx

import GdprView from "@/sections/GdprView";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";

export const metadata = { title: "GDPR | michal3" };

export default function GdprPage() {
  return (
    <Container maxWidth="md" sx={{ padding: "2rem" }}>
      <Typography variant="h4" component="h1" gutterBottom>
        General Data Protection Regulation (GDPR)
      </Typography>
      <Typography variant="body1" paragraph>
        At **michal3**, we take your privacy seriously and are committed to protecting your personal data in accordance with the General Data Protection Regulation (GDPR). This regulation is designed to give individuals more control over their personal data and ensure its safe processing by businesses and organizations.
      </Typography>
      <Typography variant="body1" paragraph>
        By using our website, you agree to the collection and processing of your personal information as described in our privacy policy. We only collect data necessary for the proper functioning of our services, and we ensure that this data is handled securely and used solely for its intended purpose.
      </Typography>
      <Typography variant="body1" paragraph>
        You have the right to access, rectify, or delete your personal data at any time. If you have any questions or concerns about your data, please feel free to contact us through our support channels.
      </Typography>
      <GdprView />
    </Container>
  );
}

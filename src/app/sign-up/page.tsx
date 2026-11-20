import { AuthForm } from "@/components/auth-form";
export default function SignUpPage() {
  const registrationEnabled=Boolean(process.env.RESEND_API_KEY&&process.env.AUTH_EMAIL_FROM);
  return <AuthForm mode="signup" registrationEnabled={registrationEnabled}/>;
}

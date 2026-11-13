export function SocialIcon({ name }: { name: "facebook-f" | "instagram" | "linkedin-in" | "tiktok" }) {
  return <i className={`fab fa-${name}`} aria-hidden="true" />;
}

import { Separator } from "@/components/ui/separator"

export default function Footer() {
  return (
    <footer className="w-full bg-background">
      <Separator />
      <p className="py-3 text-center text-sm text-muted-foreground">
        © Powered by Nax-D Cloudworks LLP
      </p>
    </footer>
  )
}

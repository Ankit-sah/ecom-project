import { useRouter } from "next/navigation"

export const useNavigateToLink = () => {
  const router = useRouter()
  const navigateToLink = (link: string, refresh: boolean = false) => {
    refresh && router.refresh()
    router.push(link)
  }
  return navigateToLink
}

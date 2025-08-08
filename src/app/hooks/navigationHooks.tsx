import { useRouter } from "next/navigation"

export const useNavigateToLink = () => {
  const router = useRouter();

  const navigateToLink = (link: string, refresh: boolean = false) => {
    if (refresh) {
      router.refresh();
    }
    router.push(link);
  };

  return navigateToLink;
};

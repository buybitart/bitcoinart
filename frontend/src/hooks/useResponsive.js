import { useMediaQuery } from 'react-responsive'

const useResponsive = () => {
    const isBigDesktop = useMediaQuery({
        query: "(min-width: 1739px)"
    });
    const isDesktop = useMediaQuery({
        query: "(min-width: 768px)"
      });
      const isBigLaptop = useMediaQuery({
        query: "(max-width: 1280px)"
      })
      const isLaptop = useMediaQuery({
        query: "(max-width: 990px)"
      });
      const isTablet = useMediaQuery({
        query: "(min-width: 551px) and (max-width: 850px)"
      });
      const isMobile = useMediaQuery({
        query: "(max-width: 550px)"
      });
      const isSmallMobile = useMediaQuery({
        query: "(max-width: 370px)"
      });
      return {isBigDesktop, isDesktop, isBigLaptop, isLaptop, isTablet, isMobile, isSmallMobile}
}

export default useResponsive
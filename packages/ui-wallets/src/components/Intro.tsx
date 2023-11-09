import { AtomBox } from '@pancakeswap/ui/components/AtomBox'
import { Button, LinkExternal } from '@pancakeswap/uikit'
import { useCallback, useState } from 'react'
// eslint-disable-next-line import/no-unresolved
import { Autoplay } from 'swiper'
import 'swiper/css/bundle'
import { Swiper } from 'swiper/react'
import { Swiper as SwiperClass } from 'swiper/types'

const StepDot = ({ active, place, onClick }: { active: boolean; place: 'left' | 'right'; onClick: () => void }) => (
  <AtomBox padding="4px" onClick={onClick} cursor="pointer">
    <AtomBox
      bgc={active ? 'secondary' : 'inputSecondary'}
      width="56px"
      height="8px"
      borderLeftRadius={place === 'left' ? 'card' : '0'}
      borderRightRadius={place === 'right' ? 'card' : '0'}
    />
  </AtomBox>
)

export const StepIntro = ({ docLink, docText }: { docLink: string; docText: string }) => {
  const [step, setStep] = useState(0)
  const [swiper, setSwiper] = useState<SwiperClass | undefined>(undefined)

  const handleRealIndexChange = useCallback((swiperInstance: SwiperClass) => {
    setStep(swiperInstance.realIndex)
  }, [])

  const handleStepClick = useCallback(
    (stepIndex: number) => {
      return () => {
        setStep(stepIndex)
        swiper?.slideTo(stepIndex)
      }
    },
    [swiper],
  )

  return (
    <AtomBox
      display="flex"
      width="100%"
      flexDirection="column"
      style={{ gap: '24px' }}
      mx="auto"
      my="48px"
      textAlign="center"
      alignItems="center"
    >
      <Swiper
        initialSlide={0}
        modules={[Autoplay]}
        slidesPerView="auto"
        onSwiper={setSwiper}
        autoplay={{
          delay: 5000,
          disableOnInteraction: false,
        }}
        onRealIndexChange={handleRealIndexChange}
        centeredSlides
        loop
        style={{ marginLeft: '0px', marginRight: '0px' }}
      />

      <AtomBox display="flex">
        <StepDot place="left" active={step === 0} onClick={handleStepClick(0)} />
        <StepDot place="right" active={step === 1} onClick={handleStepClick(1)} />
      </AtomBox>
      <Button minHeight={40} variant="subtle" external as={LinkExternal} color="backgroundAlt" href={docLink}>
        {docText}
      </Button>
    </AtomBox>
  )
}
